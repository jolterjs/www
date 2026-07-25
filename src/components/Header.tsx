"use client";

import React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerDownLeft, ExternalLink, Menu, Search, X } from "lucide-react";
import type { DocSearchItem } from "@/lib/docs-types";
import { useMobileDrawer } from "./MobileDrawerProvider";

const items = [
  { name: "Features", href: "/#features" },
  { name: "Workflow", href: "/#workflow" },
  { name: "Plugins", href: "/#plugins" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
  { name: "MCP Server", href: "/docs/automation/mcp-server" },
  { name: "Plugin Registry", href: "https://plugins.jolter.dev" },
  { name: "GitHub", href: "https://github.com/jolterjs/jolter" },
];

type SearchResult = DocSearchItem & {
  score: number;
};

export default function Header({
  docsSearchIndex,
}: {
  docsSearchIndex: DocSearchItem[];
}) {
  const { toggleDrawer } = useMobileDrawer();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-black/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center transition hover:opacity-80"
            aria-label="Jolter home"
          >
            <img src="/jnbg.png" className="size-7" alt="" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {items.map((item, index) => {
              const external = item.href.startsWith("http");

              return external ? (
                <a
                  key={`${item.href}-${index}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/48 transition hover:text-white"
                >
                  {item.name}
                  <ExternalLink className="size-3 text-white/28 transition group-hover:text-white/65" />
                </a>
              ) : (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/48 transition hover:text-white"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DocsSearchModal docsSearchIndex={docsSearchIndex} />
          <Link
            href="/docs/quickstart"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Learn
          </Link>
          <button
            type="button"
            onClick={toggleDrawer}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="size-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function DocsSearchModal({
  docsSearchIndex,
}: {
  docsSearchIndex: DocSearchItem[];
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const openFrame = React.useRef<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const touchStartY = React.useRef<number>(0);
  const touchCurrentY = React.useRef<number>(0);
  const [dragOffsetY, setDragOffsetY] = React.useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetY > 100) {
      closeSearch();
    }
    setDragOffsetY(0);
  };

  const results = React.useMemo(() => {
    return searchDocs(docsSearchIndex, query);
  }, [docsSearchIndex, query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  React.useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }

      if (openFrame.current) {
        window.cancelAnimationFrame(openFrame.current);
      }

      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-drawer-open");
    };
  }, []);

  React.useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.documentElement.setAttribute("data-drawer-open", "true");
    } else {
      document.documentElement.removeAttribute("data-drawer-open");
    }

    return () => {
      document.documentElement.removeAttribute("data-drawer-open");
    };
  }, [open]);

  const openSearch = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (openFrame.current) {
      window.cancelAnimationFrame(openFrame.current);
    }

    setRendered(true);
    openFrame.current = window.requestAnimationFrame(() => {
      setOpen(true);
      openFrame.current = null;
    });
  }, []);

  const closeSearch = React.useCallback(() => {
    setOpen(false);

    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setRendered(false);
      closeTimer.current = null;
    }, 220);
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch, openSearch]);

  React.useEffect(() => {
    if (!rendered) {
      document.documentElement.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
  }, [rendered]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  function navigateToResult(result: DocSearchItem) {
    closeSearch();
    setQuery("");
    router.push(result.href);
  }

  function handleModalKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) =>
        results.length === 0 ? 0 : (current + 1) % results.length,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) =>
        results.length === 0
          ? 0
          : (current - 1 + results.length) % results.length,
      );
    }

    if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  }

  const modal = rendered
    ? createPortal(
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onKeyDown={handleModalKeyDown}
          data-docs-search-modal
          data-lenis-prevent
          data-no-reveal
          data-state={open ? "open" : "closed"}
        >
          <div
            className="absolute inset-0 bg-black/82.5 transition-opacity duration-300"
            onClick={closeSearch}
          />

          <div
            style={{
              transform:
                open && dragOffsetY > 0
                  ? `translateY(${dragOffsetY}px)`
                  : undefined,
            }}
            className={`absolute inset-x-0 bottom-0 mx-2 flex max-h-[85vh] flex-col rounded-t-[28px] border-x border-t border-white/12 bg-[#080808] shadow-[0_-12px_40px_rgba(0,0,0,0.9)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] sm:top-24 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-2xl sm:border sm:border-white/12 sm:shadow-2xl sm:shadow-black/70 ${
              open
                ? "translate-y-0 sm:scale-100 sm:opacity-100"
                : "translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div
              className="flex w-full cursor-grab items-center justify-center pt-3 pb-1 active:cursor-grabbing sm:hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="h-1.5 w-12 rounded-full bg-white/20 transition hover:bg-white/40" />
            </div>

            <div className="flex h-14 items-center gap-3 border-b border-white/[0.09] px-4">
              <Search className="size-4 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/28"
                placeholder="Search Jolter docs..."
                autoComplete="off"
                data-docs-search-input
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-white/[0.12] hover:text-white"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              className="max-h-[60vh] flex-1 overflow-y-auto overscroll-contain p-2 sm:max-h-[55vh]"
              data-lenis-prevent
              data-no-reveal
            >
              {results.length > 0 ? (
                <SearchResults
                  results={results}
                  selectedIndex={selectedIndex}
                  onSelect={navigateToResult}
                />
              ) : (
                <div className="px-4 py-12 text-center text-sm text-white/45">
                  No matching docs were found.
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="hidden h-9 w-72 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 text-sm text-white/36 transition hover:border-white/[0.16] hover:text-white/56 xl:flex"
        data-docs-search-trigger
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Search documentation...
        </span>
        <kbd className="rounded border border-white/[0.12] bg-black px-1.5 py-0.5 font-mono text-[11px] text-white/55">
          Ctrl K
        </kbd>
      </button>
      <button
        type="button"
        onClick={openSearch}
        className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.05] text-white/45 transition hover:border-white/[0.16] hover:text-white xl:hidden"
        aria-label="Search documentation"
        data-docs-search-trigger-mobile
      >
        <Search className="size-4" />
      </button>

      {modal}
    </>
  );
}

function SearchResults({
  results,
  selectedIndex,
  onSelect,
}: {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (result: DocSearchItem) => void;
}) {
  let currentGroup = "";

  return (
    <div>
      {results.map((result, index) => {
        const showGroup = result.group !== currentGroup;
        currentGroup = result.group;

        return (
          <React.Fragment key={result.href}>
            {showGroup && (
              <div className="px-2 pt-4 pb-1 font-mono text-[11px] font-semibold tracking-normal text-white/30 uppercase first:pt-1">
                {result.group}
              </div>
            )}
            <button
              type="button"
              onClick={() => onSelect(result)}
              className={`block w-full rounded-md px-3 py-3 text-left transition ${
                selectedIndex === index
                  ? "bg-white/[0.08]"
                  : "hover:bg-white/[0.04]"
              }`}
              data-docs-search-result={result.href}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-white">{result.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm leading-5 text-white/45">
                    {result.description ||
                      result.headings.slice(0, 2).join(", ")}
                  </div>
                </div>
                {selectedIndex === index && (
                  <CornerDownLeft className="mt-1 size-4 shrink-0 text-white/35" />
                )}
              </div>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function searchDocs(items: DocSearchItem[], query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items.slice(0, 8).map((item, index) => ({
      ...item,
      score: 100 - index,
    }));
  }

  const tokenVariants = normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .map(getSearchTokenVariants);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const headings = item.headings.join(" ").toLowerCase();
      const body = item.body.toLowerCase();
      const haystack = `${title} ${description} ${headings} ${body}`;

      if (
        !tokenVariants.every((variants) =>
          variants.some((token) => haystack.includes(token)),
        )
      ) {
        return null;
      }

      let score = 0;

      for (const variants of tokenVariants) {
        score += Math.max(
          ...variants.map((token) =>
            scoreSearchToken({ body, description, headings, title }, token),
          ),
        );
      }

      return { ...item, score };
    })
    .filter((item): item is SearchResult => item !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 12);
}

function getSearchTokenVariants(token: string) {
  if (token.length > 3 && token.endsWith("s")) {
    return [token, token.slice(0, -1)];
  }

  return [token];
}

function scoreSearchToken(
  fields: {
    body: string;
    description: string;
    headings: string;
    title: string;
  },
  token: string,
) {
  let score = 0;

  if (fields.title === token) {
    score += 90;
  } else if (fields.title.startsWith(token)) {
    score += 70;
  } else if (fields.title.includes(token)) {
    score += 50;
  }

  if (fields.headings.includes(token)) {
    score += 30;
  }

  if (fields.description.includes(token)) {
    score += 20;
  }

  score += Math.min(countOccurrences(fields.body, token), 8) * 8;

  return score;
}

function countOccurrences(value: string, token: string) {
  if (!token) {
    return 0;
  }

  let count = 0;
  let index = value.indexOf(token);

  while (index !== -1) {
    count += 1;
    index = value.indexOf(token, index + token.length);
  }

  return count;
}
