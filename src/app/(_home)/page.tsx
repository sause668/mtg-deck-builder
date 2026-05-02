import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Build and share Magic decks
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Create decks, add cards from Scryfall, and browse lists published by
        other players.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/decks"
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Browse community decks
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
