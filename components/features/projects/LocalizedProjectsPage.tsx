"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import LocalizedProjects from "@components/features/projects/LocalizedProjects";
import Section from "@/components/ui/Section";

type Project = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
};

type Props = {
  projects: {
    en: Project[];
    tr: Project[];
  };
};

export default function LocalizedProjectsPage({ projects }: Props) {
  const { t, locale } = useTranslation();

  return (
    <Section title={t("nav.projects")}>
      <LocalizedProjects projects={projects[locale]} />
    </Section>
  );
}
