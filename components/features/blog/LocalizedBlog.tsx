"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import Link from "next/link";
import type { PostMeta } from "@/lib/content";

type Props = {
  posts: PostMeta[];
  locale: string;
};

export default function LocalizedBlog({ posts, locale }: Props) {
  const { t } = useTranslation();

  const groupedBySeries = posts.reduce(
    (acc, post) => {
      const seriesName = post.series || t("blog.other_posts");
      if (!acc[seriesName]) {
        acc[seriesName] = [];
      }
      acc[seriesName].push(post);
      return acc;
    },
    {} as Record<string, PostMeta[]>
  );

  const dateLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="space-y-10">
      {Object.entries(groupedBySeries).map(([seriesName, seriesPosts]) => (
        <div key={seriesName}>
          {/* Series başlığı */}
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {seriesName}
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
          </div>

          {/* Blog yazıları - liste halinde */}
          <ul className="space-y-1">
            {seriesPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                >
                  {/* Başlık ve meta */}
                  <div className="min-w-0 flex-1">
                    <span className="transition-colors duration-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      {post.chapter && (
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {t("blog.chapter")} {post.chapter} —{" "}
                        </span>
                      )}
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {post.title}
                      </span>
                    </span>
                  </div>

                  {/* Okuma süresi ve tarih */}
                  <div className="flex shrink-0 items-baseline gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                    <span>{post.readingTime} {t("blog.min_read")}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <time>{new Date(post.date).toLocaleDateString(dateLocale, { timeZone: "UTC" })}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
