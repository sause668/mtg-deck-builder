import { DeckDirectory } from "@/app/(decks)/_components/DeckDirectory/DeckDirectory";
import { listPublicDecks } from "@/app/(decks)/_actions/deck-actions";

export const metadata = {
  title: "Community decks | MTG Deck Builder",
};

export default async function DecksPage() {
  const decks = await listPublicDecks();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Community decks
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Public decks from all users, newest updates first.
      </p>
      <div className="mt-8">
        <DeckDirectory decks={decks} />
      </div>
    </div>
  );
}
