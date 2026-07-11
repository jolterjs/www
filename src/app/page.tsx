"use client";

import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Braces,
  CircleCheck,
  Code,
  Command,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileCode,
  GitBranch,
  LockKeyhole,
  PackageCheck,
  Plug,
  SearchCheck,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import AppleIcon from "@/icons/apple";
import LinuxIcon from "@/icons/linux";
import WindowsIcon from "@/icons/windows";

type OsChoice = "unix" | "windows";
type IconComponent = React.ComponentType<{ className?: string }>;

const installCommands: Record<OsChoice, string[]> = {
  unix: [
    "curl -fsSL https://get.jolter.dev/install.sh | sh",
    "jolter setup",
    "jolter use node@lts",
    "jolter use pnpm@10",
    "jolter doctor",
  ],
  windows: [
    "irm https://get.jolter.dev/install.ps1 | iex",
    "jolter setup",
    "jolter use node@lts",
    "jolter use pnpm@10",
    "jolter doctor",
  ],
};

const supported = [
  {
    icon: Zap,
    title: "Runtimes",
    body: "Node.js, Bun, and Deno selectors for local projects and automation.",
    tags: ["node@24", "bun@1", "deno@2"],
  },
  {
    icon: PackageCheck,
    title: "Built-in tools",
    body: "npm, pnpm, and Yarn install through the selected Node.js runtime.",
    tags: ["npm", "pnpm", "yarn"],
  },
  {
    icon: Plug,
    title: "Plugin tools",
    body: "Registry-backed providers add more commands without bloating the core CLI.",
    tags: ["eslint", "jdt", "custom CLIs"],
  },
  {
    icon: Server,
    title: "Platforms",
    body: "Release targets cover Windows x64, Linux x64, macOS x64, macOS ARM64, and WSL.",
    tags: ["Windows", "Linux", "macOS", "WSL"],
  },
  {
    icon: Terminal,
    title: "Shells",
    body: "Setup guidance is generated for PowerShell, Command Prompt, Bash, Zsh, and Fish.",
    tags: ["pwsh", "cmd", "bash", "zsh", "fish"],
  },
  {
    icon: Braces,
    title: "Project sources",
    body: "Jolter understands its own project file plus common Node compatibility files.",
    tags: ["jolter.json", ".node-version", ".nvmrc"],
  },
];

const mechanics = [
  {
    icon: FileCode,
    title: "Project declaration",
    body: "Commit the runtime, tools, and plugin providers a repository expects.",
  },
  {
    icon: Database,
    title: "Managed storage",
    body: "Keep runtimes, tools, plugins, shims, cache, manifests, and active fallbacks in JOLTER_HOME.",
  },
  {
    icon: Terminal,
    title: "Invocation shims",
    body: "Resolve the current directory every time node, pnpm, yarn, bun, deno, or a plugin command runs.",
  },
];

const workflowSteps = [
  {
    command: "jolter setup",
    text: "Create or refresh shims and print the exact PATH change for the current shell.",
  },
  {
    command: "jolter use node@lts",
    text: "Install a global fallback for work outside configured projects.",
  },
  {
    command: "jolter pin node@24",
    text: "Record the project runtime without installing during command dispatch.",
  },
  {
    command: "jolter pin pnpm@10",
    text: "Pin a built-in tool while preserving the runtime and other tools.",
  },
  {
    command: "jolter sync",
    text: "Resolve, verify, install or reuse, activate, and refresh shims for the project.",
  },
  {
    command: "jolter doctor",
    text: "Check storage, project resolution, PATH, cache, proxies, permissions, and installed versions.",
  },
];

const securityChecks = [
  "HTTPS-only metadata and artifact URLs",
  "SHA-256 and registry SRI verification",
  "Bounded archive extraction with path validation",
  "Atomic publication after manifests and payload checks",
  "No downloaded runtime executed during installation",
  "No usage telemetry collected",
];

