"use client";

import React from "react";
import { useTranslation } from "@components/i18n/LanguageProvider";
import profile from "@data/profile.json";
import Section from "@components/ui/Section";

export default function LocalizedContact() {
  const { t } = useTranslation();

  return (
    <Section title={t("nav.contact")}>
      <p className="mb-4">{t("contact.prompt") || "Let's get in touch — my email is below."}</p>
      <a href={`mailto:${profile.email || "you@example.com"}`} className="rounded-full bg-foreground px-4 py-2 text-sm text-background">
        {t("contact.email_me")}
      </a>
    </Section>
  );
}
