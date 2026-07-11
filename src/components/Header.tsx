"use client";

import { ExternalLink, Search } from "lucide-react";

const items = [
  { name: "Features", href: "#features", external: false },
  { name: "Workflow", href: "#workflow", external: false },
  { name: "Plugins", href: "#plugins", external: false },
  { name: "Docs", href: "https://docs.jolter.dev" },
  { name: "Plugins", href: "https://plugins.jolter.dev" },
  { name: "GitHub", href: "https://github.com/jolterjs/jolter" },
];

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-black/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-3 transition hover:opacity-80"
            aria-label="Jolter home"
          >
            <span className="text-xl font-semibold text-white">Jolter</span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {items.map((item) => {
              const external = item.href.startsWith("http");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/48 transition hover:text-white"
                >
                  {item.name}
                  {external && (
                    <ExternalLink className="size-3 text-white/28 transition group-hover:text-white/65" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://docs.jolter.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 w-72 items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 text-sm text-white/36 transition hover:border-white/[0.16] hover:text-white/56 xl:flex"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              Search documentation...
            </span>
            <kbd className="rounded border border-white/[0.12] bg-black px-1.5 py-0.5 font-mono text-[11px] text-white/55">
              Ctrl K
            </kbd>
          </a>
          <a
            href="https://docs.jolter.dev/quickstart"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Learn
          </a>
        </div>
      </div>
    </header>
  );
}
