import type { Metadata } from "next";
import profile from "@data/profile.json";
import LocalizedContact from "@components/features/contact/LocalizedContact";

export const metadata: Metadata = {
  title: "Contact - Portfolio",
  description: `Contact ${profile.name}`,
};

export default function Contact() {
  return <LocalizedContact />;
}
