import type { JWTPayload } from "jose";
import { z } from "zod";

export type SessionPayload = JWTPayload & {
  userId: string;
  userRole: string;
  userRoleId: string;
};

export type ActionSuccess<T> = { ok: true; data: T };
export type ActionError = { ok: false; message: string };
export type ActionResponse<T> = ActionSuccess<T> | ActionError;

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const SignupFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Use at least 8 characters"),
});

export type LoginFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export type SignupFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export const CreateDeckSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateDeckSchema = z.object({
  deckId: z.number().int().positive(),
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  isPublic: z.boolean().optional(),
});

export const DeckCardInputSchema = z.object({
  deckId: z.number().int().positive(),
  scryfallId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
  name: z.string().min(1),
  imageSmall: z.string().optional().nullable(),
});

export const DeckCardIdSchema = z.object({
  deckId: z.number().int().positive(),
  deckCardId: z.number().int().positive(),
});

export const SetQuantitySchema = z.object({
  deckId: z.number().int().positive(),
  deckCardId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999),
});
