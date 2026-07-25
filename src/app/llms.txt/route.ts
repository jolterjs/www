import { NextResponse } from "next/server";
import { getAllDocPages } from "@/lib/docs";
import { absoluteUrl, siteConfig } from "@/lib/site";

export async function GET() {
  const pages = getAllDocPages();

  const lines = [
    `# ${siteConfig.name} - AI Documentation Index`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Documentation Pages",
    "",
    ...pages.map(
      (page) =>
        `- [${page.title}](${absoluteUrl(page.href)}): ${page.description || page.title}`,
    ),
    "",
    "## Full Text Documentation",
    "",
    `- Full Documentation Bundle: ${absoluteUrl("/llms-full.txt")}`,
    "",
    "## Model Context Protocol (MCP) Server",
    "",
    "- Package: @jolter/mcp-server",
    "- Command: npx @jolter/mcp-server",
    "- Installation Guide: " + absoluteUrl("/docs/automation/mcp-server"),
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
