import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  cover?: string;
  tags?: string[];
};

const contentPath = path.join(process.cwd(), "data/demos");

function getFiles(): string[] {
  if (!fs.existsSync(contentPath)) return [];
  return fs.readdirSync(contentPath).filter((file) => file.endsWith(".md"));
}

export function getAllPosts(): PostMeta[] {
  const files = getFiles();

  return files
    .map((file) => {
      const slug = file.replace(".md", "");
      const filePath = path.join(contentPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || "",
        date: data.date,
        cover: data.cover,
        tags: data.tags || [],
      };
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export async function getPostBySlug(slug: string) {
  if (!slug) return null;

  const filePath = path.join(contentPath, `${slug}.md`);

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
    },
    content: processed.toString(),
  };
}