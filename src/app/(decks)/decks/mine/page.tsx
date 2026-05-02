import { redirect } from "next/navigation";

import { MyDecksList } from "@/app/(decks)/_components/MyDecksList/MyDecksList";
import { listMyDecks } from "@/app/(decks)/_actions/deck-actions";
import { getUser } from "@/app/_actions/user-actions";

export const metadata = {
  title: "My decks | MTG Deck Builder",
};

export default async function MyDecksPage() {
  const userRes = await getUser();
  if (!userRes.ok) {
    redirect("/login");
  }

  const decks = await listMyDecks();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        My decks
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Includes private decks only you can open from here or by URL.
      </p>
      <div className="mt-8">
        <MyDecksList decks={decks} />
      </div>
    </div>
  );
}
