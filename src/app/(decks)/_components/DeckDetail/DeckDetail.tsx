import { CardSearch } from "@/app/(decks)/_components/DeckDetail/CardSearch";
import { DeckCardTable } from "@/app/(decks)/_components/DeckDetail/DeckCardTable";
import { DeckToolbar } from "@/app/(decks)/_components/DeckDetail/DeckToolbar";
import type { getDeckById } from "@/app/(decks)/_actions/deck-actions";

type Deck = NonNullable<Awaited<ReturnType<typeof getDeckById>>>;

export function DeckDetail({ deck }: { deck: Deck }) {
  const totalCards = deck.cards.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {deck.name}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Built by {deck.user.email} · {totalCards} total cards ·{" "}
          {deck.isPublic ? "Public" : "Private"}
        </p>
        {deck.description ? (
          <p className="max-w-2xl text-zinc-700 dark:text-zinc-300">
            {deck.description}
          </p>
        ) : null}
      </header>

      {deck.isOwner ? (
        <DeckToolbar deck={deck} />
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Cards
        </h2>
        {deck.isOwner ? <CardSearch deckId={deck.id} /> : null}
        <DeckCardTable
          deckId={deck.id}
          cards={deck.cards}
          isOwner={deck.isOwner}
        />
      </section>
    </div>
  );
}
