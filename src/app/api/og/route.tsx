import { getDocPage } from "@/lib/docs";
import { createJolterOgImage } from "@/lib/og";

export function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const slug = url.searchParams.get("slug");

  if (kind === "docs") {
    const page = getDocPage(slug && slug !== "index" ? slug.split("/") : []);

    return createJolterOgImage({
      eyebrow: page?.group ?? "Docs",
      title: page?.title ?? "Jolter Docs",
      description:
        page?.description ??
        "Reference documentation for reliable JavaScript toolchains.",
    });
  }

  return createJolterOgImage({
    eyebrow: "Jolter",
    title: "Reliable JavaScript toolchain management",
    description:
      "Fast, reliable JavaScript runtime and toolchain management for local development and CI.",
  });
}
