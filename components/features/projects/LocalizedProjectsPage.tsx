"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import LocalizedProjects from "@components/features/projects/LocalizedProjects";

export default function LocalizedProjectsPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold">{t("nav.projects")}</h2>
      <LocalizedProjects />
    </section>
  );
}
