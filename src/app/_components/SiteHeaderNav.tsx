"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { logoutUser } from "@/app/_actions/user-actions";

type User = { id: number; email: string };

export function SiteHeaderNav({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (
        panelRef.current?.contains(t) ||
        buttonRef.current?.contains(t)
      ) {
        return;
      }
      close();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const linkClass =
    "block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800";
  const linkClassDesktop =
    "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

  return (
    <div className="relative flex items-center">
      {/* Desktop: inline nav at md+ (48rem) */}
      <nav className="hidden flex-wrap items-center gap-3 text-sm md:flex">
        <Link className={linkClassDesktop} href="/decks">
          Community
        </Link>
        {user ? (
          <>
            <Link className={linkClassDesktop} href="/decks/mine">
              My decks
            </Link>
            <Link className={linkClassDesktop} href="/decks/new">
              New deck
            </Link>
            <span className="max-w-[12rem] truncate text-zinc-500 dark:text-zinc-500">
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
            <Link className={linkClassDesktop} href="/login">
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

      {/* Mobile: menu toggle below md */}
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-zinc-300 p-2 text-zinc-800 hover:bg-zinc-100 md:hidden dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        aria-expanded={open}
        aria-controls="site-header-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Menu</span>
        {open ? (
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id="site-header-menu"
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,18rem)] rounded-lg border border-zinc-200 bg-white py-2 shadow-lg md:hidden dark:border-zinc-700 dark:bg-zinc-900"
          role="menu"
        >
          <Link
            className={linkClass}
            href="/decks"
            role="menuitem"
            onClick={close}
          >
            Community
          </Link>
          {user ? (
            <>
              <Link
                className={linkClass}
                href="/decks/mine"
                role="menuitem"
                onClick={close}
              >
                My decks
              </Link>
              <Link
                className={linkClass}
                href="/decks/new"
                role="menuitem"
                onClick={close}
              >
                New deck
              </Link>
              <div className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-700">
                {user.email}
              </div>
              <form action={logoutUser} className="px-1 pb-1">
                <button
                  type="submit"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  role="menuitem"
                  onClick={close}
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                className={linkClass}
                href="/login"
                role="menuitem"
                onClick={close}
              >
                Log in
              </Link>
              <div className="px-1 pb-1">
                <Link
                  className="block rounded-md bg-zinc-900 px-3 py-2 text-center text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  href="/signup"
                  role="menuitem"
                  onClick={close}
                >
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
