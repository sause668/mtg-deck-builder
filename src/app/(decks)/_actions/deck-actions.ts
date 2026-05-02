"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  CreateDeckSchema,
  DeckCardIdSchema,
  DeckCardInputSchema,
  SetQuantitySchema,
  UpdateDeckSchema,
} from "@/app/lib/definitions";
import { verifySession } from "@/app/lib/session";
import { prisma } from "@/lib/prisma";

async function requireOwnerUserId() {
  const session = await verifySession();
  if (!session?.userId) return null;
  const id = Number.parseInt(session.userId as string, 10);
  return Number.isNaN(id) ? null : id;
}

export type CreateDeckState =
  | { ok?: undefined; message?: string }
  | { ok: false; message: string };

export async function createDeck(
  _prevState: CreateDeckState | undefined,
  formData: FormData,
): Promise<CreateDeckState> {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false, message: "Sign in to create a deck." };
  }

  const parsed = CreateDeckSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    isPublic: formData.get("isPublic") !== "false",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input",
    };
  }

  const { name, description, isPublic } = parsed.data;
  const deck = await prisma.deck.create({
    data: {
      userId,
      name,
      description: description || null,
      isPublic: isPublic ?? true,
    },
  });

  revalidatePath("/decks");
  revalidatePath("/decks/mine");
  redirect(`/decks/${deck.id}`);
}

export async function updateDeck(input: unknown) {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false as const, message: "Sign in required." };
  }

  const parsed = UpdateDeckSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid input" };
  }

  const { deckId, ...rest } = parsed.data;
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });
  if (!deck) {
    return { ok: false as const, message: "Deck not found." };
  }

  await prisma.deck.update({
    where: { id: deckId },
    data: {
      ...(rest.name !== undefined ? { name: rest.name } : {}),
      ...(rest.description !== undefined
        ? { description: rest.description }
        : {}),
      ...(rest.isPublic !== undefined ? { isPublic: rest.isPublic } : {}),
    },
  });

  revalidatePath("/decks");
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/decks/mine");
  return { ok: true as const };
}

export async function deleteDeck(deckId: number) {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false as const, message: "Sign in required." };
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });
  if (!deck) {
    return { ok: false as const, message: "Deck not found." };
  }

  await prisma.deck.delete({ where: { id: deckId } });

  revalidatePath("/decks");
  revalidatePath("/decks/mine");
  redirect("/decks/mine");
}

export async function addOrUpdateCard(input: unknown) {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false as const, message: "Sign in required." };
  }

  const parsed = DeckCardInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid card data." };
  }

  const { deckId, scryfallId, quantity, name, imageSmall } = parsed.data;
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });
  if (!deck) {
    return { ok: false as const, message: "Deck not found." };
  }

  await prisma.deckCard.upsert({
    where: {
      deckId_scryfallId: { deckId, scryfallId },
    },
    create: {
      deckId,
      scryfallId,
      quantity,
      name,
      imageSmall: imageSmall ?? null,
    },
    update: {
      quantity: { increment: quantity },
      name,
      ...(imageSmall !== undefined && imageSmall !== null
        ? { imageSmall }
        : {}),
    },
  });

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/decks/mine");
  return { ok: true as const };
}

export async function setCardQuantity(input: unknown) {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false as const, message: "Sign in required." };
  }

  const parsed = SetQuantitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid input." };
  }

  const { deckId, deckCardId, quantity } = parsed.data;
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });
  if (!deck) {
    return { ok: false as const, message: "Deck not found." };
  }

  const row = await prisma.deckCard.findFirst({
    where: { id: deckCardId, deckId },
  });
  if (!row) {
    return { ok: false as const, message: "Card row not found." };
  }

  await prisma.deckCard.update({
    where: { id: deckCardId },
    data: { quantity },
  });

  revalidatePath(`/decks/${deckId}`);
  return { ok: true as const };
}

export async function removeCard(input: unknown) {
  const userId = await requireOwnerUserId();
  if (!userId) {
    return { ok: false as const, message: "Sign in required." };
  }

  const parsed = DeckCardIdSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid input." };
  }

  const { deckId, deckCardId } = parsed.data;
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId },
  });
  if (!deck) {
    return { ok: false as const, message: "Deck not found." };
  }

  await prisma.deckCard.deleteMany({
    where: { id: deckCardId, deckId },
  });

  revalidatePath(`/decks/${deckId}`);
  return { ok: true as const };
}

export async function listPublicDecks() {
  return prisma.deck.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { email: true } },
      _count: { select: { cards: true } },
    },
  });
}

export async function listMyDecks() {
  const userId = await requireOwnerUserId();
  if (!userId) return [];

  return prisma.deck.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { cards: true } },
    },
  });
}

export type PublicDeckSummary =
  Awaited<ReturnType<typeof listPublicDecks>>[number];
export type MyDeckSummary = Awaited<ReturnType<typeof listMyDecks>>[number];

export async function updateDeckFromForm(formData: FormData): Promise<void> {
  const deckId = Number(formData.get("deckId"));
  if (Number.isNaN(deckId)) return;
  const name = (formData.get("name") as string)?.trim() || undefined;
  const descriptionRaw = formData.get("description") as string | null;
  const description =
    descriptionRaw === "" || descriptionRaw === null
      ? null
      : descriptionRaw?.trim() ?? undefined;
  await updateDeck({
    deckId,
    name,
    description,
    isPublic: formData.get("isPublic") !== "false",
  });
}

export async function deleteDeckFromForm(formData: FormData): Promise<void> {
  const deckId = Number(formData.get("deckId"));
  if (Number.isNaN(deckId)) return;
  await deleteDeck(deckId);
}

export async function getDeckById(deckId: number) {
  const sessionUserId = await requireOwnerUserId();
  const viewerId = sessionUserId;

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      user: { select: { id: true, email: true } },
      cards: { orderBy: { name: "asc" } },
    },
  });

  if (!deck) return null;

  const isOwner = viewerId !== null && deck.userId === viewerId;
  const canView = deck.isPublic || isOwner;
  if (!canView) return null;

  return {
    ...deck,
    isOwner,
  };
}
