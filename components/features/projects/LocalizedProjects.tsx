"use client";

import React from "react";
import { useTranslation } from "@components/i18n/LanguageProvider";
import ProjectCard from "@components/features/projects/ProjectCard";

export default function LocalizedProjects({ limit }: { limit?: number }) {
  const { locale } = useTranslation();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (locale === "tr") {
        const mod = await import("@data/projects/projects.tr.json");
        const data = (mod as any).default ?? mod;
        if (mounted) setProjects(data as any[]);
        return;
      }
      const mod = await import("@data/projects/projects.en.json");
      const data = (mod as any).default ?? mod;
      if (mounted) setProjects(data as any[]);
    }
    load();
    return () => { mounted = false; };
  }, [locale]);

  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {list.map((p) => (
        <ProjectCard key={p.id} title={p.title} description={p.description} tags={p.tags} link={p.link} />
      ))}
    </div>
  );
}
