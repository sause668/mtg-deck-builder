"use client";

import { useActionState } from "react";

import {
  createDeck,
  type CreateDeckState,
} from "@/app/(decks)/_actions/deck-actions";

export function NewDeckForm() {
  const [state, formAction] = useActionState(
    createDeck,
    undefined as unknown as CreateDeckState,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Deck name
        </label>
        <input
          name="name"
          required
          maxLength={120}
          placeholder="e.g. Izzet Spells"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Visibility
        </legend>
        <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
          <input type="radio" name="isPublic" value="true" defaultChecked />
          Public — listed on Community
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
          <input type="radio" name="isPublic" value="false" />
          Private — only you can open the link
        </label>
      </fieldset>
      {state?.ok === false && state.message ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Create deck
      </button>
    </form>
  );
}
