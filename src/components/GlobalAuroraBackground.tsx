"use client";

import { usePathname } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function GlobalAuroraBackground() {
  const pathname = usePathname();

  // On homepage ("/"), the hero section renders its own custom layered Aurora background
  if (pathname === "/") {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[700px] overflow-hidden opacity-75">
      <AuroraBackground className="h-full w-full bg-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
    </div>
  );
}
