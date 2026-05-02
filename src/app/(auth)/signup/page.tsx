import Link from "next/link";

import { SignupForm } from "@/app/(auth)/_components/SignupForm";

export const metadata = {
  title: "Sign up | MTG Deck Builder",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Log in
        </Link>
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
