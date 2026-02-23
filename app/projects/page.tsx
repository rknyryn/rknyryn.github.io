import type { Metadata } from "next";
import LocalizedProjectsPage from "@components/features/projects/LocalizedProjectsPage";

export const metadata: Metadata = {
  title: "Projects - Portfolio",
  description: "Selected projects.",
};

export default function Projects() {
  return <LocalizedProjectsPage />;
}
