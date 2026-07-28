import React from "react";
import { LinkPreview } from "@/components/ui/tooltip-card";

export function InlineMarkdown({ content }: { content?: string }) {
  if (!content) return null;

  const pattern =
    /(<a\s+href=["'][^"']+["'][^>]*>[\s\S]+?<\/a>|<code>[^<]+<\/code>|`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const parts = content.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        if (
          part.startsWith("<code>") &&
          part.endsWith("</code>") &&
          part.length > 13
        ) {
          const codeText = part.slice(6, -7);
          return (
            <code
              key={i}
              className="mx-0.5 rounded border border-white/[0.13] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] leading-none font-normal [overflow-wrap:anywhere] [word-break:break-word] text-white/90 select-all"
            >
              {codeText}
            </code>
          );
        }

        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          const codeText = part.slice(1, -1);
          return (
            <code
              key={i}
              className="mx-0.5 rounded border border-white/[0.13] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] leading-none font-normal [overflow-wrap:anywhere] [word-break:break-word] text-white/90 select-all"
            >
              {codeText}
            </code>
          );
        }

        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={i} className="font-semibold text-white">
              {boldText}
            </strong>
          );
        }

        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          const isExternal = url.startsWith("http");
          return (
            <LinkPreview
              key={i}
              href={url}
              external={isExternal}
              className="text-underline-offset-2 [overflow-wrap:anywhere] [word-break:break-word] text-white underline transition hover:text-white/80"
            >
              {label}
            </LinkPreview>
          );
        }

        const htmlLinkMatch = part.match(
          /^<a\s+href=["']([^"']+)["'][^>]*>([\s\S]+)<\/a>$/i,
        );
        if (htmlLinkMatch) {
          const [, url, rawLabel] = htmlLinkMatch;
          const isExternal = url.startsWith("http");
          return (
            <LinkPreview
              key={i}
              href={url}
              external={isExternal}
              className="text-underline-offset-2 [overflow-wrap:anywhere] [word-break:break-word] text-white underline transition hover:text-white/80"
            >
              <InlineMarkdown content={rawLabel} />
            </LinkPreview>
          );
        }

        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          const italicText = part.slice(1, -1);
          return <em key={i}>{italicText}</em>;
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
