"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Error
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        An unexpected error has occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Try again
      </button>
    </div>
  );
}
