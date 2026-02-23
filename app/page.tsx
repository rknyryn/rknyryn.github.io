import type { Metadata } from "next";
import profile from "../data/profile.json";
import LocalizedHome from "@components/features/home/LocalizedHome";
import LocalizedProjects from "@components/features/projects/LocalizedProjects";
import FeaturedProjectsTitle from "@components/features/home/FeaturedProjectsTitle";

export const metadata: Metadata = {
  title: "Home - Portfolio",
  description: "Personal portfolio of " + (profile.name || "Developer"),
  openGraph: {
    title: "Home - Portfolio",
    description: "Personal portfolio of " + (profile.name || "Developer"),
  },
};

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-background font-sans">
      <main className="w-full max-w-3xl px-6 py-24">
        <LocalizedHome />

        <section className="mt-16">
          <FeaturedProjectsTitle />
          <LocalizedProjects limit={4} />
        </section>
      </main>
    </div>
  );
}
