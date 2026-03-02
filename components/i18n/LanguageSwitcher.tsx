"use client";

import { useTranslation } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLocale("en")}
        className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          locale === "en"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        }`}>
        EN
      </button>
      <button
        onClick={() => setLocale("tr")}
        className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          locale === "tr"
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        }`}>
        TR
      </button>
    </div>
  );
}
