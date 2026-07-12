"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
import { copyWithFallback, dispatchToast } from "@/lib/copy";

type CopyButtonProps = {
  code: string;
  label: string;
  className?: string;
};

export default function CopyButton({
  code,
  label,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function handleCopy() {
    const didCopy = await copyWithFallback(code);

    if (didCopy) {
      setCopied(true);
      dispatchToast("Copied", "success");

      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }

      resetTimer.current = setTimeout(() => {
        setCopied(false);
      }, 1200);
    } else {
      dispatchToast("Copy failed", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex size-8 items-center justify-center rounded-md text-white/35 transition hover:bg-white/[0.05] hover:text-white/75 ${
        copied ? "scale-105 text-emerald-300" : ""
      } ${className}`}
      aria-label={`Copy ${label}`}
      data-copy-button={label}
      data-copied={copied ? "true" : "false"}
    >
      <span className="relative size-4">
        <Copy
          className={`absolute inset-0 size-4 transition duration-200 ${
            copied
              ? "scale-50 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <Check
          className={`absolute inset-0 size-4 transition duration-200 ${
            copied
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
