"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function HashScrollHandler() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const scrollToTarget = () => {
        const target =
          document.getElementById(id) || document.querySelector(hash);

        if (target) {
          lenis.scrollTo(target, { offset: -84, duration: 1.2 });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const rafId = requestAnimationFrame(() => {
          if (!scrollToTarget()) {
            lenis.scrollTo(0, { duration: 1.2 });
          }
        });
        return () => cancelAnimationFrame(rafId);
      }
    } else {
      lenis.scrollTo(0, { duration: 1.2 });
    }
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
        lenis.scrollTo(target, { offset: -84, duration: 1.2 });
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
        anchors: { offset: -84 },
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
