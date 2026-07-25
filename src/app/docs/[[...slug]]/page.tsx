import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { docsMdxComponents } from "@/components/docs/DocsMdxComponents";
import { DocsSidebarNav, DocsToc } from "@/components/docs/DocsNavigation";
import { DocsFeedback } from "@/components/docs/DocsFeedback";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import { getDocNav, getDocPage, getDocStaticParams } from "@/lib/docs";
import type { DocNavItem } from "@/lib/docs-types";

type DocsPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

const pageRailClass = "mx-auto max-w-7xl px-5 sm:px-8";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDocStaticParams();
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    return {};
  }

  const imageUrl = `/api/og?kind=docs&slug=${encodeURIComponent(page.slug)}`;

  return {
    title: page.slug === "index" ? "Docs" : `${page.title} - Docs`,
    description: page.description,
    alternates: {
      canonical: page.href,
    },
    openGraph: {
      title:
        page.slug === "index" ? "Jolter Docs" : `${page.title} - Jolter Docs`,
      description: page.description,
      url: page.href,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        page.slug === "index" ? "Jolter Docs" : `${page.title} - Jolter Docs`,
      description: page.description,
      images: [imageUrl],
    },
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    notFound();
  }

  const nav = getDocNav();
  const { content } = await compileMDX({
    source: page.content,
    components: docsMdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["docs-heading-anchor"],
              },
            },
          ],
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

  return (
    <main className="min-h-screen bg-black pt-16 text-white">
      <div className={`${pageRailClass} py-10 lg:py-14`}>
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,760px)_220px]">
          <DocsSidebarNav nav={nav} currentHref={page.href} />

          <article className="docs-article min-w-0">
            <header className="border-b border-white/[0.09] pb-10">
              <p className="font-mono text-xs font-semibold tracking-normal text-white/38">
                {page.group}
              </p>
              <h1 className="mt-2.5 text-4xl leading-tight font-semibold text-balance text-white sm:text-5xl">
                {page.title}
              </h1>
              {page.description && (
                <p className="mt-2.5 max-w-2xl text-lg leading-8 text-white/52">
                  <InlineMarkdown content={page.description} />
                </p>
              )}
            </header>

            <div className="docs-markdown pt-4">{content}</div>

            <DocsFeedback slug={page.slug} title={page.title} />

            <DocsPagination previous={page.previous} next={page.next} />
          </article>

          <DocsToc headings={page.headings} />
        </div>
      </div>
    </main>
  );
}

function DocsPagination({
  previous,
  next,
}: {
  previous?: DocNavItem;
  next?: DocNavItem;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="docs-pagination mt-14 grid gap-px overflow-hidden rounded-lg border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="group bg-black p-5 transition hover:bg-[#050505]"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-white/35 uppercase">
            <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
            Previous
          </div>
          <p className="mt-3 font-semibold text-white">{previous.title}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
            {previous.description}
          </p>
        </Link>
      ) : (
        <div className="hidden bg-black sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group bg-black p-5 text-right transition hover:bg-[#050505]"
        >
          <div className="flex items-center justify-end gap-2 font-mono text-xs text-white/35 uppercase">
            Next
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </div>
          <p className="mt-3 font-semibold text-white">{next.title}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
            {next.description}
          </p>
        </Link>
      ) : (
        <div className="hidden bg-black sm:block" />
      )}
    </nav>
  );
}
