"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  ChevronDown,
  CornerDownLeft,
  Cpu,
  ExternalLink,
  FileText,
  Globe,
  Menu,
  Rocket,
  Search,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import type { DocSearchItem } from "@/lib/docs-types";
import { useMobileDrawer } from "./MobileDrawerProvider";
import DiscordIcon from "@/icons/discord";
import XIcon from "@/icons/xicon";

type SearchResult = DocSearchItem & {
  score: number;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Header({
  docsSearchIndex,
}: {
  docsSearchIndex: DocSearchItem[];
}) {
  const pathname = usePathname();
  const { toggleDrawer } = useMobileDrawer();

  const isHome = pathname === "/";
  const isBlog = pathname.includes("/blog");

  return (
    <header
      className={`fixed top-0 z-50 w-full ${!isHome && !isBlog && "border-b border-white/[0.08]"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            className="flex shrink-0 items-center transition hover:opacity-80"
            aria-label="Jolter home"
          >
            <img src="/jnbg.png" className="size-7" alt="" />
          </Link>

          <Navigation />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DocsSearchModal docsSearchIndex={docsSearchIndex} />
          <Link
            href="/docs/quickstart"
            className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Learn
          </Link>
          <button
            type="button"
            onClick={toggleDrawer}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="size-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Navigation() {
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<
    Record<string, HTMLButtonElement | HTMLAnchorElement | null>
  >({});
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [direction, setDirection] = useState<number>(1);
  const [metrics, setMetrics] = useState<{
    left: number;
    width: number;
    height: number;
    arrowX: number;
  } | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const TABS = ["product", "ecosystem", "resources"];

  const handleMouseEnterTab = (tabId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredTab(tabId);

    if (TABS.includes(tabId)) {
      if (activeTab && activeTab !== tabId) {
        const prevIndex = TABS.indexOf(activeTab);
        const newIndex = TABS.indexOf(tabId);
        setDirection(newIndex > prevIndex ? 1 : -1);
      }
      setActiveTab(tabId);
    } else {
      setActiveTab(null);
    }
  };

  const handleMouseLeaveNav = () => {
    setHoveredTab(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 180);
  };

  const handleMouseEnterDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeaveDropdown = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 180);
  };

  const updateMetrics = useCallback(() => {
    if (!activeTab || !navRef.current) return;
    const tabEl = tabRefs.current[activeTab];
    if (!tabEl) return;
    const contentEl = contentRefs.current[activeTab];

    const navWidth = navRef.current.offsetWidth;
    const centerLeft = tabEl.offsetLeft + tabEl.offsetWidth / 2;
    const fallbackWidth = activeTab === "product" ? 540 : 480;
    const contentWidth = contentEl?.offsetWidth || fallbackWidth;
    const contentHeight = contentEl?.offsetHeight || 220;

    const minLeft = -20;
    const maxLeft = navWidth - contentWidth + 20;
    const rawLeft = centerLeft - contentWidth / 2;
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, rawLeft));

    const arrowX = centerLeft - clampedLeft;

    setMetrics({
      left: clampedLeft,
      width: contentWidth,
      height: contentHeight,
      arrowX,
    });
  }, [activeTab]);

  useIsomorphicLayoutEffect(() => {
    updateMetrics();
    if (!activeTab) return;
    const contentEl = contentRefs.current[activeTab];
    if (!contentEl) return;

    const ro = new ResizeObserver(() => {
      updateMetrics();
    });
    ro.observe(contentEl);
    return () => ro.disconnect();
  }, [activeTab, updateMetrics]);

  useEffect(() => {
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, [updateMetrics]);

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center gap-1 lg:flex"
      onMouseLeave={handleMouseLeaveNav}
    >
      <button
        type="button"
        ref={(el) => {
          tabRefs.current["product"] = el;
        }}
        onMouseEnter={() => handleMouseEnterTab("product")}
        className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
          activeTab === "product"
            ? "text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        {hoveredTab === "product" && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          Product
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${
              activeTab === "product"
                ? "rotate-180 text-white"
                : "text-white/40"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        ref={(el) => {
          tabRefs.current["ecosystem"] = el;
        }}
        onMouseEnter={() => handleMouseEnterTab("ecosystem")}
        className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
          activeTab === "ecosystem"
            ? "text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        {hoveredTab === "ecosystem" && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          Ecosystem
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${
              activeTab === "ecosystem"
                ? "rotate-180 text-white"
                : "text-white/40"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        ref={(el) => {
          tabRefs.current["resources"] = el;
        }}
        onMouseEnter={() => handleMouseEnterTab("resources")}
        className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
          activeTab === "resources"
            ? "text-white"
            : "text-white/60 hover:text-white"
        }`}
      >
        {hoveredTab === "resources" && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          Resources
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${
              activeTab === "resources"
                ? "rotate-180 text-white"
                : "text-white/40"
            }`}
          />
        </span>
      </button>

      <Link
        href="/blog"
        ref={(el) => {
          tabRefs.current["blog"] = el;
        }}
        onMouseEnter={() => handleMouseEnterTab("blog")}
        className="relative inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium text-white/60 transition-colors duration-150 hover:text-white"
      >
        {hoveredTab === "blog" && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">Blog</span>
      </Link>

      <div className="mx-1.5 h-4 w-[1px] bg-white/15" />

      <a
        href="https://github.com/jolterjs/jolter"
        target="_blank"
        rel="noreferrer"
        ref={(el) => {
          tabRefs.current["github"] = el;
        }}
        onMouseEnter={() => handleMouseEnterTab("github")}
        className="group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/60 transition-colors duration-150 hover:text-white"
      >
        {hoveredTab === "github" && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          GitHub
          <ExternalLink className="size-3 text-white/35 transition group-hover:text-white/70" />
        </span>
      </a>

      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: metrics?.left ?? 0,
              width: metrics?.width ?? "auto",
              height: metrics?.height ?? "auto",
            }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 32,
              mass: 0.7,
            }}
            onMouseEnter={handleMouseEnterDropdown}
            onMouseLeave={handleMouseLeaveDropdown}
            className="absolute top-full z-50 mt-3.5 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#09090b]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl before:absolute before:inset-x-0 before:-top-4 before:h-4"
            style={{ transformOrigin: "top center" }}
          >
            {metrics && (
              <motion.div
                className="absolute -top-1.5 size-3 rotate-45 border-t border-l border-white/20 bg-[#09090b]"
                animate={{ left: metrics.arrowX }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 32,
                  mass: 0.7,
                }}
                style={{ x: "-50%" }}
              />
            )}

            <div className="relative overflow-hidden">
              <AnimatePresence
                mode="popLayout"
                custom={direction}
                initial={false}
              >
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      opacity: 0,
                      x: dir * 16,
                      filter: "blur(4px)",
                    }),
                    center: { opacity: 1, x: 0, filter: "blur(0px)" },
                    exit: (dir: number) => ({
                      opacity: 0,
                      x: dir * -16,
                      filter: "blur(4px)",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeTab === "product" && (
                    <ProductMenu
                      onClose={() => setActiveTab(null)}
                      contentRef={(el) => {
                        contentRefs.current["product"] = el;
                      }}
                    />
                  )}
                  {activeTab === "ecosystem" && (
                    <EcosystemMenu
                      onClose={() => setActiveTab(null)}
                      contentRef={(el) => {
                        contentRefs.current["ecosystem"] = el;
                      }}
                    />
                  )}
                  {activeTab === "resources" && (
                    <ResourcesMenu
                      onClose={() => setActiveTab(null)}
                      contentRef={(el) => {
                        contentRefs.current["resources"] = el;
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function ProductMenu({
  onClose,
  contentRef,
}: {
  onClose: () => void;
  contentRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={contentRef} className="w-[540px] max-w-[calc(100vw-2rem)] p-3">
      <div className="mb-2 px-3 pt-1 text-[12px] font-medium tracking-normal text-white/40">
        Core Product
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/#features"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Sparkles className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Features</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Reactive shims, toolchain pinning, and zero-overhead runtime
              resolution.
            </div>
          </div>
        </Link>

        <Link
          href="/#workflow"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Workflow className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Workflow</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Streamlined multi-runtime dev environments and monorepo tooling.
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-2.5 border-t border-white/[0.08] pt-2.5">
        <Link
          href="/docs/quickstart"
          onClick={onClose}
          className="group flex items-center justify-between rounded-xl bg-white/[0.03] p-3.5 transition hover:bg-white/[0.07]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
              <Rocket className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white">
                Quickstart Guide
              </div>
              <div className="text-xs text-white/45">
                Get started with Jolter in under 2 minutes.
              </div>
            </div>
          </div>
          <ArrowRight className="ml-2 size-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
        </Link>
      </div>
    </div>
  );
}

function EcosystemMenu({
  onClose,
  contentRef,
}: {
  onClose: () => void;
  contentRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={contentRef} className="w-[480px] max-w-[calc(100vw-2rem)] p-3">
      <div className="mb-2 px-3 pt-1 text-[12px] font-medium tracking-normal text-white/40">
        Ecosystem & Extensions
      </div>
      <div className="space-y-1">
        <Link
          href="/#plugins"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Blocks className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Plugins System</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Extend Jolter with WebAssembly-backed plugins and custom tool
              providers.
            </div>
          </div>
        </Link>

        <Link
          href="/docs/automation/mcp-server"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Terminal className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">MCP Server</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Integrate Jolter deep into Cursor, VS Code, and Claude via Model
              Context Protocol.
            </div>
          </div>
        </Link>

        <a
          href="https://plugins.jolter.dev"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Globe className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-white">
              Plugin Registry
              <ExternalLink className="size-3 text-white/40 transition group-hover:text-white/70" />
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Browse, search, and publish official & community Jolter plugins.
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function ResourcesMenu({
  onClose,
  contentRef,
}: {
  onClose: () => void;
  contentRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={contentRef} className="w-[790px] max-w-[calc(100vw-2rem)] p-3">
      <div className="mb-2 px-3 pt-1 text-[12px] font-medium tracking-normal text-white/40">
        Resources & Community
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Link
          href="/docs"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <BookOpen className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Docs</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Comprehensive guides, CLI reference, and architecture docs.
            </div>
          </div>
        </Link>

        <Link
          href="/blog"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <FileText className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Blog</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Latest release announcements, deep-dives, and core updates.
            </div>
          </div>
        </Link>

        <Link
          href="/docs/automation/mcp-server"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <Cpu className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">MCP Server</div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Connect AI assistants directly to your project toolchains.
            </div>
          </div>
        </Link>

        <a
          href="https://github.com/jolterjs/jolter"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <GithubIcon className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-white">
              GitHub
              <ExternalLink className="size-3 text-white/40 transition group-hover:text-white/70" />
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Explore source code, report issues, and join the community.
            </div>
          </div>
        </a>

        <a
          href="https://discord.gg/w6XFHFesaW"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <DiscordIcon className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-white">
              Discord
              <ExternalLink className="size-3 text-white/40 transition group-hover:text-white/70" />
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Join our community on discord and get help.
            </div>
          </div>
        </a>

        <a
          href="https://x.com/jolterdev"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/75 transition group-hover:bg-white/7.5 group-hover:text-white">
            <XIcon className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-white">
              X (Twitter)
              <ExternalLink className="size-3 text-white/40 transition group-hover:text-white/70" />
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-white/50">
              Follow us on X for the latest updates and news.
            </div>
          </div>
        </a>
      </div>
    </div>
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
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
      return;
    }

    if (window.innerWidth < 768) {
      document.documentElement.setAttribute("data-drawer-open", "true");
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
    };
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
            className={`absolute inset-x-0 bottom-0 mx-2 flex max-h-[85vh] flex-col rounded-t-[28px] border-x border-t border-white/12 bg-[#080808] shadow-[0_-12px_40px_rgba(0,0,0,0.9)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform sm:top-24 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-2xl sm:border sm:border-white/12 sm:shadow-2xl sm:shadow-black/70 ${
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
        className="hidden h-9 w-72 items-center justify-between rounded-full border border-white/[0.08] bg-white/[0.05] px-3 text-sm text-white/36 transition hover:border-white/[0.16] hover:text-white/56 xl:flex"
        data-docs-search-trigger
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Search documentation...
        </span>
        <kbd className="rounded-full border border-white/[0.12] bg-black/10 px-1.5 py-0.5 font-mono text-[11px] text-white/55">
          Ctrl K
        </kbd>
      </button>
      <button
        type="button"
        onClick={openSearch}
        className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-white/45 transition hover:border-white/[0.16] hover:text-white xl:hidden"
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
              <div className="px-2 pt-4 pb-1 text-[12px] font-medium tracking-normal text-white/40 first:pt-1">
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
