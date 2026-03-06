"use client";

import Link from "next/link";
import { useTranslation } from "@components/i18n/LanguageProvider";
import profile from "@data/profile.json";

export default function LocalizedHome() {
  const { t } = useTranslation();

  return (
    <section className="relative flex flex-col items-center text-center pt-8">
      {/* Role badge */}
      <span className="relative inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
        {t("profile.role") || profile.role}
      </span>

      {/* Name */}
      <h1 className="relative mt-6 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
        {profile.name}
      </h1>

      {/* Tagline */}
      <p className="relative mt-5 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
        {t("profile.tagline") || profile.tagline}
      </p>

      {/* CTA buttons */}
      <div className="relative mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/projects"
          className="min-w-40 rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-zinc-400/50 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:shadow-zinc-300/20"
        >
          {t("home.see_projects")}
        </Link>
        <Link
          href="/blog"
          className="min-w-40 rounded-full border border-zinc-200 bg-white/50 px-6 py-3 text-center text-sm font-medium text-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-zinc-300/60 hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:shadow-zinc-700/40"
        >
          {t("home.see_blog")}
        </Link>
      </div>
    </section>
  );
}
