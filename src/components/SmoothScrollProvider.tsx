"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

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
      {children}
    </ReactLenis>
  );
}
