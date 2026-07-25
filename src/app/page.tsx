import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Braces,
  Workflow,
  CircleCheck,
  Code,
  Database,
  Download,
  ExternalLink,
  FileCode,
  LockKeyhole,
  PackageCheck,
  Plug,
  SearchCheck,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import CopyableCodePanel from "@/components/CopyableCodePanel";
import WorkflowSection from "@/components/WorkflowSection";
import { AutomationClient } from "@/components/AutomationClient";
import {
  highlightCode,
  type HighlightedSnippet,
  type HighlightLanguage,
} from "@/lib/highlight";
import GitHubIcon from "@/icons/github";

const GitHubIconForDocsMap = (className: string) => {
  return <GitHubIcon className={`${className} opacity-70 invert`} />;
};

type OsChoice = "unix" | "windows";
type IconComponent = ComponentType<{ className?: string }>;

// const JolterPlugin = ({ className = "" }: { className?: string }) => (
//   <img src="/jnbg.png" className={`size-4 ${className}`} alt="Jolter plugin" />
// );

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

const ecosystem: Array<{
  icon: IconComponent;
  title: string;
  body: string;
  command: string;
  language: HighlightLanguage;
}> = [
  {
    icon: Code,
    title: "@jolter/jdt",
    body: "Initialize, run, build, validate, and pack WebAssembly plugin providers.",
    command: "npx @jolter/jdt init\nnpx @jolter/jdt pack --version 0.1.0",
    language: "shellscript",
  },
  {
    icon: Plug,
    title: "Registry-backed tools",
    body: "Install a provider, then use plugin commands like any other managed tool.",
    command: "jolter plugin install eslint\njolter use eslint@8",
    language: "shellscript",
  },
  {
    icon: Workflow,
    title: "Release registration",
    body: "GitHub releases stay the artifact source while the registry stores metadata and URLs.",
    command: "uses: jolterjs/register-release-action@v1",
    language: "yaml",
  },
];

const docsMap = [
  {
    icon: Download,
    title: "Quickstart",
    body: "Install Jolter, enable shims, pin a project, and verify the result.",
    href: "/docs/quickstart",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    body: "Read the mental model, commands, CI guides, troubleshooting, and security model.",
    href: "/docs",
  },
  {
    icon: Plug,
    title: "Plugin registry",
    body: "Discover plugins, inspect repositories, manage owners, and request aliases.",
    href: "https://plugins.jolter.dev",
  },
  {
    icon: GitHubIconForDocsMap,
    title: "GitHub",
    body: "Follow the project, release work, and project roadmap.",
    href: "https://github.com/jolterjs/jolter",
  },
];

const toolchainLogos = [
  { name: "Node.js", logo: "/nodejs.svg" },
  { name: "Bun", logo: "/bun.svg" },
  { name: "Deno", logo: "/deno.png" },
  { name: "npm", logo: "/npm.png" },
  { name: "pnpm", logo: "/pnpm.png" },
  { name: "Yarn", logo: "/yarn.svg" },
  { name: "Plugin tools", logo: "/jnbg.png" },
];

const projectDeclarationCode = [
  "{",
  '  "$schema": "https://schemas.jolter.dev/project/v2/schema.json",',
  '  "schemaVersion": 2,',
  '  "runtime": { "node": "24" },',
  '  "tools": { "pnpm": "10" },',
  '  "plugins": { "@eslint/eslint": "1" }',
  "}",
].join("\n");

const shimResolutionCode = [
  "$ node --version",
  "resolve current project upward",
  "select complete local installation",
  "fall back to global active version",
  "launch selected node executable",
].join("\n");

const automationCode = [
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
].join("\n");

const healthCode = [
  "jolter list --json",
  "jolter doctor --json --no-color > jolter-doctor.json",
  "jolter cache status",
].join("\n");

const pageRailClass = "mx-auto max-w-7xl px-5 sm:px-8";
const framedGridClass =
  "grid rounded-xl overflow-hidden gap-px border border-white/[0.09] bg-white/[0.09]";

