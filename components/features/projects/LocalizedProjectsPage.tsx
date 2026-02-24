"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import LocalizedProjects from "@components/features/projects/LocalizedProjects";
import Section from "@/components/ui/Section";

export default function LocalizedProjectsPage() {
  const { t } = useTranslation();

  return (
    <Section title={t("nav.projects")}>
      <LocalizedProjects />
    </Section>
  );
}
