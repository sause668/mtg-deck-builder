import { redirect } from "next/navigation";

import { NewDeckForm } from "@/app/(decks)/_components/NewDeck/NewDeckForm";
import { getUser } from "@/app/_actions/user-actions";

export const metadata = {
  title: "New deck | MTG Deck Builder",
};

export default async function NewDeckPage() {
  const userRes = await getUser();
  if (!userRes.ok) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        New deck
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Choose a name and visibility. You can add cards next.
      </p>
      <div className="mt-8">
        <NewDeckForm />
      </div>
    </div>
  );
}
