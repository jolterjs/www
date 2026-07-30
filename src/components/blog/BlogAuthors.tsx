"use client";

import type { BlogAuthor } from "@/lib/blog-types";

export function formatAuthorNames(authors: BlogAuthor[]): string {
  if (!authors || authors.length === 0) return "Jolter Team";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
  const firsts = authors
    .slice(0, authors.length - 1)
    .map((a) => a.name)
    .join(", ");
  return `${firsts} & ${authors[authors.length - 1].name}`;
}

export function BlogAuthors({
  authors,
  compact = false,
}: {
  authors?: BlogAuthor[];
  compact?: boolean;
}) {
  const authorList =
    authors && authors.length > 0
      ? authors
      : [
          {
            name: "Jolter Team",
            avatarUrl: "https://github.com/jolterjs.png",
            link: "https://github.com/jolterjs",
          },
        ];

  const namesText = formatAuthorNames(authorList);
  const writtenByText =
    namesText === "Jolter Team"
      ? "the Jolter team"
      : namesText.replace(/\bJolter Team\b/g, "the Jolter team");

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div className="group/avatars flex flex-row items-center">
        {authorList.map((author, index) => {
          const href = author.link || "https://github.com/jolterjs";

          return (
            <a
              key={`${author.name}-${index}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              title={author.name}
              onClick={(e) => e.stopPropagation()}
              className={`relative inline-block transition-all duration-200 ease-out hover:z-20 ${
                index > 0 ? "-ml-2.5 group-hover/avatars:ml-0.25" : ""
              }`}
            >
              <img
                src={author.avatarUrl}
                alt={author.name}
                className={`${
                  compact ? "size-8" : "size-11"
                } hover:ring-none rounded-full border-2 border-transparent bg-white/[0.04] object-cover transition-all duration-200 hover:border-white`}
              />
            </a>
          );
        })}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white/78">
          {namesText}
        </p>
        {!compact && (
          <p className="mt-0.5 text-xs text-white/36">
            Written by {writtenByText}
          </p>
        )}
      </div>
    </div>
  );
}
