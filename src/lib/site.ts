export const siteConfig = {
  description:
    "Fast, reliable JavaScript runtime and toolchain management for local development and CI.",
  name: "Jolter",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jolter.dev",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
