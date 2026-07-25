import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type {
  BlogAuthor,
  BlogCategory,
  BlogCategorySlug,
  BlogPost,
} from "@/lib/blog-types";

type BlogFrontmatterAuthor = {
  avatarUrl?: string;
  link?: string;
  name?: string;
};

type BlogFrontmatter = {
  authorAvatarUrl?: string;
  authorLink?: string;
  authorName?: string;
  authors?: Array<BlogFrontmatterAuthor | string>;
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

export function formatAuthorNames(authors: BlogAuthor[]): string {
  if (!authors || authors.length === 0) return "Jolter Team";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
  const firsts = authors
    .slice(0, authors.length - 1)
    .map((a) => a.name)
    .join(", ");
  return `${firsts} & ${authors[authors.length - 1].name}`;
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

  let authors: BlogAuthor[] = [];

  if (Array.isArray(data.authors) && data.authors.length > 0) {
    authors = data.authors.map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          avatarUrl: "https://github.com/jolterjs.png",
          link: "https://github.com/jolterjs",
        };
      }
      return {
        name: item.name ?? "Jolter Team",
        avatarUrl: item.avatarUrl ?? "https://github.com/jolterjs.png",
        link: item.link ?? "https://github.com/jolterjs",
      };
    });
  } else {
    authors = [
      {
        name: data.authorName ?? "Jolter Team",
        avatarUrl: data.authorAvatarUrl ?? "https://github.com/jolterjs.png",
        link: data.authorLink ?? "https://github.com/jolterjs",
      },
    ];
  }

  const authorName = formatAuthorNames(authors);
  const authorAvatarUrl =
    authors[0]?.avatarUrl ?? "https://github.com/jolterjs.png";

  return {
    authorAvatarUrl,
    authorName,
    authors,
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

  const posts = fs
    .readdirSync(contentRoot)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readBlogPost)
    .sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();

      return byDate || a.title.localeCompare(b.title);
    });

  if (process.env.NODE_ENV === "production") {
    return posts.filter(isBlogPostReleased);
  }

  return posts;
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

export function isBlogPostReleased(post: BlogPost) {
  const today = new Date();
  const postDate = new Date(post.date);

  return postDate.getTime() <= today.getTime();
}
