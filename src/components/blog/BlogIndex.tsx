import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  blogCategories,
  formatBlogDate,
  getBlogCategory,
  getBlogCategoryLabel,
  getFeaturedBlogPost,
  isBlogPostReleased,
} from "@/lib/blog";
import type { BlogCategorySlug, BlogPost } from "@/lib/blog-types";
import { BlogAuthors } from "./BlogAuthors";

const pageRailClass = "mx-auto max-w-7xl px-5 sm:px-8";

export default function BlogIndex({
  activeCategory,
  posts,
}: {
  activeCategory?: BlogCategorySlug;
  posts: BlogPost[];
}) {
  const allReleasedPosts =
    process.env.NODE_ENV === "production"
      ? posts.filter((post) => isBlogPostReleased(post))
      : posts;
  const featured = activeCategory ? allReleasedPosts[0] : getFeaturedBlogPost();
  const visiblePosts = featured
    ? allReleasedPosts.filter((post) => post.slug !== featured.slug)
    : allReleasedPosts;

  return (
    <main className="relative min-h-screen bg-transparent pt-16 text-white">
      <div className="absolute top-0 left-1/2 z-[-1] h-full w-screen -translate-x-1/2 bg-linear-to-t from-black via-black to-transparent" />
      <section className="border-b border-white/[0.08]">
        <div
          className={`${pageRailClass} flex flex-col items-center justify-center py-16 lg:py-20`}
        >
          <div className="mt-6 flex flex-col items-center justify-center">
            <h1 className="text-center text-5xl leading-tight font-semibold text-balance sm:text-6xl">
              Notes on reliable JavaScript toolchains.
            </h1>
            <p className="text-center text-lg leading-8 text-white/52">
              Product updates, release context, engineering notes, and security
              guidance from the Jolter team.
            </p>
          </div>

          <CategoryTabs activeCategory={activeCategory} />
        </div>
      </section>

      <section>
        <div className={`${pageRailClass} py-12 lg:py-16`}>
          {featured ? (
            <FeaturedPost post={featured} />
          ) : (
            <EmptyBlogState activeCategory={activeCategory} />
          )}

          {visiblePosts.length > 0 && (
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.09] md:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CategoryTabs({
  activeCategory,
}: {
  activeCategory?: BlogCategorySlug;
}) {
  return (
    <div className="mt-10 max-w-full overflow-x-auto">
      <div className="inline-flex gap-1 rounded-full border border-white/[0.11] bg-[#050505]/15 p-1 backdrop-blur-sm">
        <CategoryTab href="/blog" label="All" active={!activeCategory} />
        {blogCategories.map((category) => (
          <CategoryTab
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            label={category.label}
            active={activeCategory === category.slug}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryTab({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex h-9 items-center rounded-full px-6 text-sm font-medium transition ${
        active
          ? "bg-white text-black"
          : "text-white/48 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <div className="group relative grid overflow-hidden rounded-3xl border border-white/[0.09] bg-[#050505] transition hover:border-white/[0.16] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Link
        href={post.href}
        className="absolute inset-0 z-2"
        aria-label={post.title}
      />
      <div className="relative min-h-72 overflow-hidden border-b border-white/[0.09] bg-black p-8 select-none lg:border-r lg:border-b-0">
        <BlogVisual title={post.title} />
      </div>
      <div className="flex min-h-72 flex-col justify-between p-6 sm:p-8">
        <div className="pointer-events-none relative z-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[12px] font-medium tracking-normal text-white/40">
              {getBlogCategoryLabel(post.category)}
            </span>
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          </div>
          <h2 className="mt-7 max-w-xl text-3xl leading-tight font-semibold text-balance text-white sm:text-4xl">
            {post.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/52">
            {post.description}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex items-center justify-between gap-5">
          <Author post={post} compact />
          <ArrowRight className="size-5 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group relative flex min-h-72 flex-col justify-between bg-black p-6 transition hover:bg-[#050505]">
      <Link
        href={post.href}
        className="absolute inset-0 z-0"
        aria-label={post.title}
      />
      <div className="pointer-events-none relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] font-medium tracking-normal text-white/40">
            {getBlogCategoryLabel(post.category)}
          </span>
          <time className="text-sm text-white/32" dateTime={post.date}>
            {formatBlogDate(post.date)}
          </time>
        </div>
        <h2 className="mt-8 text-xl leading-snug font-semibold text-white">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/48">
          {post.description}
        </p>
      </div>
      <div className="relative z-10 mt-8 flex items-center justify-between gap-5">
        <Author post={post} compact />
        <ArrowRight className="size-4 text-white/28 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
      </div>
    </div>
  );
}

function BlogVisual({ title }: { title: string }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-8 border border-white/[0.08]" />
      <div className="absolute top-8 right-8 left-8 h-px bg-white/[0.08]" />
      <div className="absolute right-8 bottom-8 left-8 h-px bg-white/[0.08]" />
      <div className="absolute top-8 bottom-8 left-1/2 w-px bg-white/[0.08]" />
      <div className="absolute top-1/2 right-8 left-8 h-px bg-white/[0.08]" />
      <div className="absolute top-8 left-8 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-white/50" />
      <div className="absolute right-8 bottom-8 size-1.5 translate-x-1/2 translate-y-1/2 bg-white/50" />
      <div className="absolute inset-0 z-1 flex items-center justify-center p-10 text-center">
        <div>
          <img src="/jnbg.png" className="mx-auto size-10 opacity-80" alt="" />
          <p className="mx-auto mt-8 max-w-sm text-2xl leading-tight font-semibold text-balance text-white/80">
            {title}
          </p>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 z-0 size-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black blur-sm" />
    </div>
  );
}

function Author({ post, compact }: { post: BlogPost; compact: boolean }) {
  return <BlogAuthors authors={post.authors} compact={compact} />;
}

function EmptyBlogState({
  activeCategory,
}: {
  activeCategory?: BlogCategorySlug;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.09] bg-[#050505] p-8 text-center">
      <p className="text-lg font-semibold text-white">No posts yet</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/48">
        {activeCategory
          ? `There are no ${getBlogCategoryLabel(activeCategory).toLowerCase()} posts yet.`
          : "The Jolter team has not published any posts yet."}
      </p>
    </div>
  );
}