const ecosystem = [
  {
    icon: Code,
    title: "@jolter/jdt",
    body: "Initialize, run, build, validate, and pack WebAssembly plugin providers.",
    command: "npx jdt init\nnpx jdt pack --version 0.1.0",
  },
  {
    icon: Plug,
    title: "Registry-backed tools",
    body: "Install a provider, then use plugin commands like any other managed tool.",
    command: "jolter plugin install eslint\njolter use eslint@8",
  },
  {
    icon: Workflow,
    title: "Release registration",
    body: "GitHub releases stay the artifact source while the registry stores metadata and URLs.",
    command: "uses: jolterjs/register-release-action@v1",
  },
];

const docsMap = [
  {
    icon: Download,
    title: "Quickstart",
    body: "Install Jolter, enable shims, pin a project, and verify the result.",
    href: "https://docs.jolter.dev/quickstart",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    body: "Read the mental model, commands, CI guides, troubleshooting, and security model.",
    href: "https://docs.jolter.dev",
  },
  {
    icon: Plug,
    title: "Plugin registry",
    body: "Discover plugins, inspect repositories, manage owners, and request aliases.",
    href: "https://plugins.jolter.dev",
  },
  {
    icon: GitBranch,
    title: "GitHub",
    body: "Follow the Rust CLI, release work, and project roadmap.",
    href: "https://github.com/jolterjs/jolter",
  },
];

const toolchainLogos = [
  "Node.js",
  "Bun",
  "Deno",
  "npm",
  "pnpm",
  "Yarn",
  "Plugin tools",
];

export default function Home() {
  const [osSelected, setOsSelected] = React.useState<OsChoice>("unix");

  return (
    <main className="bg-black text-white">
      <Hero />
      <ToolchainStrip />
      <SupportedToolchains />
      <Mechanics />
      <WorkflowSection osSelected={osSelected} setOsSelected={setOsSelected} />
      <Automation />
      <DiagnosticsAndSecurity />
      <PluginEcosystem />
      <FinalCta />
    </main>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-white/[0.08]"
    >
      <HeroGrid />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 pt-28 pb-20 text-center sm:px-8 lg:px-10">
        <div className="relative w-full max-w-6xl border-y border-white/[0.1] py-10 sm:py-12 lg:py-14">
          <div className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-white/55" />
          <div className="absolute top-0 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 bg-white/55" />
          <div className="absolute bottom-0 left-0 size-1.5 -translate-x-1/2 translate-y-1/2 bg-white/55" />
          <div className="absolute right-0 bottom-0 size-1.5 translate-x-1/2 translate-y-1/2 bg-white/55" />
          <h1 className="mx-auto max-w-6xl text-5xl leading-[1.02] font-semibold tracking-normal text-balance sm:text-7xl lg:text-8xl">
            The toolchain manager for JavaScript projects
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/55 sm:text-xl">
            Keep{" "}
            <span className="text-white">
              Node.js, Bun, Deno, npm, pnpm, Yarn, and plugin-provided tools
            </span>{" "}
            consistent across laptops, teams, and CI with a native Rust CLI,
            project-aware shims, and verified installs.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryLink href="https://docs.jolter.dev/quickstart">
            Get Started
          </PrimaryLink>
        </div>

        <a
          href="https://docs.jolter.dev/installation"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-md px-3 py-2 font-mono text-sm text-white/45 transition hover:text-white/70"
        >
          <span className="text-white/28">$</span>
          curl -fsSL https://get.jolter.dev/install.sh | sh
        </a>
      </div>
    </section>
  );
}

