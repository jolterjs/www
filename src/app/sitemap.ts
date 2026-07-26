import type { MetadataRoute } from "next";
import { blogCategories, getAllBlogPosts } from "@/lib/blog";
import { getAllDocPages } from "@/lib/docs";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogCategories.map((category) => ({
      url: absoluteUrl(`/blog/category/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getAllBlogPosts().map((post) => ({
      url: absoluteUrl(post.href),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7,
    })),
    ...getAllDocPages().map((page) => ({
      url: absoluteUrl(page.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.slug === "index" ? 0.9 : 0.7,
    })),
  ];
}
