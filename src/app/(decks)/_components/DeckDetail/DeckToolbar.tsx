import {
  deleteDeckFromForm,
  updateDeckFromForm,
} from "@/app/(decks)/_actions/deck-actions";
import type { getDeckById } from "@/app/(decks)/_actions/deck-actions";

type Deck = NonNullable<Awaited<ReturnType<typeof getDeckById>>>;

export function DeckToolbar({ deck }: { deck: Deck }) {
  return (
    <div className="space-y-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <form action={updateDeckFromForm} className="space-y-4">
        <input type="hidden" name="deckId" value={deck.id} />
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Deck name
          </label>
          <input
            name="name"
            required
            defaultValue={deck.name}
            maxLength={120}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={deck.description ?? ""}
            maxLength={2000}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Visibility
          </legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="isPublic"
              value="true"
              defaultChecked={deck.isPublic}
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="isPublic"
              value="false"
              defaultChecked={!deck.isPublic}
            />
            Private
          </label>
        </fieldset>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Save changes
        </button>
      </form>

      <form action={deleteDeckFromForm} className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <input type="hidden" name="deckId" value={deck.id} />
        <button
          type="submit"
          className="text-sm text-red-600 hover:underline"
        >
          Delete deck
        </button>
      </form>
    </div>
  );
}
