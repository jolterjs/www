export type BlogCategorySlug =
  | "engineering"
  | "releases"
  | "security"
  | "updates";

export type BlogCategory = {
  description: string;
  label: string;
  slug: BlogCategorySlug;
};

export type BlogPost = {
  authorAvatarUrl: string;
  authorName: string;
  body: string;
  category: BlogCategorySlug;
  content: string;
  date: string;
  description: string;
  featured: boolean;
  href: string;
  slug: string;
  title: string;
};
