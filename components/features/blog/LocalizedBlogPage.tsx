"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";
import Section from "@/components/ui/Section";
import LocalizedBlog from "@components/features/blog/LocalizedBlog";
import type { PostMeta } from "@/lib/content";

type Props = {
  posts: {
    en: PostMeta[];
    tr: PostMeta[];
  };
};

export default function LocalizedBlogPage({ posts }: Props) {
  const { t, locale } = useTranslation();

  return (
    <Section title={t("nav.blog")}>
      <LocalizedBlog posts={posts[locale]} locale={locale} />
    </Section>
  );
}
