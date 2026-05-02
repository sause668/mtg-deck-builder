import { notFound } from "next/navigation";

import { DeckDetail } from "@/app/(decks)/_components/DeckDetail/DeckDetail";
import { getDeckById } from "@/app/(decks)/_actions/deck-actions";

type PageProps = { params: Promise<{ deckId: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { deckId } = await params;
  const id = Number.parseInt(deckId, 10);
  if (Number.isNaN(id)) return { title: "Deck | MTG Deck Builder" };
  const deck = await getDeckById(id);
  if (!deck) return { title: "Deck | MTG Deck Builder" };
  return { title: `${deck.name} | MTG Deck Builder` };
}

export default async function DeckPage({ params }: PageProps) {
  const { deckId } = await params;
  const id = Number.parseInt(deckId, 10);
  if (Number.isNaN(id)) notFound();

  const deck = await getDeckById(id);
  if (!deck) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <DeckDetail deck={deck} />
    </div>
  );
}
