"use client";

import React from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  "main > section",
  "[data-reveal]",
  ".docs-article > header",
  ".docs-markdown > *",
  ".docs-pagination",
].join(",");

export default function ScrollRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let observer: IntersectionObserver | null = null;
    const frame = window.requestAnimationFrame(() => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(revealSelector),
      ).filter((element) => {
        return (
          !element.dataset.revealBound &&
          !element.closest("header, footer, aside, [data-no-reveal]")
        );
      });

      if (prefersReducedMotion) {
        for (const element of candidates) {
          element.dataset.revealBound = "true";
          element.classList.add("scroll-reveal-visible");
        }
        return;
      }

      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }

            entry.target.classList.add("scroll-reveal-visible");
            activeObserver.unobserve(entry.target);
          }
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.08,
        },
      );

      for (const element of candidates) {
        element.dataset.revealBound = "true";
        element.classList.add("scroll-reveal");

        if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
          element.classList.add("scroll-reveal-visible");
          continue;
        }

        observer.observe(element);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
