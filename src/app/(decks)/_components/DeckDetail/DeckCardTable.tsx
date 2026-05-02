"use client";

import Image from "next/image";
import { useTransition } from "react";

import {
  removeCard,
  setCardQuantity,
} from "@/app/(decks)/_actions/deck-actions";
import type { getDeckById } from "@/app/(decks)/_actions/deck-actions";

type Deck = NonNullable<Awaited<ReturnType<typeof getDeckById>>>;

export function DeckCardTable({
  deckId,
  cards,
  isOwner,
}: {
  deckId: number;
  cards: Deck["cards"];
  isOwner: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (cards.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No cards yet. Search above to add cards from Scryfall.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80">
          <tr>
            <th className="px-3 py-2">Card</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {cards.map((c) => (
            <tr key={c.id} className="bg-white dark:bg-zinc-950/40">
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  {c.imageSmall ? (
                    <Image
                      src={c.imageSmall}
                      alt=""
                      width={28}
                      height={39}
                      unoptimized
                      className="h-10 w-7 rounded object-cover"
                    />
                  ) : null}
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {c.name}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2">
                {isOwner ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={pending || c.quantity <= 1}
                      onClick={() =>
                        startTransition(async () => {
                          await setCardQuantity({
                            deckId,
                            deckCardId: c.id,
                            quantity: c.quantity - 1,
                          });
                        })
                      }
                      className="rounded border border-zinc-300 px-2 py-0.5 text-xs disabled:opacity-40 dark:border-zinc-600"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center tabular-nums">
                      {c.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={pending || c.quantity >= 999}
                      onClick={() =>
                        startTransition(async () => {
                          await setCardQuantity({
                            deckId,
                            deckCardId: c.id,
                            quantity: c.quantity + 1,
                          });
                        })
                      }
                      className="rounded border border-zinc-300 px-2 py-0.5 text-xs disabled:opacity-40 dark:border-zinc-600"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="tabular-nums text-zinc-900 dark:text-zinc-100">
                    {c.quantity}
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-right">
                {isOwner ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await removeCard({ deckId, deckCardId: c.id });
                      })
                    }
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
