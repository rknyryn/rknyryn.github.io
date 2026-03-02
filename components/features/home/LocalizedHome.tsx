"use client";

import Link from "next/link";
import { useTranslation } from "@components/i18n/LanguageProvider";
import profile from "@data/profile.json";

export default function LocalizedHome() {
  const { t } = useTranslation();

  return (
    <section className="relative flex flex-col items-center text-center pt-8">
      {/* Ambient glow behind name */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -top-12 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-sky-500/10 blur-[100px]" />

      {/* Role badge */}
      <span className="relative inline-block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
        {t("profile.role") || profile.role}
      </span>

      {/* Name with gradient text */}
      <h1 className="relative mt-6 bg-linear-to-b from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl dark:from-white dark:via-zinc-200 dark:to-zinc-500">
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
          className="group relative min-w-[160px] overflow-hidden rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 dark:bg-white dark:text-zinc-900 dark:hover:shadow-violet-400/20"
        >
          <span className="relative z-10">{t("home.see_projects")}</span>
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-violet-600 to-sky-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-10" />
        </Link>
        <Link
          href="/blog"
          className="min-w-[160px] rounded-full border border-zinc-200 bg-white/50 px-6 py-3 text-center text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
          {t("home.see_blog")}
        </Link>
      </div>

      {/* Subtle decorative line */}
      <div className="mt-16 h-px w-24 bg-linear-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
    </section>
  );
}
