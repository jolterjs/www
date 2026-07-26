import type { Metadata } from "next";
import BlogIndex from "@/components/blog/BlogIndex";
import { getAllBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product updates, release context, engineering notes, and security guidance from the Jolter team.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Jolter Blog",
    description:
      "Product updates, release context, engineering notes, and security guidance from the Jolter team.",
    url: "/blog",
    images: [{ url: "/blog/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jolter Blog",
    description:
      "Product updates, release context, engineering notes, and security guidance from the Jolter team.",
    images: ["/blog/twitter-image"],
  },
};

export default function BlogPage() {
  return <BlogIndex posts={getAllBlogPosts()} />;
}
