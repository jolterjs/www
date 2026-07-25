"use client";

import React from "react";
import type { HighlightedSnippet } from "@/lib/highlight";
import CopyableCodePanel from "@/components/CopyableCodePanel";
import AppleIcon from "@/icons/apple";
import LinuxIcon from "@/icons/linux";
import WindowsIcon from "@/icons/windows";

type OsChoice = "unix" | "windows";

type WorkflowStep = {
  command: string;
  text: string;
};

type WorkflowSectionProps = {
  installSnippets: Record<OsChoice, HighlightedSnippet>;
  workflowSteps: WorkflowStep[];
};

export default function WorkflowSection({
  installSnippets,
  workflowSteps,
}: WorkflowSectionProps) {
  const [osSelected, setOsSelected] = React.useState<OsChoice>("unix");
  const selectedSnippet = installSnippets[osSelected];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] lg:items-start">
      <div className="lg:max-w-[420px]">
        <div className="max-w-xl">
          <p className="font-mono text-xs font-semibold tracking-normal text-white/38">
            Install and pin
          </p>
          <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-4xl xl:text-5xl">
            One workflow for laptops, monorepos, and CI.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/52">
            Use global versions as fallbacks, then pin project requirements so
            every contributor and automation job resolves the same toolchain.
          </p>
        </div>

        <div className="mt-8 max-w-[420px] rounded-lg border border-white/[0.12] bg-[#050505] p-1">
          <div className="grid grid-cols-2 gap-1">
            <OsButton
              active={osSelected === "unix"}
              onClick={() => setOsSelected("unix")}
              label="macOS/Linux"
            >
              <AppleIcon className="size-4 fill-current" />
              <LinuxIcon className="size-4 fill-current" />
            </OsButton>
            <OsButton
              active={osSelected === "windows"}
              onClick={() => setOsSelected("windows")}
              label="Windows"
            >
              <WindowsIcon className="size-4 fill-current" />
            </OsButton>
          </div>
        </div>

        <CopyableCodePanel
          title="first run"
          code={selectedSnippet.code}
          highlightedHtml={selectedSnippet.highlightedHtml}
          className="mt-3 max-w-[420px]"
        />
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2">
        {workflowSteps.map((step, index) => (
          <article
            key={step.command}
            className="min-h-36 bg-black p-6 transition hover:bg-[#050505]"
          >
            <div className="flex items-start justify-between gap-5">
              <div className="font-mono text-sm text-white">{step.command}</div>
              <span className="font-mono text-xs text-white/28">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
              {step.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function OsButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white text-black"
          : "text-white/52 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span className="flex items-center gap-1">{children}</span>
      {label}
    </button>
  );
}