export default async function Home() {
  const [
    projectSnippet,
    shimSnippet,
    installUnixSnippet,
    installWindowsSnippet,
    automationSnippet,
    healthSnippet,
    ...ecosystemSnippets
  ] = await Promise.all([
    highlightCode(projectDeclarationCode, "json"),
    highlightCode(shimResolutionCode, "shellscript"),
    highlightCode(installCommands.unix.join("\n"), "shellscript"),
    highlightCode(installCommands.windows.join("\n"), "shellscript"),
    highlightCode(automationCode, "yaml"),
    highlightCode(healthCode, "shellscript"),
    ...ecosystem.map((item) => highlightCode(item.command, item.language)),
  ]);

  return (
    <main className="bg-black text-white">
      <Hero />
      <ToolchainStrip />
      <SupportedToolchains />
      <Mechanics projectSnippet={projectSnippet} shimSnippet={shimSnippet} />
      <GridSection id="workflow">
        <WorkflowSection
          installSnippets={{
            unix: installUnixSnippet,
            windows: installWindowsSnippet,
          }}
          workflowSteps={workflowSteps}
        />
      </GridSection>
      <GridSection>
        <AutomationClient automationSnippet={automationSnippet} />
      </GridSection>
      <DiagnosticsAndSecurity healthSnippet={healthSnippet} />
      <PluginEcosystem snippets={ecosystemSnippets} />
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
      <div
        className={`${pageRailClass} relative flex min-h-screen flex-col items-center justify-center pt-28 pb-20 text-center`}
      >
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
          <PrimaryLink href="/docs/quickstart">Get Started</PrimaryLink>
        </div>

        <a
          href="/docs/installation"
          className="mt-7 inline-flex max-w-full items-center gap-2 overflow-x-auto px-3 py-2 font-mono text-sm text-white/45 transition hover:text-white/70"
        >
          <span className="text-white/28">$</span>
          curl -fsSL https://get.jolter.dev/install.sh | sh
        </a>
      </div>
    </section>
  );
}

function ToolchainStrip() {
  const marqueeItems = [
    ...toolchainLogos,
    ...toolchainLogos,
    ...toolchainLogos,
    ...toolchainLogos,
  ];

  return (
    <section className="border-b border-white/[0.08]">
      <div className={`${pageRailClass} flex flex-col gap-8 py-12`}>
        <p className="text-center text-xs font-medium tracking-normal text-white/35 uppercase">
          Built for the runtime and package-manager drift that breaks builds
        </p>

        <div className="marquee-container relative w-full overflow-hidden before:pointer-events-none before:absolute before:top-0 before:bottom-0 before:left-0 before:z-10 before:w-16 before:bg-gradient-to-r before:from-black before:to-transparent after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0 after:z-10 after:w-16 after:bg-gradient-to-l after:from-black after:to-transparent sm:before:w-28 sm:after:w-28">
          <div className="animate-marquee-left flex w-max flex-row items-center gap-10 sm:gap-16">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="group flex shrink-0 cursor-default flex-row items-center justify-center gap-2.5 font-mono text-sm font-semibold text-white/62 transition duration-300 hover:text-white"
              >
                {item.logo && (
                  <img
                    src={item.logo}
                    className={`${item.name !== "Plugin tools" ? "size-8" : "size-6.5"} opacity-50 grayscale transition duration-300 select-none group-hover:opacity-100 group-hover:grayscale-0`}
                    draggable={false}
                    alt=""
                  />
                )}
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportedToolchains() {
  return (
    <GridSection id="features">
      <FramedGridBlock
        gridClassName="md:grid-cols-2 xl:grid-cols-3"
        intro={
          <SectionHeading
            eyebrow="What's in Jolter?"
            title="Everything needed to keep JavaScript toolchains aligned."
            body="Jolter keeps the core surface small: runtimes, package-manager tools, project discovery, shims, and the platform setup required to make them reliable."
          />
        }
      >
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
                  className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </InfoCard>
        ))}
      </FramedGridBlock>
    </GridSection>
  );
}

