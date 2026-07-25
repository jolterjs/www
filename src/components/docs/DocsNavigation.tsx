"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DocHeading, DocNavGroup, DocNavItem } from "@/lib/docs-types";
import { useMobileDrawer } from "@/components/MobileDrawerProvider";

export function DocsSidebarNav({
  nav,
  currentHref,
}: {
  nav: DocNavGroup[];
  currentHref: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLElement>(
      "[data-docs-nav-active='true']",
    );

    if (!container || !active) {
      return;
    }

    container.scrollTo({
      top: active.offsetTop - container.clientHeight / 2 + active.clientHeight,
      behavior: "auto",
    });
  }, [currentHref]);

  return (
    <aside
      ref={containerRef}
      className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto border-r border-white/[0.08] pr-6 lg:block"
      data-lenis-prevent
      data-no-reveal
    >
      <nav className="space-y-8">
        {nav.map((group) => (
          <DocsNavGroup
            key={group.group}
            group={group}
            currentHref={currentHref}
          />
        ))}
      </nav>
    </aside>
  );
}

export function DocsMobileNav({
  nav,
  currentHref,
}: {
  nav: DocNavGroup[];
  currentHref: string;
}) {
  const { setDocsNav, setCurrentDocsHref, openDrawer } = useMobileDrawer();

  React.useEffect(() => {
    setDocsNav(nav);
    setCurrentDocsHref(currentHref);

    return () => {
      setDocsNav(null);
      setCurrentDocsHref("");
    };
  }, [nav, currentHref, setDocsNav, setCurrentDocsHref]);

  const current = nav
    .flatMap((group) => group.pages)
    .find((item) => item.href === currentHref);

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="docs-mobile-nav mb-8 flex w-full items-center justify-between rounded-xl border border-white/[0.1] bg-[#050505] px-4 py-3 text-left text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.04] lg:hidden"
    >
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-xs text-white/40 uppercase">Docs:</span>
        <span className="font-medium text-white">
          {current?.title ?? "Browse docs"}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-white/50">
        <span>Menu</span>
        <ChevronRight className="size-4" />
      </div>
    </button>
  );
}

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const toc = React.useMemo(
    () => headings.filter((heading) => heading.depth <= 3),
    [headings],
  );
  const [activeId, setActiveId] = React.useState(toc[0]?.id ?? "");

  React.useEffect(() => {
    if (toc.length === 0) {
      return;
    }

    let frame = 0;

    function updateActiveHeading() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        let nextActiveId = toc[0]?.id ?? "";
        let closestDistance = Number.POSITIVE_INFINITY;
        const readingLine = 128;

        for (const heading of toc) {
          const element = document.getElementById(heading.id);

          if (!element) {
            continue;
          }

          const rect = element.getBoundingClientRect();

          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            continue;
          }

          const distance = Math.abs(rect.top - readingLine);

          if (distance < closestDistance) {
            closestDistance = distance;
            nextActiveId = heading.id;
          }
        }

        setActiveId(nextActiveId);
      });
    }

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [toc]);

  if (toc.length === 0) {
    return <div className="hidden xl:block" data-no-reveal />;
  }

  return (
    <aside
      className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto xl:block"
      data-lenis-prevent
      data-no-reveal
    >
      <p className="mb-3 font-mono text-[11px] font-semibold tracking-normal text-white/32 uppercase">
        On this page
      </p>
      <nav className="space-y-1 border-l border-white/[0.08] pl-4">
        {toc.map((heading) => {
          const active = heading.id === activeId;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block border-l py-1.5 text-sm leading-5 transition ${
                heading.depth === 3 ? "pl-4" : "pl-3"
              } ${
                active
                  ? "-ml-4 border-white text-white"
                  : "-ml-4 border-transparent text-white/42 hover:text-white/78"
              }`}
              data-docs-toc-active={active ? "true" : "false"}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function DocsNavGroup({
  group,
  currentHref,
}: {
  group: DocNavGroup;
  currentHref: string;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] font-semibold tracking-normal text-white/32 uppercase">
        {group.group}
      </p>
      <div className="space-y-1">
        {group.pages.map((item) => (
          <DocsNavLink
            key={item.href}
            item={item}
            active={item.href === currentHref}
          />
        ))}
      </div>
    </div>
  );
}

function DocsNavLink({ item, active }: { item: DocNavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`block rounded-md px-2.5 py-2 text-sm transition ${
        active
          ? "bg-white/[0.075] text-white"
          : "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
      }`}
      data-docs-nav-active={active ? "true" : "false"}
    >
      {item.title}
    </Link>
  );
}
