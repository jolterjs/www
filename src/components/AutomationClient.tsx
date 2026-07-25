"use client";

import type { ReactNode } from "react";
import { Workflow, Braces } from "lucide-react";
import GitHubIcon from "@/icons/github";
import type { HighlightedSnippet } from "@/lib/highlight";
import CopyableCodePanel from "./CopyableCodePanel";

function MiniPanel({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.09] p-5">
      {icon}
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string | ReactNode;
  body: string | ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs font-semibold tracking-normal text-white/38">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-white/52 sm:text-lg">
        {body}
      </p>
    </div>
  );
}

export function AutomationClient({
  automationSnippet,
}: {
  automationSnippet: HighlightedSnippet;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
      <div>
        <SectionHeading
          eyebrow="Automation"
          title="CI runs the same resolver as your shell."
          body={
            <>
              <span className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/50">
                jolter setup-ci
              </span>{" "}
              synchronizes the project, refreshes shims, detects the provider,
              and emits exact runtime, tool, plugin, cache, and shim paths for
              later steps.
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <MiniPanel
            icon={<Workflow className="size-4 text-white/72" />}
            title="Stable logs"
            body="CI and redirected output use deterministic lines instead of in-place progress."
          />
          <MiniPanel
            icon={<Braces className="size-4 text-white/72" />}
            title="JSON mode"
            body="Automation can consume documented machine-readable fields."
          />
          <MiniPanel
            icon={<GitHubIcon className="size-4 opacity-72 invert" />}
            title="GitHub outputs"
            body="GitHub Actions receives PATH updates and step outputs when files are present."
          />
        </div>
      </div>
      <CopyableCodePanel
        title=".github/workflows/test.yml"
        code={automationSnippet.code}
        highlightedHtml={automationSnippet.highlightedHtml}
      />
    </div>
  );
}