function ToolchainStrip() {
  return (
    <section className="border-b border-white/[0.08]">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-12 sm:px-8 lg:px-10">
        <p className="text-center text-xs font-medium tracking-normal text-white/35 uppercase">
          Built for the runtime and package-manager drift that breaks builds
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-center sm:grid-cols-4 lg:grid-cols-7">
          {toolchainLogos.map((item) => (
            <div
              key={item}
              className="font-mono text-sm font-semibold text-white/62"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportedToolchains() {
  return (
    <GridSection id="features">
      <SectionHeading
        eyebrow="What's in Jolter?"
        title="Everything needed to keep JavaScript toolchains aligned."
        body="Jolter keeps the core surface small: runtimes, package-manager tools, project discovery, shims, and the platform setup required to make them reliable."
      />
      <div className="mt-14 grid border-t border-l border-white/[0.09] md:grid-cols-2 xl:grid-cols-3">
        {supported.map((item) => (
          <InfoCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            body={item.body}
          >
            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </InfoCard>
        ))}
      </div>
    </GridSection>
  );
}

function Mechanics() {
  return (
    <GridSection>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="How Jolter works"
            title="Explicit preparation. Fast command dispatch."
            body="A project declares requirements, Jolter prepares verified local installations, and shims choose the matching executable whenever a command runs."
          />
          <div className="mt-10 space-y-3">
            {mechanics.map((item, index) => (
              <ProcessRow
                key={item.title}
                index={index + 1}
                icon={item.icon}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <CodePanel
            title="jolter.json"
            lines={[
              "{",
              '  "$schema": "https://schemas.jolter.dev/project/v2/schema.json",',
              '  "schemaVersion": 2,',
              '  "runtime": { "node": "24" },',
              '  "tools": { "pnpm": "10" },',
              '  "plugins": { "@eslint/eslint": "1" }',
              "}",
            ]}
          />
          <TerminalWindow
            title="shim resolution"
            lines={[
              "$ node --version",
              "resolve current project upward",
              "select complete local installation",
              "fall back to global active version",
              "launch selected node executable",
            ]}
          />
        </div>
      </div>
    </GridSection>
  );
}

function WorkflowSection({
  osSelected,
  setOsSelected,
}: {
  osSelected: OsChoice;
  setOsSelected: React.Dispatch<React.SetStateAction<OsChoice>>;
}) {
  return (
    <GridSection id="workflow">
      <div className="grid gap-12 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div>
          <SectionHeading
            eyebrow="Install and pin"
            title="One workflow for laptops, monorepos, and CI."
            body="Use global versions as fallbacks, then pin project requirements so every contributor and automation job resolves the same toolchain."
          />
          <div className="mt-9 rounded-md border border-white/[0.12] bg-[#050505] p-1">
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
          <CodePanel
            title="first run"
            lines={installCommands[osSelected]}
            className="mt-4"
          />
        </div>
        <div className="grid border-t border-l border-white/[0.09] sm:grid-cols-2">
          {workflowSteps.map((step) => (
            <article
              key={step.command}
              className="min-h-40 border-r border-b border-white/[0.09] p-6"
            >
              <div className="font-mono text-sm text-white">{step.command}</div>
              <p className="mt-4 text-sm leading-6 text-white/50">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </GridSection>
  );
}

function Automation() {
  return (
    <GridSection>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Automation"
            title="CI runs the same resolver as your shell."
            body="`jolter setup-ci` synchronizes the project, refreshes shims, detects the provider, and emits exact runtime, tool, plugin, cache, and shim paths for later steps."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <MiniPanel
              icon={Workflow}
              title="Stable logs"
              body="CI and redirected output use deterministic lines instead of in-place progress."
            />
            <MiniPanel
              icon={Braces}
              title="JSON mode"
              body="Automation can consume documented machine-readable fields."
            />
            <MiniPanel
              icon={GitBranch}
              title="GitHub outputs"
              body="GitHub Actions receives PATH updates and step outputs when files are present."
            />
          </div>
        </div>
        <CodePanel
          title=".github/workflows/test.yml"
          lines={[
            "- name: Install and synchronize Jolter",
            "  env:",
            "    JOLTER_HOME: ${{ runner.temp }}/jolter-home",
            "  run: |",
            "    curl -fsSL https://get.jolter.dev/install.sh | sh",
            "    jolter setup-ci --no-progress",
            "",
            "- run: |",
            "    node --version",
            "    pnpm --version",
            "    pnpm test",
          ]}
        />
      </div>
    </GridSection>
  );
}

function DiagnosticsAndSecurity() {
  return (
    <GridSection>
      <div className="grid gap-12 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div>
          <SectionHeading
            eyebrow="Diagnostics and security"
            title="Know what will run before it runs."
            body="Jolter treats provider metadata, downloads, archives, project files, and writable storage as inputs to verify, not as trusted state."
          />
          <CodePanel
            title="health evidence"
            lines={[
              "jolter list --json",
              "jolter doctor --json --no-color > jolter-doctor.json",
              "jolter cache status",
            ]}
            className="mt-9"
          />
        </div>
        <div className="grid border-t border-l border-white/[0.09] sm:grid-cols-2">
          {securityChecks.map((check) => (
            <div
              key={check}
              className="flex min-h-24 gap-3 border-r border-b border-white/[0.09] p-5"
            >
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-white" />
              <p className="text-sm leading-6 text-white/58">{check}</p>
            </div>
          ))}
          <div className="border-r border-b border-white/[0.09] p-6 sm:col-span-2">
            <div className="flex items-center gap-3 text-white">
              <SearchCheck className="size-5" />
              <h3 className="font-semibold">
                Doctor checks the operating surface
              </h3>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/52">
              Storage, platform support, project configuration, shims, PATH
              precedence, incomplete installs, proxy variables, certificate
              configuration, offline cache readiness, and plugin state are
              reported together.
            </p>
          </div>
        </div>
      </div>
    </GridSection>
  );
}

function PluginEcosystem() {
  return (
    <GridSection id="plugins">
      <SectionHeading
        eyebrow="Plugin ecosystem"
        title="Extend the core with verified WebAssembly providers."
        body="Jolter plugins resolve executable tools that are not built into the CLI. The registry handles identity, ownership, aliases, permissions, versions, and GitHub release metadata."
      />
      <div className="mt-14 grid border-t border-l border-white/[0.09] lg:grid-cols-3">
        {ecosystem.map((item) => (
          <InfoCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            body={item.body}
          >
            <pre className="mt-7 overflow-x-auto rounded-md border border-white/[0.1] bg-white/[0.03] p-4 text-sm leading-6 text-white/68">
              <code>{item.command}</code>
            </pre>
          </InfoCard>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <LinkPanel
          icon={BadgeCheck}
          title="Registry API and web UI"
          body="plugins.jolter.dev is the public discovery and management interface. registry.jolter.dev is the API origin used by Jolter and release automation."
          href="https://registry.jolter.dev"
        />
        <LinkPanel
          icon={ShieldCheck}
          title="Publisher release flow"
          body="The register-release action posts a GitHub release tag to the registry and treats existing versions as a safe rerun."
          href="https://github.com/jolterjs/register-release-action"
        />
      </div>
    </GridSection>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-y-0 left-5 hidden w-px bg-white/[0.08] sm:left-8 lg:left-10 lg:block" />
        <div className="absolute inset-y-0 right-5 hidden w-px bg-white/[0.08] sm:right-8 lg:right-10 lg:block" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex h-9 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white/58">
            <LockKeyhole className="size-4" />
            Project declarations belong in source control.
          </div>
          <h2 className="mt-8 text-4xl leading-tight font-semibold text-balance sm:text-6xl">
            Start with the core CLI. Add plugins when a project needs more.
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryLink href="https://docs.jolter.dev/quickstart">
              Quickstart
            </PrimaryLink>
            <SecondaryLink href="https://github.com/jolterjs/jolter">
              GitHub
            </SecondaryLink>
          </div>
        </div>

        <div className="mt-16 grid border-t border-l border-white/[0.09] md:grid-cols-2 xl:grid-cols-4">
          {docsMap.map((item) => (
            <DocLink key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-5 top-24 bottom-16 mx-auto max-w-7xl border-x border-white/[0.08] sm:inset-x-8 lg:inset-x-10" />
      <div className="absolute inset-x-5 top-24 mx-auto max-w-7xl border-t border-white/[0.07] sm:inset-x-8 lg:inset-x-10" />
      <div className="absolute inset-x-5 bottom-16 mx-auto max-w-7xl border-b border-white/[0.07] sm:inset-x-8 lg:inset-x-10" />
      <div className="absolute top-24 bottom-16 left-[18%] hidden w-px bg-white/[0.07] xl:block" />
      <div className="absolute top-24 right-[18%] bottom-16 hidden w-px bg-white/[0.07] xl:block" />
      <div className="absolute top-24 left-1/2 h-28 w-px bg-white/[0.09]" />
      <div className="absolute bottom-16 left-1/2 h-28 w-px bg-white/[0.09]" />
      <div className="absolute top-[28%] left-[12%] hidden h-px w-28 bg-white/[0.08] md:block" />
      <div className="absolute top-[28%] right-[12%] hidden h-px w-28 bg-white/[0.08] md:block" />
      <div className="absolute bottom-[25%] left-[12%] hidden h-px w-36 bg-white/[0.08] md:block" />
      <div className="absolute right-[12%] bottom-[25%] hidden h-px w-36 bg-white/[0.08] md:block" />
      <div className="absolute top-[28%] left-[12%] hidden size-2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.18] bg-black md:block" />
      <div className="absolute top-[28%] right-[12%] hidden size-2 translate-x-1/2 -translate-y-1/2 border border-white/[0.18] bg-black md:block" />
      <div className="absolute bottom-[25%] left-[12%] hidden size-2 -translate-x-1/2 translate-y-1/2 border border-white/[0.18] bg-black md:block" />
      <div className="absolute right-[12%] bottom-[25%] hidden size-2 translate-x-1/2 translate-y-1/2 border border-white/[0.18] bg-black md:block" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_18%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_82%,transparent)]" />
    </div>
  );
}

function GridSection({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-y-0 left-5 hidden w-px bg-white/[0.08] sm:left-8 lg:left-10 lg:block" />
        <div className="absolute inset-y-0 right-5 hidden w-px bg-white/[0.08] sm:right-8 lg:right-10 lg:block" />
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs font-semibold tracking-normal text-white/38 uppercase">
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

function InfoCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: IconComponent;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="min-h-72 border-r border-b border-white/[0.09] p-7 transition hover:bg-white/[0.025]">
      <Icon className="size-5 text-white/76" />
      <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/52">{body}</p>
      {children}
    </article>
  );
}

function ProcessRow({
  icon: Icon,
  index,
  title,
  body,
}: {
  icon: IconComponent;
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-t border-white/[0.09] py-5">
      <div className="flex size-10 items-center justify-center border border-white/[0.12] font-mono text-xs text-white/48">
        {String(index).padStart(2, "0")}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <Icon className="size-4 text-white/58" />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/48">{body}</p>
      </div>
    </div>
  );
}

function MiniPanel({
  icon: Icon,
  title,
  body,
}: {
  icon: IconComponent;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-white/[0.09] p-5">
      <Icon className="size-4 text-white/72" />
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
    </div>
  );
}

function LinkPanel({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: IconComponent;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group border border-white/[0.09] p-6 transition hover:bg-white/[0.025]"
    >
      <div className="flex items-start justify-between gap-5">
        <Icon className="size-5 text-white/72" />
        <ExternalLink className="size-4 text-white/35 transition group-hover:text-white/70" />
      </div>
      <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/52">{body}</p>
    </a>
  );
}

function DocLink({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: IconComponent;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group min-h-56 border-r border-b border-white/[0.09] p-6 transition hover:bg-white/[0.025]"
    >
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-white/70" />
        <ExternalLink className="size-4 text-white/32 transition group-hover:text-white/70" />
      </div>
      <h3 className="mt-8 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
    </a>
  );
}

function TerminalWindow({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-white/[0.11] bg-[#050505]">
      <div className="flex h-11 items-center justify-between border-b border-white/[0.09] px-4">
        <div className="flex items-center gap-2">
          <Command className="size-3.5 text-white/40" />
          <span className="font-mono text-xs text-white/38">{title}</span>
        </div>
        <Copy className="size-3.5 text-white/28" />
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-white/66">
        <code>{lines.join("\n")}</code>
      </pre>
    </div>
  );
}

function CodePanel({
  title,
  lines,
  className = "",
}: {
  title: string;
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-white/[0.11] bg-[#050505] ${className}`}
    >
      <div className="flex h-11 items-center justify-between border-b border-white/[0.09] px-4">
        <span className="font-mono text-xs text-white/38">{title}</span>
        <Copy className="size-3.5 text-white/28" />
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 break-words whitespace-pre-wrap text-white/66">
        <code>{lines.join("\n")}</code>
      </pre>
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
      className={`flex min-h-10 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
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

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
    >
      {children}
      <ArrowRight className="size-4" />
    </a>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className="inline-flex h-11 items-center justify-center rounded-md border border-white/[0.16] bg-black px-5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.04]"
    >
      {children}
    </a>
  );
}
