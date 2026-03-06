import type { Metadata } from "next";
import LocalizedNotFound from "@components/features/not-found/LocalizedNotFound";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
};

export default function NotFound() {
  return <LocalizedNotFound />;
}
