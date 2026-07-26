import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "@/components/blog/BlogIndex";
import {
  getBlogCategory,
  getBlogCategoryStaticParams,
  getBlogPostsByCategory,
} from "@/lib/blog";
import type { BlogCategorySlug } from "@/lib/blog-types";

type BlogCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return getBlogCategoryStaticParams();
}

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryMeta = getBlogCategory(category);

  if (!categoryMeta) {
    return {};
  }

  const title = `${categoryMeta.label} - Jolter Blog`;

  return {
    title,
    description: categoryMeta.description,
    alternates: {
      canonical: `/blog/category/${categoryMeta.slug}`,
    },
    openGraph: {
      title,
      description: categoryMeta.description,
      url: `/blog/category/${categoryMeta.slug}`,
      images: [
        {
          url: `/blog/category/${categoryMeta.slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: categoryMeta.description,
      images: [`/blog/category/${categoryMeta.slug}/twitter-image`],
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { category } = await params;
  const posts = getBlogPostsByCategory(category);

  if (!posts) {
    notFound();
  }

  return (
    <BlogIndex activeCategory={category as BlogCategorySlug} posts={posts} />
  );
}
