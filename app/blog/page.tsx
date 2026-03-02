import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import LocalizedBlogPage from "@/components/features/blog/LocalizedBlogPage";

export const metadata: Metadata = {
  title: "Blog - Portfolio",
  description: "Blog posts.",
};

export default function Blog() {
  const enPosts = getAllPosts("en");
  const trPosts = getAllPosts("tr");

  return <LocalizedBlogPage posts={{ en: enPosts, tr: trPosts }} />;
}
