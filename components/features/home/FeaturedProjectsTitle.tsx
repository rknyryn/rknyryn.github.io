"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";

export default function FeaturedProjectsTitle() {
  const { t } = useTranslation();
  return <h2 className="mb-6 text-2xl font-semibold">{t("home.featured_projects")}</h2>;
}
