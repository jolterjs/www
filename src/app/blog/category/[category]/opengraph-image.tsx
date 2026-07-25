import { getBlogCategory } from "@/lib/blog";
import { createJolterOgImage } from "@/lib/og";

type BlogCategoryImageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const alt = "Jolter Blog";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default async function Image({ params }: BlogCategoryImageProps) {
  const { category } = await params;
  const categoryMeta = getBlogCategory(category);

  return createJolterOgImage({
    title: categoryMeta ? `${categoryMeta.label} posts` : "Jolter Blog",
    description:
      categoryMeta?.description ??
      "Product updates, release context, engineering notes, and security guidance from the Jolter team.",
  });
}
