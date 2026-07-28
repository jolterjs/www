"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileText,
  Home,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { useMobileDrawer } from "./MobileDrawerProvider";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const mainItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Documentation", href: "/docs", icon: FileText },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Features", href: "/#features", icon: Sparkles },
  { name: "Workflow", href: "/#workflow", icon: Workflow },
  { name: "Plugins", href: "/#plugins", icon: Blocks },
  {
    name: "Plugin Registry",
    href: "https://plugins.jolter.dev",
    external: true,
    icon: ExternalLink,
  },
  {
    name: "GitHub",
    href: "https://github.com/jolterjs/jolter",
    external: true,
    icon: GithubIcon,
  },
];

export default function MobileDrawer() {
  const { isOpen, closeDrawer, docsNav, currentDocsHref } = useMobileDrawer();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

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
      closeDrawer();
    }
    setDragOffsetY(0);
  };

  const handleLinkClick = (href: string) => {
    const targetPath = href.split("#")[0];
    const isSamePage = targetPath === "" || targetPath === pathname;
    if (isSamePage) {
      closeDrawer();
    }
  };

  if (!mounted) return null;

  const isDocs = Boolean(docsNav && pathname.startsWith("/docs"));

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/82.5 transition-all"
        onClick={closeDrawer}
      />

      <div
        ref={drawerRef}
        style={{
          transform: isOpen
            ? `translateY(${dragOffsetY}px)`
            : "translateY(100%)",
        }}
        className="absolute inset-x-0 bottom-0 mx-2 flex max-h-[88vh] flex-col rounded-t-[28px] border-x border-t border-white/12 bg-[#080808] shadow-[0_-12px_40px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        <div
          className="flex w-full cursor-grab items-center justify-center pt-3 pb-2 active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1.5 w-12 rounded-full bg-white/20 transition hover:bg-white/40" />
        </div>

        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 pt-1 pb-4">
          <div className="flex items-center gap-3">
            <img src="/jnbg.png" className="size-6 opacity-90" alt="" />
            <span className="text-lg font-semibold text-white">
              Jolter{" "}
              {isDocs && (
                <>
                  <span className="mx-0.5 text-lg font-light text-white/40">
                    /
                  </span>
                  <span className="ml-1 text-lg font-semibold text-white">
                    Docs
                  </span>
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-white/[0.12] hover:text-white"
            aria-label="Close menu"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-5"
          data-lenis-prevent
          data-no-reveal
        >
          {isDocs ? (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-[12px] font-medium tracking-normal text-white/40">
                  Quick Links
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/"
                    onClick={() => handleLinkClick("/")}
                    className="flex flex-row items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] py-3 text-xs font-medium text-white/80 transition hover:bg-white/[0.08]"
                  >
                    <Home className="size-4 text-white/60" />
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => handleLinkClick("/blog")}
                    className="flex flex-row items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] py-3 text-xs font-medium text-white/80 transition hover:bg-white/[0.08]"
                  >
                    <BookOpen className="size-4 text-white/60" />
                    Blog
                  </Link>
                  <a
                    href="https://github.com/jolterjs/jolter"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeDrawer}
                    className="flex flex-row items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] py-3 text-xs font-medium text-white/80 transition hover:bg-white/[0.08]"
                  >
                    <GithubIcon className="size-4 text-white/60" />
                    GitHub
                  </a>
                </div>
              </div>

              {docsNav?.map((group) => (
                <div key={group.group} className="space-y-2">
                  <p className="text-[12px] font-medium tracking-normal text-white/40">
                    {group.group}
                  </p>
                  <div className="space-y-1">
                    {group.pages.map((item) => {
                      const isActive =
                        item.href === currentDocsHref || pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => handleLinkClick(item.href)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                            isActive
                              ? "bg-white/[0.05] font-semibold"
                              : "text-white/65 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <span>{item.title}</span>
                          <ChevronRight
                            className={`size-4 opacity-40 ${
                              isActive ? "opacity-100" : ""
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <nav className="space-y-1.5">
                {mainItems.map((item) => {
                  const Icon = item.icon;
                  const isExternal = Boolean(item.external);

                  return isExternal ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={closeDrawer}
                      className="flex items-center justify-between rounded-xl border border-transparent px-3.5 py-3 text-base font-medium text-white/70 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4.5 text-white/40" />
                        <span>{item.name}</span>
                      </div>
                      <ExternalLink className="size-4 text-white/30" />
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-medium transition ${
                        pathname === item.href
                          ? "bg-white/[0.05] font-semibold text-white"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4.5 text-white/40" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="size-4 text-white/30" />
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2">
                <Link
                  href="/docs/quickstart"
                  onClick={() => handleLinkClick("/docs/quickstart")}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Get Started <ArrowRight className="ml-1 size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
