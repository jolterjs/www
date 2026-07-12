import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type {
  BlogCategory,
  BlogCategorySlug,
  BlogPost,
} from "@/lib/blog-types";

type BlogFrontmatter = {
  authorAvatarUrl?: string;
  authorName?: string;
  category?: string;
  date?: string | Date;
  description?: string;
  featured?: boolean;
  title?: string;
};

const contentRoot = path.join(process.cwd(), "src/content/blog");

export const blogCategories = [
  {
    slug: "updates",
    label: "Updates",
    description: "Product notes, roadmap context, and team announcements.",
  },
  {
    slug: "releases",
    label: "Releases",
    description:
      "Version highlights, compatibility notes, and upgrade context.",
  },
  {
    slug: "engineering",
    label: "Engineering",
    description: "How Jolter is designed, built, verified, and operated.",
  },
  {
    slug: "security",
    label: "Security",
    description:
      "Trust boundaries, verification, and safer toolchain workflows.",
  },
] satisfies BlogCategory[];

function isBlogCategory(value: string): value is BlogCategorySlug {
  return blogCategories.some((category) => category.slug === value);
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeDate(value: string | Date | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  return new Date(value).toISOString();
}

function stripMdxForExcerpt(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`>{}[\]|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readBlogPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(contentRoot, fileName), "utf8");
  const parsed = matter(raw);
  const data = parsed.data as BlogFrontmatter;
  const category = String(data.category ?? "updates").toLowerCase();
  const title = data.title ?? titleFromSlug(slug);
  const description = data.description ?? "";

  if (!isBlogCategory(category)) {
    throw new Error(`Unknown blog category "${category}" in ${fileName}`);
  }

  return {
    authorAvatarUrl: data.authorAvatarUrl ?? "https://github.com/jolterjs.png",
    authorName: data.authorName ?? "Jolter Team",
    body: stripMdxForExcerpt(parsed.content),
    category,
    content: parsed.content,
    date: normalizeDate(data.date),
    description,
    featured: Boolean(data.featured),
    href: `/blog/${slug}`,
    slug,
    title,
  };
}

const loadBlog = cache(() => {
  if (!fs.existsSync(contentRoot)) {
    return [] as BlogPost[];
  }

  return fs
    .readdirSync(contentRoot)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readBlogPost)
    .sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();

      return byDate || a.title.localeCompare(b.title);
    });
});

export function getAllBlogPosts() {
  return loadBlog();
}

export function getBlogPost(slug: string) {
  return loadBlog().find((post) => post.slug === slug);
}

export function getFeaturedBlogPost() {
  return loadBlog().find((post) => post.featured) ?? loadBlog()[0];
}

export function getBlogPostsByCategory(category: string) {
  if (!isBlogCategory(category)) {
    return undefined;
  }

  return loadBlog().filter((post) => post.category === category);
}

export function getBlogCategory(category: string) {
  return blogCategories.find((item) => item.slug === category);
}

export function getBlogCategoryLabel(category: BlogCategorySlug) {
  return getBlogCategory(category)?.label ?? "Updates";
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getBlogStaticParams() {
  return loadBlog().map((post) => ({ slug: post.slug }));
}

export function getBlogCategoryStaticParams() {
  return blogCategories.map((category) => ({ category: category.slug }));
}
