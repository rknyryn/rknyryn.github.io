import type { Metadata } from "next";
import profile from "../../data/profile.json";
import LocalizedAbout from "@components/features/about/LocalizedAbout";

export const metadata: Metadata = {
  title: "About - Portfolio",
  description: profile.bio || "About",
};

export default function About() {
  return <LocalizedAbout />;
}
