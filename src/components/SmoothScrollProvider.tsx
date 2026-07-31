"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function HashScrollHandler() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    let lastPos = -1;
    let stableCount = 0;
    let attempts = 0;

    const checkAndScroll = () => {
      if (cancelled) return;

      const target =
        document.getElementById(id) || document.querySelector(hash);

      if (!target) {
        attempts++;
        if (attempts < 25) {
          timeoutId = setTimeout(checkAndScroll, 50);
        }
        return;
      }

      const pos = target.getBoundingClientRect().top + window.scrollY;

      if (lastPos >= 0 && Math.abs(pos - lastPos) < 3) {
        stableCount++;
      } else {
        stableCount = 0;
        lastPos = pos;
      }

      if (stableCount >= 2 || attempts >= 20) {
        lenis.scrollTo(target, { offset: -84, duration: 1.2 });
      } else {
        attempts++;
        timeoutId = setTimeout(checkAndScroll, 60);
      }
    };

    timeoutId = setTimeout(checkAndScroll, 50);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [lenis, pathname]);

  useEffect(() => {
    if (!lenis) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));
      const target =
        document.getElementById(id) || document.querySelector(hash);

      if (target) {
        lenis.scrollTo(target, { offset: -84, duration: 0.8 });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        anchors: false,
        autoRaf: true,
        lerp: 0.09,
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      <HashScrollHandler />
      {children}
    </ReactLenis>
  );
}
