import Link from "next/link";

import { SiteHeaderNav } from "@/app/_components/SiteHeaderNav";
import { getUser } from "@/app/_actions/user-actions";

export async function SiteHeader() {
  const userRes = await getUser();
  const user = userRes.ok ? userRes.data : null;

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          MTG Deck Builder
        </Link>
        <SiteHeaderNav user={user} />
      </div>
    </header>
  );
}
