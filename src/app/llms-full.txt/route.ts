import { NextResponse } from "next/server";
import { getAllDocPages } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const pages = getAllDocPages();

  const fullContent = [
    `# ${siteConfig.name} - Complete AI Documentation Bundle`,
    "",
    `> ${siteConfig.description}`,
    "",
    "================================================================================",
    "",
    ...pages.map((page) => {
      return [
        `# DOCUMENTATION PAGE: ${page.title}`,
        `Group: ${page.group}`,
        `URL: ${page.href}`,
        `Description: ${page.description}`,
        "",
        page.content,
        "",
        "--------------------------------------------------------------------------------",
        "",
      ].join("\n");
    }),
  ].join("\n");

  return new NextResponse(fullContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
