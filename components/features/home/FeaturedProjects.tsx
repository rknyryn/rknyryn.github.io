"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import LocalizedProjects from "@components/features/projects/LocalizedProjects";

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

export default function FeaturedProjects({ projects }: Props) {
  const { t, locale } = useTranslation();

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {t("home.featured_projects")}
        </h2>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <LocalizedProjects projects={projects[locale]} limit={2} />
    </section>
  );
}
