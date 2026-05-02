import Link from "next/link";

import type { PublicDeckSummary } from "@/app/(decks)/_actions/deck-actions";

export function DeckDirectory({ decks }: { decks: PublicDeckSummary[] }) {
  if (decks.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No public decks yet.{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>{" "}
        and publish one.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40">
      {decks.map((d) => (
        <li key={d.id}>
          <Link
            href={`/decks/${d.id}`}
            className="flex flex-col gap-1 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {d.name}
              </span>
              <p className="text-sm text-zinc-500">
                by {d.user.email} · {d._count.cards} cards · updated{" "}
                {d.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
