import type { Metadata } from "next";
import profile from "@data/profile.json";
import LocalizedProjectsPage from "@components/features/projects/LocalizedProjectsPage";

export const metadata: Metadata = {
  title: "Projects - " + (profile.name || "Portfolio"),
  description: "Selected projects by " + (profile.name || "Developer") + ".",
  openGraph: {
    title: "Projects - " + (profile.name || "Portfolio"),
    description: "Selected projects by " + (profile.name || "Developer") + ".",
  },
};

async function getProjects() {
  const en = await import("@data/projects/projects.en.json").then(
    (mod) => (mod.default ?? mod) as Project[]
  );
  const tr = await import("@data/projects/projects.tr.json").then(
    (mod) => (mod.default ?? mod) as Project[]
  );
  return { en, tr };
}

type Project = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
};

export default async function Projects() {
  const projects = await getProjects();
  return <LocalizedProjectsPage projects={projects} />;
}
