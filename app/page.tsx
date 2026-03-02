import type { Metadata } from "next";
import profile from "../data/profile.json";
import LocalizedHome from "@components/features/home/LocalizedHome";
import FeaturedProjects from "@components/features/home/FeaturedProjects";

export const metadata: Metadata = {
  title: "Home - Portfolio",
  description: "Personal portfolio of " + (profile.name || "Developer"),
  openGraph: {
    title: "Home - Portfolio",
    description: "Personal portfolio of " + (profile.name || "Developer"),
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

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-background font-sans">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,200,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(120,80,200,0.08)_0%,transparent_70%)]" />

      <main className="relative w-full max-w-3xl px-6 py-24">
        <LocalizedHome />
        <FeaturedProjects projects={projects} />
      </main>
    </div>
  );
}
