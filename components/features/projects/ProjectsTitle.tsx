"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";

export default function ProjectsTitle() {
  const { t } = useTranslation();

  return <h1 className="text-3xl font-bold">{t("nav.projects")}</h1>;
}
