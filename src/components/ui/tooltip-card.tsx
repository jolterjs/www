"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Globe,
  BookOpen,
  FileText,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

function normalizeHref(href: string) {
  if (!href || href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }

  if (
    href === "/blog" ||
    href.startsWith("/blog/") ||
    href === "/docs" ||
    href.startsWith("/docs/") ||
    href === "/" ||
    href === "/llms.txt" ||
    href === "/llms-full.txt" ||
    href.startsWith("/api/")
  ) {
    return href;
  }

  if (href.startsWith("docs/")) {
    return `/${href}`;
  }

  if (href.startsWith("blog/")) {
    return `/${href}`;
  }

  if (href.startsWith("/")) {
    return `/docs${href}`;
  }

  return `/docs/${href}`;
}

export const Tooltip = ({
  content,
  children,
  containerClassName,
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const contentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    });

    observer.observe(contentRef.current);
    setHeight(contentRef.current.scrollHeight);

    return () => observer.disconnect();
  }, [isVisible, content]);

  const calculatePosition = (clientX: number, clientY: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipWidth = contentRef.current?.offsetWidth || 288;
    const tooltipHeight = contentRef.current?.scrollHeight || 160;

    let finalX = clientX + 12;
    let finalY = clientY + 12;

    if (finalX + tooltipWidth > viewportWidth - 12) {
      finalX = clientX - tooltipWidth - 12;
    }

    if (finalX < 12) {
      finalX = 12;
    }

    if (finalY + tooltipHeight > viewportHeight - 12) {
      finalY = clientY - tooltipHeight - 12;
    }

    if (finalY < 12) {
      finalY = 12;
    }

    return { x: finalX, y: finalY };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    setIsVisible(true);
    const newPosition = calculatePosition(e.clientX, e.clientY);
    setPosition(newPosition);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!isVisible) return;
    const newPosition = calculatePosition(e.clientX, e.clientY);
    setPosition(newPosition);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>) => {
    const touch = e.touches[0];
    const newPosition = calculatePosition(touch.clientX, touch.clientY);
    setPosition(newPosition);
    setIsVisible(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      if (isVisible) {
        setIsVisible(false);
      } else {
        const newPosition = calculatePosition(e.clientX, e.clientY);
        setPosition(newPosition);
        setIsVisible(true);
      }
    }
  };

  const tooltipElement = (
    <AnimatePresence>
      {isVisible && (
        <motion.span
          key={String(isVisible)}
          initial={{ height: 0, opacity: 0, scale: 0.95 }}
          animate={{ height: height || "auto", opacity: 1, scale: 1 }}
          exit={{ height: 0, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="pointer-events-none fixed z-[99999] block w-72 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 text-white shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/95"
          style={{
            top: position.y,
            left: position.x,
          }}
        >
          <span ref={contentRef} className="block p-3 text-xs">
            {content}
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  );

  return (
    <span
      ref={containerRef}
      className={cn("relative inline", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
      {mounted && createPortal(tooltipElement, document.body)}
    </span>
  );
};

export type LinkMetadata = {
  isExternal: boolean;
  title: string;
  description?: string;
  siteName?: string;
  category?: string;
  hostname?: string;
  previewImage?: string | null;
  favicon?: string;
  url?: string;
  href?: string;
};

const metadataCache = new Map<string, LinkMetadata>();
const pendingFetches = new Map<string, Promise<LinkMetadata | null>>();

async function fetchLinkMetadata(url: string): Promise<LinkMetadata | null> {
  if (metadataCache.has(url)) {
    return metadataCache.get(url)!;
  }
  if (pendingFetches.has(url)) {
    return pendingFetches.get(url)!;
  }

  const promise = (async () => {
    try {
      const res = await fetch(
        `/api/link-preview?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) return null;
      const data = (await res.json()) as LinkMetadata;
      metadataCache.set(url, data);
      return data;
    } catch {
      return null;
    } finally {
      pendingFetches.delete(url);
    }
  })();

  pendingFetches.set(url, promise);
  return promise;
}

export function LinkPreviewCardContent({ href }: { href: string }) {
  const [data, setData] = useState<LinkMetadata | null>(
    () => metadataCache.get(href) || null,
  );
  const [loading, setLoading] = useState<boolean>(!data);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!data) {
      setLoading(true);
      fetchLinkMetadata(href).then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [href, data]);

  if (loading) {
    const isExt = href.startsWith("http");
    return (
      <span className="block space-y-2.5 py-0.5">
        <span className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="size-3.5 animate-pulse rounded-full bg-white/15" />
            <span className="h-3 w-20 animate-pulse rounded bg-white/15" />
          </span>
          <span className="h-3.5 w-14 animate-pulse rounded bg-white/10" />
        </span>

        <span className="block space-y-1.5">
          <span className="block h-4 w-5/6 animate-pulse rounded bg-white/20" />
          <span className="block h-3 w-full animate-pulse rounded bg-white/10" />
          <span className="block h-3 w-4/5 animate-pulse rounded bg-white/10" />
        </span>

        {isExt && (
          <span className="mt-2 block h-28 w-full animate-pulse rounded-lg border border-white/10 bg-white/5" />
        )}
      </span>
    );
  }

  if (!data) {
    const isExt = href.startsWith("http");
    return (
      <span className="block space-y-1 py-1">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
          <Globe className="size-3 text-neutral-400" />
          <span>{isExt ? "External Link" : "Internal Page"}</span>
        </span>
        <span className="block font-semibold break-words text-white">
          {href}
        </span>
      </span>
    );
  }

  const {
    isExternal,
    title,
    description,
    siteName,
    category,
    previewImage,
    favicon,
    url,
  } = data;

  if (isExternal) {
    return (
      <span className="block space-y-2">
        <span className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 text-[11px]">
          <span className="flex min-w-0 items-center gap-1.5 font-medium text-neutral-400">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="inline-block size-3.5 shrink-0 rounded-xs"
              />
            ) : (
              <Globe className="inline-block size-3.5 shrink-0 text-neutral-400" />
            )}
            <span className="inline-block truncate">
              {siteName || "External Website"}
            </span>
          </span>
          <ArrowUpRight className="inline-block size-3 opacity-60" />
        </span>

        <span className="block">
          <span className="line-clamp-2 block text-xs leading-snug font-semibold text-white">
            {title}
          </span>
          {description && (
            <span className="mt-1 line-clamp-2 block text-[11px] leading-relaxed text-neutral-400">
              {description}
            </span>
          )}
        </span>

        <span className="relative mt-2 block overflow-hidden rounded-lg border border-white/10 bg-neutral-950">
          {previewImage && !imgError ? (
            <img
              src={previewImage}
              alt={title}
              onError={() => setImgError(true)}
              className="block h-28 w-full object-cover"
            />
          ) : (
            <span className="relative block h-28 w-full overflow-hidden bg-neutral-950">
              <iframe
                src={url || href}
                title="Page preview render"
                tabIndex={-1}
                className="pointer-events-none block h-[400%] w-[400%] origin-top-left scale-25 border-none opacity-80"
              />
            </span>
          )}
        </span>
      </span>
    );
  }

  return (
    <span className="block space-y-2">
      <span className="block">
        <span className="line-clamp-2 block text-sm leading-snug font-semibold text-white">
          {title}
        </span>
        {description && (
          <span className="mt-1.5 line-clamp-3 block text-[12px] leading-relaxed text-neutral-300">
            {description}
          </span>
        )}
      </span>
    </span>
  );
}

export function LinkPreview({
  href = "",
  external = false,
  children,
  className = "",
  ...props
}: {
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const normalizedHref = normalizeHref(href);
  const isAnchorOnly = !normalizedHref || normalizedHref.startsWith("#");

  if (isAnchorOnly) {
    return (
      <a href={normalizedHref || undefined} className={className} {...props}>
        {children}
      </a>
    );
  }

  const isExt = external || normalizedHref.startsWith("http");
  const content = <LinkPreviewCardContent href={normalizedHref} />;

  if (isExt) {
    return (
      <Tooltip content={content} containerClassName="inline">
        <a
          href={normalizedHref}
          target="_blank"
          rel="noreferrer"
          className={className}
          {...props}
        >
          {children}
        </a>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={content} containerClassName="inline">
      <Link href={normalizedHref} className={className} {...props}>
        {children}
      </Link>
    </Tooltip>
  );
}
