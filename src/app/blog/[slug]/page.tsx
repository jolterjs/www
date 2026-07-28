import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { mdxComponents } from "@/components/MdxComponents";
import { BlogAuthors } from "@/components/blog/BlogAuthors";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import {
  formatBlogDate,
  getBlogCategoryLabel,
  getBlogPost,
  getBlogStaticParams,
  isBlogPostReleased,
} from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const pageRailClass = "mx-auto max-w-7xl px-5 sm:px-8";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (
    !post ||
    (process.env.NODE_ENV === "production" && !isBlogPostReleased(post))
  ) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.href,
    },
    authors: post.authors.map((author) => ({
      name: author.name,
      url: author.link,
    })),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: post.href,
      publishedTime: post.date,
      authors: post.authors.map((author) => author.name),
      section: getBlogCategoryLabel(post.category),
      images: [
        {
          url: `${post.href}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${post.href}/twitter-image`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (
    !post ||
    (process.env.NODE_ENV === "production" && !isBlogPostReleased(post))
  ) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Organization",
      name: post.authorName,
    },
    datePublished: post.date,
    description: post.description,
    headline: post.title,
    image: absoluteUrl(`${post.href}/opengraph-image`),
    mainEntityOfPage: absoluteUrl(post.href),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <main className="relative min-h-screen bg-transparent pt-16 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="absolute top-0 left-1/2 z-[-1] h-full w-screen -translate-x-1/2 bg-linear-to-t from-black via-black to-transparent" />
      <div className={`${pageRailClass} py-10 lg:py-16`}>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Blog
          </Link>

          <article className="mt-10">
            <header className="border-b border-white/[0.09] pb-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/42">
                <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[12px] font-medium tracking-normal text-white/40">
                  {getBlogCategoryLabel(post.category)}
                </span>
                <time
                  dateTime={post.date}
                  className="text-[13px] font-medium tracking-normal text-white/40"
                >
                  {formatBlogDate(post.date)}
                </time>
              </div>
              <h1 className="mt-6 text-4xl leading-tight font-semibold text-balance text-white sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/52">
                <InlineMarkdown content={post.description} />
              </p>
              <div className="mt-8">
                <BlogAuthors authors={post.authors} />
              </div>
            </header>

            <div className="docs-markdown pt-4">{content}</div>
          </article>
        </div>
      </div>
    </main>
  );
}
