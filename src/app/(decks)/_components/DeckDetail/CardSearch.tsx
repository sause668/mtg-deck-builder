"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";

import { addOrUpdateCard } from "@/app/(decks)/_actions/deck-actions";
import {
  pickSmallImage,
  type ScryfallCardPreview,
} from "@/app/lib/scryfall";

type SearchResponse =
  | { object: "list"; data: ScryfallCardPreview[]; has_more: boolean }
  | { object: "error"; details: string };

export function CardSearch({ deckId }: { deckId: number }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScryfallCardPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [searching, setSearching] = useState(false);

  const runSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }
      setSearching(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/scryfall/search?${new URLSearchParams({ q: q.trim() })}`,
        );
        const body = (await res.json()) as SearchResponse;
        if (body.object === "error") {
          setError(body.details ?? "Search failed");
          setResults([]);
          return;
        }
        setResults(body.data ?? []);
        if (res.status >= 400) {
          setError("No cards found or request error.");
        }
      } catch {
        setError("Network error");
        setResults([]);
      } finally {
        setSearching(false);
      }
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void runSearch(query);
    }, 350);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  function addCard(card: ScryfallCardPreview) {
    const image = pickSmallImage(card);
    startTransition(async () => {
      await addOrUpdateCard({
        deckId,
        scryfallId: card.id,
        quantity: 1,
        name: card.name,
        imageSmall: image ?? null,
      });
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Search Scryfall
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start typing a card name…"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {searching ? (
          <p className="mt-1 text-xs text-zinc-500">Searching…</p>
        ) : null}
        {error ? <p className="mt-1 text-xs text-amber-600">{error}</p> : null}
      </div>
      {results.length > 0 ? (
        <ul className="max-h-80 space-y-2 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50">
          {results.map((card) => {
            const img = pickSmallImage(card);
            return (
              <li
                key={card.id}
                className="flex items-center justify-between gap-2 rounded border border-zinc-200 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex min-w-0 items-center gap-2">
                  {img ? (
                    <Image
                      src={img}
                      alt=""
                      width={32}
                      height={44}
                      unoptimized
                      className="h-11 w-8 rounded object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                      {card.name}
                    </div>
                    <div className="truncate text-xs text-zinc-500">
                      {card.type_line}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => addCard(card)}
                  className="shrink-0 rounded bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  + Add
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
