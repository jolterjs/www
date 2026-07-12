import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

type DocsJsonPage = string | { group: string; pages: DocsJsonPage[] };

function collectDocSlugs(pages: DocsJsonPage[], slugs: string[]) {
  for (const page of pages) {
    if (typeof page === "string") {
      slugs.push(page);
    } else {
      collectDocSlugs(page.pages, slugs);
    }
  }
}

function getDocRedirects() {
  const docsJsonPath = path.join(process.cwd(), "src/content/docs/docs.json");

  if (!fs.existsSync(docsJsonPath)) {
    return [];
  }

  const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, "utf8")) as {
    navigation: { pages: DocsJsonPage[] };
  };
  const slugs: string[] = [];

  collectDocSlugs(docsJson.navigation.pages, slugs);

  return slugs
    .filter((slug) => slug !== "index")
    .map((slug) => ({
      source: `/${slug}`,
      destination: `/docs/${slug}`,
      permanent: false,
    }));
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return getDocRedirects();
  },
};

export default nextConfig;
