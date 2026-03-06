import { getAllPosts, getPostBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LocalizedPostDetail from "@/components/features/blog/LocalizedPostDetail";

// Generate static params for both languages
export async function generateStaticParams() {
  const trPosts = getAllPosts("tr");
  const enPosts = getAllPosts("en");
  const slugs = new Set([
    ...trPosts.map((p) => p.slug),
    ...enPosts.map((p) => p.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const enPost = await getPostBySlug(slug, "en");
  const post = enPost ?? (await getPostBySlug(slug, "tr"));

  if (!post) return {};

  const description = post.meta.excerpt
    ? post.meta.excerpt.slice(0, 160)
    : post.meta.title;

  return {
    title: post.meta.title + " - Blog",
    description,
    keywords: post.meta.tags,
    openGraph: {
      title: post.meta.title,
      description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [trPost, enPost] = await Promise.all([
    getPostBySlug(slug, "tr"),
    getPostBySlug(slug, "en"),
  ]);

  if (!trPost && !enPost) notFound();

  return <LocalizedPostDetail posts={{ en: enPost, tr: trPost }} />;
}