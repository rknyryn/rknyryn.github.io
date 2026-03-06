"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import Section from "@/components/ui/Section";
import Link from "next/link";
import type { PostMeta } from "@/lib/content";

type PostData = {
  meta: PostMeta;
  content: string;
};

type Props = {
  posts: {
    en: PostData | null;
    tr: PostData | null;
  };
};

export default function LocalizedPostDetail({ posts }: Props) {
  const { locale, t } = useTranslation();

  const post = posts[locale] ?? posts["tr"];

  if (!post) return null;

  const dateLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        {/* Geri dönüş linki */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          {t("blog.back_to_blog")}
        </Link>

        {/* Başlık ve meta bilgisi */}
        <div className="mt-8 mb-8">
          <h1 className="bg-linear-to-b from-zinc-900 to-zinc-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-zinc-100 dark:to-zinc-400">
            {post.meta.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString(dateLocale, { timeZone: "UTC" })}
            </time>

            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{post.meta.readingTime} {t("blog.min_read")}</span>

            {post.meta.series && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="font-medium text-zinc-600 dark:text-zinc-300">
                  {post.meta.series}
                </span>
              </>
            )}

            {post.meta.chapter && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>
                  {t("blog.chapter")} {post.meta.chapter}
                </span>
              </>
            )}
          </div>

          {/* Tag'ler */}
          {post.meta.tags && post.meta.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.meta.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mb-10 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

        {/* İçerik - Prose styling ile */}
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Alt divider + geri dönüş */}
        <div className="mt-14 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
        <div className="mt-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            {t("blog.back_to_blog")}
          </Link>
        </div>
      </article>
    </Section>
  );
}
