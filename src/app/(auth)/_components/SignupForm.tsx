"use client";

import { useActionState } from "react";

import { signupUser } from "@/app/_actions/user-actions";
import type { SignupFormState } from "@/app/lib/definitions";

export function SignupForm() {
  const [state, formAction] = useActionState(
    signupUser,
    undefined as SignupFormState,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {state?.errors?.email?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {state?.errors?.password?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
        ) : null}
      </div>
      {state?.message ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Create account
      </button>
    </form>
  );
}
