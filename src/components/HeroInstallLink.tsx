"use client";

import { useEffect, useState } from "react";

export function HeroInstallLink() {
  const [os, setOs] = useState<"unix" | "windows">("unix");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform =
      (window.navigator as any).userAgentData?.platform?.toLowerCase() ||
      window.navigator.platform?.toLowerCase() ||
      "";
    if (userAgent.includes("win") || platform.includes("win")) {
      setOs("windows");
    }
  }, []);

  const isWindows = os === "windows";

  return (
    <a
      href="/docs/installation"
      className="mt-7 inline-flex max-w-full items-center gap-2 overflow-x-auto px-3 py-2 font-mono text-sm text-white/45 transition hover:text-white/70"
    >
      <span className="text-white/28">{isWindows ? ">" : "$"}</span>
      {isWindows
        ? "irm https://jolter.dev/install.ps1 | iex"
        : "curl -fsSL https://jolter.dev/install.sh | sh"}
    </a>
  );
}
