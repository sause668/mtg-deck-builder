"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import type {
  ActionResponse,
  LoginFormState,
  SignupFormState,
} from "@/app/lib/definitions";
import { LoginFormSchema, SignupFormSchema } from "@/app/lib/definitions";
import {
  createSession,
  deleteSession,
  verifySession,
} from "@/app/lib/session";
import { prisma } from "@/lib/prisma";

const USER_ROLE = "user";

function sessionTriple(userId: number) {
  const id = String(userId);
  return { userId: id, userRoleId: id, userRole: USER_ROLE };
}

export async function getSession(): Promise<ActionResponse<{ userId: string }>> {
  const session = await verifySession();
  if (!session?.userId) {
    return { ok: false, message: "Not authenticated" };
  }
  return { ok: true, data: { userId: session.userId as string } };
}

export async function getUser(): Promise<
  ActionResponse<{ id: number; email: string }>
> {
  const session = await verifySession();
  if (!session?.userId) {
    return { ok: false, message: "Not authenticated" };
  }
  const id = Number.parseInt(session.userId as string, 10);
  if (Number.isNaN(id)) {
    return { ok: false, message: "Invalid session" };
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!user) {
    return { ok: false, message: "User not found" };
  }
  return { ok: true, data: user };
}

export async function getUserById(userId: string) {
  const id = Number.parseInt(userId, 10);
  if (Number.isNaN(id)) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, hashedPassword: true },
  });
}

export async function signupUser(
  _prev: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const parsed = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { message: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, hashedPassword },
  });

  const t = sessionTriple(user.id);
  await createSession(t.userId, t.userRole, t.userRoleId);
  redirect("/decks/mine");
}

export async function loginUser(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) {
    return { message: "Invalid email or password." };
  }

  const t = sessionTriple(user.id);
  await createSession(t.userId, t.userRole, t.userRoleId);
  redirect("/decks/mine");
}

export async function logoutUser() {
  await deleteSession();
  redirect("/");
}