function Mechanics({
  projectSnippet,
  shimSnippet,
}: {
  projectSnippet: HighlightedSnippet;
  shimSnippet: HighlightedSnippet;
}) {
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
          <CopyableCodePanel
            title="jolter.json"
            code={projectSnippet.code}
            highlightedHtml={projectSnippet.highlightedHtml}
          />
          <CopyableCodePanel
            title="shim resolution"
            code={shimSnippet.code}
            highlightedHtml={shimSnippet.highlightedHtml}
            withCommandIcon
          />
        </div>
      </div>
    </GridSection>
  );
}

function DiagnosticsAndSecurity({
  healthSnippet,
}: {
  healthSnippet: HighlightedSnippet;
}) {
  return (
    <GridSection>
      <div className="grid gap-12 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div>
          <SectionHeading
            eyebrow="Diagnostics and security"
            title="Know what will run before it runs."
            body="Jolter treats provider metadata, downloads, archives, project files, and writable storage as inputs to verify, not as trusted state."
          />
          <CopyableCodePanel
            title="health evidence"
            code={healthSnippet.code}
            highlightedHtml={healthSnippet.highlightedHtml}
            className="mt-9"
          />
        </div>
        <div className={`${framedGridClass} sm:grid-cols-2`}>
          {securityChecks.map((check) => (
            <div key={check} className="flex min-h-24 gap-3 bg-black p-5">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-white" />
              <p className="text-sm leading-6 text-white/58">{check}</p>
            </div>
          ))}
          <div className="bg-black p-6 sm:col-span-2">
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

function PluginEcosystem({ snippets }: { snippets: HighlightedSnippet[] }) {
  return (
    <GridSection id="plugins">
      <FramedGridBlock
        gridClassName="lg:grid-cols-3"
        intro={
          <SectionHeading
            eyebrow="Plugin ecosystem"
            title="Extend the core with verified WebAssembly providers."
            body="Jolter plugins resolve executable tools that are not built into the CLI. The registry handles identity, ownership, aliases, permissions, versions, and GitHub release metadata."
          />
        }
      >
        {ecosystem.map((item, index) => (
          <InfoCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            body={item.body}
          >
            <HighlightedCodeBlock snippet={snippets[index]} className="mt-7" />
          </InfoCard>
        ))}
      </FramedGridBlock>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <LinkPanel
          icon={BadgeCheck}
          title="Registry API and web UI"
          body="plugins.jolter.dev is the public discovery and management interface. registry.jolter.dev is the API origin used by Jolter and release automation."
          href="https://plugins.jolter.dev"
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
    <section>
      <div className={`${pageRailClass} py-24`}>
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white/58">
            <LockKeyhole className="size-4" />
            Project declarations belong in source control.
          </div>
          <h2 className="mt-8 text-4xl leading-tight font-semibold text-balance sm:text-6xl">
            Start with the core CLI. Add plugins when a project needs more.
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryLink href="/docs/quickstart">Quickstart</PrimaryLink>
            <SecondaryLink href="https://github.com/jolterjs/jolter">
              <GitHubIcon className="mr-1.5 size-4 invert" />
              GitHub
            </SecondaryLink>
          </div>
        </div>

        <div
          className={`${framedGridClass} mt-16 md:grid-cols-2 xl:grid-cols-4`}
        >
          {docsMap.map((item) => (
            // @ts-ignore
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
      <div className="absolute inset-x-0 top-24 bottom-16">
        <div className={`${pageRailClass} relative h-full`}>
          <div className="relative h-full border-x border-white/[0.08]">
            {/* 4 Main Frame Corner Nodes */}
            <div className="absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.22] bg-black" />
            <div className="absolute top-0 right-0 size-2 translate-x-1/2 -translate-y-1/2 border border-white/[0.22] bg-black" />
            <div className="absolute bottom-0 left-0 size-2 -translate-x-1/2 translate-y-1/2 border border-white/[0.22] bg-black" />
            <div className="absolute right-0 bottom-0 size-2 translate-x-1/2 translate-y-1/2 border border-white/[0.22] bg-black" />

            {/* Inner Vertical Sub-Rails */}
            <div className="absolute top-0 bottom-0 left-12 w-px bg-white/[0.05] sm:left-24 lg:left-36" />
            <div className="absolute top-0 right-12 bottom-0 w-px bg-white/[0.05] sm:right-24 lg:right-36" />

            {/* Left Side Extension Lines & Nodes (shooting outward) */}
            <div className="absolute top-[28%] left-0 h-px w-16 -translate-x-full bg-white/[0.08] sm:w-28 md:w-36">
              <div className="absolute top-1/2 left-0 size-2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.2] bg-black" />
            </div>
            <div className="absolute bottom-[28%] left-0 h-px w-20 -translate-x-full bg-white/[0.08] sm:w-32 md:w-44">
              <div className="absolute top-1/2 left-0 size-2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.2] bg-black" />
            </div>

            {/* Right Side Extension Lines & Nodes (shooting outward) */}
            <div className="absolute top-[28%] right-0 h-px w-16 translate-x-full bg-white/[0.08] sm:w-28 md:w-36">
              <div className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 border border-white/[0.2] bg-black" />
            </div>
            <div className="absolute right-0 bottom-[28%] h-px w-20 translate-x-full bg-white/[0.08] sm:w-32 md:w-44">
              <div className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 border border-white/[0.2] bg-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-24">
        <div className={pageRailClass}>
          <div className="border-t border-white/[0.07]" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-16">
        <div className={pageRailClass}>
          <div className="border-b border-white/[0.07]" />
        </div>
      </div>

      <div className="absolute top-24 left-1/2 h-28 w-px -translate-x-1/2 bg-white/[0.09]" />
      <div className="absolute bottom-16 left-1/2 h-28 w-px -translate-x-1/2 bg-white/[0.09]" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_20%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_80%,transparent)]" />
    </div>
  );
}

function GridSection({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className={`${pageRailClass} py-24`}>{children}</div>
    </section>
  );
}

function FramedGridBlock({
  intro,
  gridClassName,
  children,
}: {
  intro: ReactNode;
  gridClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.09]">
      <div className="bg-black p-7 sm:p-8 lg:p-10">{intro}</div>
      <div
        className={`grid gap-px border-t border-white/[0.09] bg-white/[0.09] ${gridClassName}`}
      >
        {children}
      </div>
    </div>
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

function InfoCard({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: IconComponent;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <article className="min-h-72 bg-black p-7 transition hover:bg-[#050505]">
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
      className="group rounded-xl border border-white/[0.09] p-6 transition hover:bg-white/[0.025]"
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
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group min-h-56 bg-black p-6 transition hover:bg-[#050505]"
    >
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-white/70" />
        {external ? (
          <ExternalLink className="size-4 text-white/32 transition group-hover:text-white/70" />
        ) : (
          <ArrowRight className="size-4 text-white/32 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
        )}
      </div>
      <h3 className="mt-8 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
    </a>
  );
}

function HighlightedCodeBlock({
  snippet,
  className = "",
}: {
  snippet: HighlightedSnippet;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.03] ${className}`}
    >
      <div
        className="overflow-x-auto p-4 text-sm leading-6 text-white/68 [&_.shiki]:!m-0 [&_.shiki]:!bg-transparent [&_.shiki]:!p-0 [&_.shiki]:font-mono [&_.shiki]:text-sm [&_.shiki]:leading-6 [&_.shiki]:whitespace-pre-wrap [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: snippet.highlightedHtml }}
      />
    </div>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
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
  children: ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex h-11 items-center justify-center rounded-lg border border-white/[0.16] bg-black px-5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.04]"
    >
      {children}
    </a>
  );
}
