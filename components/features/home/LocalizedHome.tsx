"use client";

import Link from "next/link";
import { useTranslation } from "@components/i18n/LanguageProvider";
import profile from "@data/profile.json";

export default function LocalizedHome() {
  const { t } = useTranslation();

  return (
    <section className="text-center">
      <p className="text-sm text-zinc-500">{t("profile.role") || profile.role}</p>
      <h1 className="mt-4 text-4xl font-semibold">{profile.name}</h1>
      <p className="mt-4 max-w-xl mx-auto text-lg text-zinc-600">{t("profile.tagline") || profile.tagline}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/projects" className="rounded-full bg-foreground px-5 py-3 text-sm text-background">{t("home.see_projects")}</Link>
        <Link href="/contact" className="rounded-full border border-black/[.06] px-5 py-3 text-sm">{t("home.contact")}</Link>
      </div>
    </section>
  );
}
