"use client";

import { Command } from "lucide-react";
import CopyButton from "@/components/CopyButton";

type CopyableCodePanelProps = {
  title: string;
  code: string;
  highlightedHtml: string;
  className?: string;
  withCommandIcon?: boolean;
};

export default function CopyableCodePanel({
  title,
  code,
  highlightedHtml,
  className = "",
  withCommandIcon = false,
}: CopyableCodePanelProps) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-2xl border border-white/[0.11] bg-[#050505] ${className}`}
      data-copy-panel={title}
    >
      <div className="flex h-11 items-center justify-between border-b border-white/[0.09] px-4">
        <div className="flex min-w-0 items-center gap-2">
          {withCommandIcon && <Command className="size-3.5 text-white/40" />}
          <span className="truncate font-mono text-xs text-white/38">
            {title}
          </span>
        </div>
        <CopyButton code={code} label={title} />
      </div>
      <div
        className="overflow-x-auto p-5 text-sm leading-7 text-white/66 [&_.shiki]:!m-0 [&_.shiki]:!bg-transparent [&_.shiki]:!p-0 [&_.shiki]:font-mono [&_.shiki]:text-sm [&_.shiki]:leading-7 [&_.shiki]:[word-break:break-word] [&_.shiki]:whitespace-pre-wrap [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}
