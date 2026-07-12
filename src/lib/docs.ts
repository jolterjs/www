import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type {
  DocHeading,
  DocNavGroup,
  DocNavItem,
  DocPage,
  DocSearchItem,
} from "@/lib/docs-types";

type DocsJsonPage = string | { group: string; pages: DocsJsonPage[] };

type DocsJson = {
  navigation: {
    pages: DocsJsonPage[];
  };
};

type LoadedDocs = {
  groups: DocNavGroup[];
  pages: DocPage[];
  pageMap: Map<string, DocPage>;
  searchIndex: DocSearchItem[];
};

const contentRoot = path.join(process.cwd(), "src/content/docs");
const docsJsonPath = path.join(contentRoot, "docs.json");

function slugToHref(slug: string) {
  return slug === "index" ? "/docs" : `/docs/${slug}`;
}

function titleFromSlug(slug: string) {
  const lastSegment = slug.split("/").pop() ?? slug;

  return lastSegment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function flattenNavigation(pages: DocsJsonPage[]) {
  const groups: Array<{ group: string; pages: string[] }> = [];

  for (const page of pages) {
    if (typeof page === "string") {
      groups.push({ group: "Docs", pages: [page] });
      continue;
    }

    const slugs: string[] = [];
    collectSlugs(page.pages, slugs);
    groups.push({ group: page.group, pages: slugs });
  }

  return groups;
}

function collectSlugs(pages: DocsJsonPage[], slugs: string[]) {
  for (const page of pages) {
    if (typeof page === "string") {
      slugs.push(page);
    } else {
      collectSlugs(page.pages, slugs);
    }
  }
}

function normalizeInternalDocsHref(href: string) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("/docs") ||
    href.startsWith("/_next") ||
    href.startsWith("/api") ||
    href.startsWith("//") ||
    /^[a-z][a-z0-9+.-]*:/i.test(href)
  ) {
    return href;
  }

  if (href === "/") {
    return "/docs";
  }

  if (href.startsWith("/")) {
    return `/docs${href}`;
  }

  return href;
}

export function rewriteDocsLinks(content: string) {
  return content
    .replace(/href=(["'])(\/[^"']*)\1/g, (_match, quote, href) => {
      return `href=${quote}${normalizeInternalDocsHref(href)}${quote}`;
    })
    .replace(/\]\((\/[^)\s]*)\)/g, (_match, href) => {
      return `](${normalizeInternalDocsHref(href)})`;
    });
}

function stripCodeFences(content: string) {
  return content.replace(/```[\s\S]*?```/g, " ");
}

function stripMdxForSearch(content: string) {
  return content
    .replace(/```([\s\S]*?)```/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`>{}[\]|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textFromHeading(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .trim();
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(content: string): DocHeading[] {
  const withoutCode = stripCodeFences(content);
  const headingCounts = new Map<string, number>();
  const headings: DocHeading[] = [];

  for (const match of withoutCode.matchAll(/^(#{2,4})\s+(.+)$/gm)) {
    const depth = match[1].length;
    const text = textFromHeading(match[2]);

    if (!text) {
      continue;
    }

    const baseId = slugifyHeading(text);
    const count = headingCounts.get(baseId) ?? 0;
    headingCounts.set(baseId, count + 1);

    headings.push({
      id: count === 0 ? baseId : `${baseId}-${count}`,
      text,
      depth,
    });
  }

  return headings;
}

function readDoc(slug: string, group: string): DocPage {
  const filePath = path.join(contentRoot, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as { title?: string; description?: string };
  const content = rewriteDocsLinks(parsed.content);
  const title = data.title ?? titleFromSlug(slug);
  const description = data.description ?? "";

  return {
    title,
    description,
    slug,
    href: slugToHref(slug),
    group,
    content,
    headings: extractHeadings(content),
  };
}

function asNavItem(page: DocPage): DocNavItem {
  return {
    title: page.title,
    description: page.description,
    slug: page.slug,
    href: page.href,
    group: page.group,
  };
}

const loadDocs = cache((): LoadedDocs => {
  const docsJson = JSON.parse(
    fs.readFileSync(docsJsonPath, "utf8"),
  ) as DocsJson;
  const navGroups = flattenNavigation(docsJson.navigation.pages);
  const pages: DocPage[] = [];
  const groups: DocNavGroup[] = [];

  for (const navGroup of navGroups) {
    const groupPages = navGroup.pages.map((slug) => {
      const page = readDoc(slug, navGroup.group);
      pages.push(page);
      return asNavItem(page);
    });

    groups.push({
      group: navGroup.group,
      pages: groupPages,
    });
  }

  for (const [index, page] of pages.entries()) {
    page.previous = index > 0 ? asNavItem(pages[index - 1]) : undefined;
    page.next =
      index < pages.length - 1 ? asNavItem(pages[index + 1]) : undefined;
  }

  return {
    groups,
    pages,
    pageMap: new Map(pages.map((page) => [page.slug, page])),
    searchIndex: pages.map((page) => ({
      title: page.title,
      description: page.description,
      group: page.group,
      href: page.href,
      headings: page.headings.map((heading) => heading.text),
      body: stripMdxForSearch(page.content),
    })),
  };
});

export function getDocNav() {
  return loadDocs().groups;
}

export function getAllDocPages() {
  return loadDocs().pages;
}

export function getDocsSearchIndex() {
  return loadDocs().searchIndex;
}

export function getDocPage(slug?: string[]) {
  const normalizedSlug = slug?.length ? slug.join("/") : "index";
  return loadDocs().pageMap.get(normalizedSlug);
}

export function getDocStaticParams() {
  return loadDocs().pages.map((page) => ({
    slug: page.slug === "index" ? [] : page.slug.split("/"),
  }));
}

export function getDocRedirects() {
  return loadDocs()
    .pages.filter((page) => page.slug !== "index")
    .map((page) => ({
      source: `/${page.slug}`,
      destination: page.href,
      permanent: false,
    }));
}
