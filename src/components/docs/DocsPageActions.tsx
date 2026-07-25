"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import { absoluteUrl } from "@/lib/site";

interface DocsPageActionsProps {
  slug: string;
  content: string;
  href: string;
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ChatGPTIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.946-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

function ClaudeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}

function CursorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
    </svg>
  );
}

function PerplexityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" />
    </svg>
  );
}

export function DocsPageActions({ slug, content, href }: DocsPageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const [mountedOrigin, setMountedOrigin] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setMountedOrigin(window.location.origin);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.documentElement.setAttribute("data-drawer-open", "true");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.removeAttribute("data-drawer-open");
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      setIsOpen(false);
    }
    setDragOffsetY(0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown: ", err);
    }
  };

  const docPath = slug === "index" || !slug ? "index" : slug;
  const currentDocUrl = mountedOrigin
    ? `${mountedOrigin}${href}`
    : absoluteUrl(href);

  const menuItems = [
    {
      name: "Open in GitHub",
      icon: GithubIcon,
      href: `https://github.com/jolterjs/www/blob/main/src/content/docs/${docPath}.mdx`,
    },
    {
      name: "View as Markdown",
      icon: FileText,
      href: `/api/docs/raw?slug=${encodeURIComponent(slug)}`,
    },
    {
      name: "Open in Perplexity",
      icon: PerplexityIcon,
      href: `https://www.perplexity.ai/search/new?q=${encodeURIComponent(`Read ${currentDocUrl}, I want to ask questions about it.`)}`,
    },
    {
      name: "Open in ChatGPT",
      icon: ChatGPTIcon,
      href: `https://chatgpt.com/?prompt=${encodeURIComponent(`Read ${currentDocUrl}, I want to ask questions about it.`)}&hints=search`,
    },
    {
      name: "Open in Claude",
      icon: ClaudeIcon,
      href: `https://claude.ai/new?q=${encodeURIComponent(`Read ${currentDocUrl}, I want to ask questions about it.`)}`,
    },
    {
      name: "Open in Cursor",
      icon: CursorIcon,
      href: `https://cursor.com/link/prompt?text=${encodeURIComponent(`Read ${currentDocUrl}, I want to ask questions about it.`)}`,
    },
  ];

  return (
    <div className="mt-5 flex items-center gap-2" data-no-reveal>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-400" />
            <span>Copied Markdown</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5 text-white/60" />
            <span>Copy Markdown</span>
          </>
        )}
      </button>

      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <span>Open</span>
          <ChevronDown
            className={`size-3.5 text-white/60 transition-transform duration-200`}
          />
        </button>

        {!isMobile && (
          <div
            className={`absolute top-full right-0 z-40 mt-2 w-56 origin-top-right rounded-xl border border-white/12 bg-[#0c0c0c]/95 p-1.5 shadow-2xl backdrop-blur-md transition-all duration-150 ease-out ${
              isOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-1 scale-95 opacity-0"
            }`}
            role="menu"
            aria-hidden={!isOpen}
          >
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex cursor-default items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                    role="menuitem"
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0 text-white/75" />
                      <span>{item.name}</span>
                    </div>
                    <ExternalLink className="size-3.5 shrink-0 text-white/35" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isMobile &&
        isMounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              isOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/82.5 transition-all"
              onClick={() => setIsOpen(false)}
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
                <span className="text-lg font-semibold text-white">
                  Open Page
                </span>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                <nav className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-transparent px-3.5 py-3 text-base font-medium text-white/70 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4.5 text-white/40" />
                          <span>{item.name}</span>
                        </div>
                        <ExternalLink className="size-4 text-white/30" />
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
