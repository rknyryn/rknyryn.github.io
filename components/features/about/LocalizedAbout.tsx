"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import Section from "@components/ui/Section";
import profile from "@data/profile.json";

export default function LocalizedAbout() {
  const { t } = useTranslation();

  return (
    <Section title={t("nav.about")}>
      <div className="prose max-w-none">
        <p>{t("profile.bio")}</p>
        <h3 className="mt-6 mb-2 text-sm font-semibold">{t("about.skills_title")}</h3>
        <div className="flex flex-wrap gap-2">
          {(profile.skills || ["Design", "Frontend"]).map((s: string) => (
            <span key={s} className="rounded-full bg-black/[.05] px-3 py-1 text-xs">{s}</span>
          ))}
        </div>
      </div>
    </Section>
  );
}
