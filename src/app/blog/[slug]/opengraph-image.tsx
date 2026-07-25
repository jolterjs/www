import { getBlogCategoryLabel, getBlogPost } from "@/lib/blog";
import { createJolterOgImage } from "@/lib/og";

type BlogPostImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const alt = "Jolter Blog";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default async function Image({ params }: BlogPostImageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return createJolterOgImage({
    title: post?.title ?? "Jolter Blog",
    description: post?.description,
  });
}
