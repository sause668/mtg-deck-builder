import Link from "next/link";

import { getUser, logoutUser } from "@/app/_actions/user-actions";

export async function SiteHeader() {
  const userRes = await getUser();
  const user = userRes.ok ? userRes.data : null;

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          MTG Deck Builder
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href="/decks"
          >
            Community
          </Link>
          {user ? (
            <>
              <Link
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                href="/decks/mine"
              >
                My decks
              </Link>
              <Link
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                href="/decks/new"
              >
                New deck
              </Link>
              <span className="text-zinc-500 dark:text-zinc-500">
                {user.email}
              </span>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                href="/login"
              >
                Log in
              </Link>
              <Link
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
