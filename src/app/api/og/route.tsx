import { getBlogPost } from "@/lib/blog";
import { getDocPage } from "@/lib/docs";
import { createJolterOgImage } from "@/lib/og";

export function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const slug = url.searchParams.get("slug");

  if (kind === "docs") {
    const page = getDocPage(slug && slug !== "index" ? slug.split("/") : []);

    return createJolterOgImage({
      title: page?.title ?? "Jolter Docs",
      description:
        page?.description ??
        "Reference documentation for reliable JavaScript toolchains.",
    });
  }

  if (kind === "blog") {
    const post = slug ? getBlogPost(slug) : undefined;

    return createJolterOgImage({
      title: post?.title ?? "Jolter Blog",
      description:
        post?.description ??
        "Notes on reliable JavaScript toolchains from the Jolter team.",
    });
  }

  return createJolterOgImage({
    title: "Reliable JavaScript toolchain management",
    description:
      "Fast, reliable JavaScript runtime and toolchain management for local development and CI.",
  });
}
