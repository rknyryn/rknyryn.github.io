"use client";

import Link from "next/link";
import { useTranslation } from "@components/i18n/LanguageProvider";

export default function LocalizedNotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 text-center">
      <p className="text-[12rem] font-black leading-none tracking-tighter text-zinc-200 select-none dark:text-zinc-800 sm:text-[18rem]">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t("not_found.title")}
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        {t("not_found.description")}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("not_found.go_home")}
      </Link>
    </div>
  );
}
