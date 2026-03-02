import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type Language = "tr" | "en";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  cover?: string;
  tags?: string[];
  series?: string;
  chapter?: number;
  readingTime: number;
  lang: Language;
};

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function getContentPath(lang: Language): string {
  return path.join(process.cwd(), "data/blogs", lang);
}

function getFiles(lang: Language): string[] {
  const langPath = getContentPath(lang);
  if (!fs.existsSync(langPath)) return [];
  return fs.readdirSync(langPath).filter((file) => file.endsWith(".md"));
}

export function getAllPosts(lang: Language = "tr"): PostMeta[] {
  const files = getFiles(lang);
  const langPath = getContentPath(lang);

  return files
    .map((file) => {
      const slug = file.replace(".md", "");
      const filePath = path.join(langPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || "",
        date: data.date,
        cover: data.cover,
        tags: data.tags || [],
        series: data.series,
        chapter: data.chapter,
        readingTime: estimateReadingTime(content),
        lang,
      };
    })
    .sort((a, b) => {
      // Aynı serideyse chapter'a göre sırala (küçükten büyüğe)
      if (a.series && b.series && a.series === b.series) {
        return (a.chapter ?? 0) - (b.chapter ?? 0);
      }
      // Farklı seriler veya serisiz yazılar tarihe göre (eskiden yeniye)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}

export async function getPostBySlug(slug: string, lang: Language = "tr") {
  if (!slug) return null;

  const langPath = getContentPath(lang);
  const filePath = path.join(langPath, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark().use(html).process(content);

  return {
    meta: {
      slug,
      title: data.title,
      excerpt: data.excerpt || "",
      date: data.date,
      cover: data.cover,
      tags: data.tags || [],
      series: data.series,
      chapter: data.chapter,
      readingTime: estimateReadingTime(content),
      lang,
    },
    content: processed.toString(),
  };
}