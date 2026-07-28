import { NextRequest, NextResponse } from "next/server";
import { getDocPage } from "@/lib/docs";
import { getBlogPost, getBlogCategoryLabel } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  try {
    const isRelative = targetUrl.startsWith("/") && !targetUrl.startsWith("//");
    let isInternal = isRelative;
    let urlObj: URL | null = null;

    if (!isRelative) {
      try {
        urlObj = new URL(targetUrl);
        const host = urlObj.hostname.toLowerCase();
        if (
          host === "jolter.dev" ||
          host === "www.jolter.dev" ||
          host === "localhost" ||
          host === "127.0.0.1"
        ) {
          isInternal = true;
        }
      } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
    }

    if (isInternal) {
      const pathAndHash = isRelative
        ? targetUrl
        : (urlObj?.pathname ?? "") + (urlObj?.hash ?? "");
      const [pathname, hash] = pathAndHash.split("#");
      const cleanPath = pathname.replace(/\/$/, "") || "/";

      // Docs pages
      if (cleanPath === "/docs" || cleanPath.startsWith("/docs/")) {
        const rawSlug =
          cleanPath === "/docs" ? "" : cleanPath.replace(/^\/docs\//, "");
        const slugParts = rawSlug ? rawSlug.split("/") : [];
        const doc = getDocPage(slugParts);

        if (doc) {
          let title = doc.title;
          if (hash && doc.headings) {
            const matchingHeading = doc.headings.find(
              (h) => h.id.toLowerCase() === hash.toLowerCase(),
            );
            if (matchingHeading) {
              title = `${doc.title} › ${matchingHeading.text}`;
            }
          }

          return NextResponse.json({
            isExternal: false,
            title,
            description: doc.description || "Jolter Documentation page.",
            category: doc.group ? `Docs • ${doc.group}` : "Documentation",
            siteName: "Jolter Docs",
            href: doc.href + (hash ? `#${hash}` : ""),
          });
        }
      }

      // Blog pages
      if (cleanPath === "/blog" || cleanPath.startsWith("/blog/")) {
        const rawSlug =
          cleanPath === "/blog" ? "" : cleanPath.replace(/^\/blog\//, "");
        if (rawSlug) {
          const post = getBlogPost(rawSlug);
          if (post) {
            return NextResponse.json({
              isExternal: false,
              title: post.title,
              description: post.description || post.body.slice(0, 150) + "...",
              category: `Blog • ${getBlogCategoryLabel(post.category)}`,
              siteName: "Jolter Blog",
              href: post.href,
            });
          }
        } else {
          return NextResponse.json({
            isExternal: false,
            title: "Jolter Blog",
            description:
              "Latest news, updates, and engineering insights from the Jolter team.",
            category: "Blog",
            siteName: "Jolter Blog",
            href: "/blog",
          });
        }
      }

      // LLM endpoints
      if (cleanPath === "/llms.txt") {
        return NextResponse.json({
          isExternal: false,
          title: "llms.txt",
          description: "Structured navigation index for web-browsing LLMs.",
          category: "AI Index",
          siteName: "Jolter",
          href: "/llms.txt",
        });
      }
      if (cleanPath === "/llms-full.txt") {
        return NextResponse.json({
          isExternal: false,
          title: "llms-full.txt",
          description: "Single-file concatenated markdown bundle for LLMs.",
          category: "AI Index",
          siteName: "Jolter",
          href: "/llms-full.txt",
        });
      }

      // Homepage or root
      if (cleanPath === "/") {
        return NextResponse.json({
          isExternal: false,
          title: "Jolter",
          description: siteConfig.description,
          category: "Homepage",
          siteName: "Jolter",
          href: "/",
        });
      }

      // Try matching doc page without /docs/ prefix (e.g. /automation/github-actions)
      const rawSlug = cleanPath.replace(/^\//, "");
      if (rawSlug) {
        const docCandidate = getDocPage(rawSlug.split("/"));
        if (docCandidate) {
          let title = docCandidate.title;
          if (hash && docCandidate.headings) {
            const matchingHeading = docCandidate.headings.find(
              (h) => h.id.toLowerCase() === hash.toLowerCase(),
            );
            if (matchingHeading) {
              title = `${docCandidate.title} › ${matchingHeading.text}`;
            }
          }

          return NextResponse.json({
            isExternal: false,
            title,
            description:
              docCandidate.description || "Jolter Documentation page.",
            category: docCandidate.group
              ? `Docs • ${docCandidate.group}`
              : "Documentation",
            siteName: "Jolter Docs",
            href: docCandidate.href + (hash ? `#${hash}` : ""),
          });
        }
      }

      // Fallback for unrecognized internal routes
      const segment = cleanPath.split("/").filter(Boolean).pop() || "Page";
      const formattedTitle = segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return NextResponse.json({
        isExternal: false,
        title: formattedTitle,
        description: siteConfig.description,
        category: "Jolter",
        siteName: "Jolter",
        href: cleanPath,
      });
    }

    // Handle External URLs
    const fullUrl = urlObj ? urlObj.toString() : targetUrl;
    const hostname = urlObj ? urlObj.hostname.replace(/^www\./, "") : targetUrl;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(fullUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        const ogTitle =
          html.match(
            /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
          )?.[1] ||
          html.match(
            /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i,
          )?.[1] ||
          html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1];

        const ogDescription =
          html.match(
            /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
          )?.[1] ||
          html.match(
            /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
          )?.[1] ||
          html.match(
            /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i,
          )?.[1];

        const ogSiteName = html.match(
          /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i,
        )?.[1];

        const ogImage =
          html.match(
            /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
          )?.[1] ||
          html.match(
            /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
          )?.[1];

        const cleanTitle = ogTitle
          ? ogTitle
              .trim()
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
          : hostname;
        const cleanDescription = ogDescription
          ? ogDescription
              .trim()
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
          : fullUrl;
        const siteName = ogSiteName
          ? ogSiteName.trim()
          : hostname.charAt(0).toUpperCase() + hostname.slice(1);

        let previewImage = ogImage ? ogImage.trim() : null;
        if (previewImage && !previewImage.startsWith("http")) {
          try {
            previewImage = new URL(previewImage, fullUrl).toString();
          } catch {
            previewImage = null;
          }
        }

        const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

        return NextResponse.json({
          isExternal: true,
          siteName,
          hostname,
          title: cleanTitle,
          description: cleanDescription,
          previewImage,
          favicon,
          url: fullUrl,
        });
      }
    } catch {
      // Fetch failed or timed out
    }

    // Fallback external metadata
    const siteName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    return NextResponse.json({
      isExternal: true,
      siteName,
      hostname,
      title: hostname,
      description: fullUrl,
      previewImage: null,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      url: fullUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process URL" },
      { status: 500 },
    );
  }
}
