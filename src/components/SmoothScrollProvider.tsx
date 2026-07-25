"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function HashScrollHandler() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));
      const target =
        document.getElementById(id) || document.querySelector(hash);

      if (target) {
        lenis.scrollTo(target, { offset: -84, duration: 1.2 });
      }
    };

    scrollToHash();
    const rafId = requestAnimationFrame(scrollToHash);
    const timer1 = setTimeout(scrollToHash, 100);
    const timer2 = setTimeout(scrollToHash, 300);

    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [lenis, pathname]);

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
