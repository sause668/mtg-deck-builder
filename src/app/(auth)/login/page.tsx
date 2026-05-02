import Link from "next/link";

import { LoginForm } from "@/app/(auth)/_components/LoginForm";

export const metadata = {
  title: "Log in | MTG Deck Builder",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Log in
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
