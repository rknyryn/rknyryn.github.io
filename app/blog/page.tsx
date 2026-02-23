import type { Metadata } from "next";
import Section from "../../components/ui/Section";

export const metadata: Metadata = {
  title: "Blog - Portfolio",
  description: "Writing and notes.",
};

export default function Blog() {
  return (
    <Section title="Blog">
      <p className="text-zinc-600">No posts yet — this is a placeholder for blog entries or notes.</p>
    </Section>
  );
}
