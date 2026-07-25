import React from "react";
import Link from "next/link";

export function InlineMarkdown({ content }: { content?: string }) {
  if (!content) return null;

  // Split pattern for <code>...</code>, inline code `...`, bold **...**, links [...](...), italic *...*
  const pattern =
    /(<code>[^<]+<\/code>|`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const parts = content.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        // HTML code tag: <code>code</code>
        if (
          part.startsWith("<code>") &&
          part.endsWith("</code>") &&
          part.length > 13
        ) {
          const codeText = part.slice(6, -7);
          return (
            <code
              key={i}
              className="mx-0.5 rounded border border-white/[0.13] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] leading-none font-normal text-white/90 select-all"
            >
              {codeText}
            </code>
          );
        }

        // Inline code: `code`
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          const codeText = part.slice(1, -1);
          return (
            <code
              key={i}
              className="mx-0.5 rounded border border-white/[0.13] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] leading-none font-normal text-white/90 select-all"
            >
              {codeText}
            </code>
          );
        }

        // Bold: **text**
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={i} className="font-semibold text-white">
              {boldText}
            </strong>
          );
        }

        // Link: [label](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          const isExternal = url.startsWith("http");
          return isExternal ? (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-underline-offset-2 text-white underline transition hover:text-white/80"
            >
              {label}
            </a>
          ) : (
            <Link
              key={i}
              href={url}
              className="text-underline-offset-2 text-white underline transition hover:text-white/80"
            >
              {label}
            </Link>
          );
        }

        // Italic: *text*
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          const italicText = part.slice(1, -1);
          return <em key={i}>{italicText}</em>;
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
