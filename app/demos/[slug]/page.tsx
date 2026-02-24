import { getAllPosts, getPostBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Section from "@/components/ui/Section";

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Section>
      <main className="prose mx-auto py-10">
        <h1>{post.meta.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
    </Section>
  );
}