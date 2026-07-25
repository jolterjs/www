import React, { cloneElement, isValidElement } from "react";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  TableHTMLAttributes,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  Database,
  Download,
  FileText,
  FolderCheck,
  FolderPlus,
  Info as InfoIcon,
  Lightbulb,
  Map,
  Pin,
  Plug,
  Rocket,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
  Workflow,
  Wrench,
  Link as LinkIcon,
} from "lucide-react";
import CopyButton from "@/components/CopyButton";
import CodeGroupTabs, {
  type CodeGroupTabItem,
} from "@/components/docs/CodeGroupTabs";

type CardGroupProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
};

type CardProps = {
  children: ReactNode;
  title: string;
  icon?: string;
  href?: string;
  inCardGroup?: boolean;
};

type CalloutProps = {
  children: ReactNode;
};

type StepProps = {
  children: ReactNode;
  title: string;
};

const iconMap = {
  "book-open": BookOpen,
  database: Database,
  download: Download,
  "folder-check": FolderCheck,
  "folder-plus": FolderPlus,
  map: Map,
  pin: Pin,
  plug: Plug,
  rocket: Rocket,
  shield: Shield,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  stethoscope: Stethoscope,
  workflow: Workflow,
  wrench: Wrench,
};

function normalizeHref(href: string) {
  if (!href || href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }

  if (
    href === "/blog" ||
    href.startsWith("/blog/") ||
    href === "/docs" ||
    href.startsWith("/docs/") ||
    href === "/"
  ) {
    return href;
  }

  if (href.startsWith("docs/")) {
    return `/${href}`;
  }

  if (href.startsWith("blog/")) {
    return `/${href}`;
  }

  if (href.startsWith("/")) {
    return `/docs${href}`;
  }

  return `/docs/${href}`;
}

function UniversalLink({
  href = "",
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const normalizedHref = normalizeHref(href);
  const external =
    normalizedHref.startsWith("http") || normalizedHref.startsWith("mailto:");
  const anchorOnly = normalizedHref.startsWith("#");
  const linkClassName = anchorOnly
    ? `text-inherit no-underline ${className}`
    : `docs-link ${className}`;

  if (!normalizedHref) {
    return (
      <a className={linkClassName} {...props}>
        {children}
      </a>
    );
  }

  if (anchorOnly) {
    return (
      <a href={normalizedHref} className={linkClassName} {...props}>
        {children}
      </a>
    );
  }

  if (external) {
    return (
      <a
        href={normalizedHref}
        className={linkClassName}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={normalizedHref} className={linkClassName} {...props}>
      {children}
    </Link>
  );
}

function ReactChildrenToArray(children: ReactNode): ReactNode[] {
  if (children === null || children === undefined) {
    return [];
  }

  if (Array.isArray(children)) {
    return children.flatMap((child) => ReactChildrenToArray(child));
  }

  if (
    isValidElement(children) &&
    children.type === React.Fragment &&
    children.props &&
    "children" in (children.props as { children?: ReactNode })
  ) {
    return ReactChildrenToArray(
      (children.props as { children?: ReactNode }).children,
    );
  }

  return [children];
}

function CardGroup({ children, cols = 2 }: CardGroupProps) {
  const gridClassName =
    cols === 1
      ? "grid-cols-1"
      : cols === 3
        ? "sm:grid-cols-2 xl:grid-cols-3"
        : cols === 4
          ? "sm:grid-cols-2 xl:grid-cols-4"
          : "sm:grid-cols-2";

  const formattedChildren = ReactChildrenToArray(children).map(
    (child, index) => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          key: child.key ?? `card-${index}`,
          inCardGroup: true,
        } as any);
      }
      return child;
    },
  );

  return (
    <div
      className={`docs-card-grid my-8 grid gap-px overflow-hidden rounded-lg border border-white/[0.09] bg-white/[0.09] ${gridClassName}`}
    >
      {formattedChildren}
    </div>
  );
}

function Card({ children, title, icon, href, inCardGroup }: CardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? FileText;
  const content = (
    <>
      <div className="flex items-start justify-between gap-5">
        <Icon className="size-5 text-white/72" />
        {href && (
          <ArrowRight className="size-4 text-white/32 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
        )}
      </div>
      <h3 className="mt-6 text-base font-semibold text-white">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-white/50">{children}</div>
    </>
  );

  const baseClasses = inCardGroup
    ? "docs-card bg-black p-5"
    : "docs-card my-6 rounded-lg border border-white/[0.09] bg-white/[0.05] p-5";

  if (!href) {
    return <div className={baseClasses}>{content}</div>;
  }

  const normalizedHref = normalizeHref(href);
  const external = normalizedHref.startsWith("http");

  const interactiveClasses = inCardGroup
    ? "docs-card group block bg-black p-5 transition hover:bg-[#050505]"
    : "docs-card group block my-6 rounded-lg border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.05]";

  if (external) {
    return (
      <a
        href={normalizedHref}
        target="_blank"
        rel="noreferrer"
        className={interactiveClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={normalizedHref} className={interactiveClasses}>
      {content}
    </Link>
  );
}

function CodeGroup({ children }: { children: ReactNode }) {
  const childItems = ReactChildrenToArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const tabItems = childItems
    .map((child, index) => createCodeGroupTab(child, index))
    .filter((item): item is CodeGroupTabItem => item !== null);

  if (tabItems.length > 1) {
    return <CodeGroupTabs items={sortCodeGroupTabs(tabItems)} />;
  }

  return <div className="my-7 space-y-4">{children}</div>;
}

function Steps({ children }: { children: ReactNode }) {
  return <div className="docs-steps my-8 space-y-0">{children}</div>;
}

function Step({ children, title }: StepProps) {
  return (
    <section className="docs-step relative border-l border-white/[0.11] pb-8 pl-7 last:pb-0">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-4 text-white/58">{children}</div>
    </section>
  );
}

function Callout({
  children,
  tone,
}: CalloutProps & { tone: "info" | "tip" | "warning" | "check" }) {
  const config = {
    check: {
      icon: CircleCheck,
      className: "border-white/[0.1] bg-[#050505]",
      accentClassName: "bg-emerald-300/70",
      iconClassName: "text-emerald-300",
    },
    info: {
      icon: InfoIcon,
      className: "border-white/[0.1] bg-[#050505]",
      accentClassName: "bg-sky-300/70",
      iconClassName: "text-sky-200",
    },
    tip: {
      icon: Lightbulb,
      className: "border-white/[0.1] bg-[#050505]",
      accentClassName: "bg-amber-300/70",
      iconClassName: "text-amber-200",
    },
    warning: {
      icon: TriangleAlert,
      className: "border-white/[0.1] bg-[#050505]",
      accentClassName: "bg-orange-300/70",
      iconClassName: "text-orange-200",
    },
  }[tone];
  const Icon = config.icon;

  return (
    <div
      className={`docs-callout relative my-7 flex overflow-hidden rounded-md border p-4 text-sm leading-6 text-white/62 ${config.className}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-px ${config.accentClassName}`}
      />
      <Icon
        className={`mt-1.25 size-4 shrink-0 ${config.iconClassName}`}
        aria-hidden="true"
      />
      <div className="ml-1 min-w-0 space-y-3">{children}</div>
    </div>
  );
}

function extractTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextFromNode(node.props.children);
  }

  return "";
}

function createCodeGroupTab(
  child: ReactNode,
  index: number,
): CodeGroupTabItem | null {
  const pre = findCodePre(child);

  if (!pre) {
    return null;
  }

  const props = pre.props as Record<string, unknown>;
  const childProps = (isValidElement(child) ? child.props : {}) as Record<
    string,
    unknown
  >;

  const rawTitle =
    (typeof childProps["data-title"] === "string"
      ? childProps["data-title"]
      : "") ||
    (typeof childProps.title === "string" ? childProps.title : "") ||
    (typeof props["data-title"] === "string" ? props["data-title"] : "") ||
    (typeof props["data-meta"] === "string" ? props["data-meta"] : "") ||
    (typeof props.title === "string" ? props.title : "");

  const language =
    typeof props["data-language"] === "string" ? props["data-language"] : "";
  const code = extractTextFromNode(props.children as ReactNode);
  const label = inferCodeGroupLabel(language, code, index, rawTitle);

  return {
    content: child,
    icon: inferCodeGroupIcon(label),
    label,
  };
}

function findCodePre(node: ReactNode): ReactElement | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findCodePre(child);

      if (match) {
        return match;
      }
    }

    return null;
  }

  if (!isValidElement<Record<string, unknown>>(node)) {
    return null;
  }

  if (typeof node.props["data-language"] === "string") {
    return node;
  }

  return findCodePre(node.props.children as ReactNode);
}

function inferCodeGroupLabel(
  language: string,
  code: string,
  index: number,
  rawTitle?: string,
) {
  if (rawTitle && rawTitle.trim()) {
    let clean = rawTitle.trim();
    const parts = clean.split(/\s+/);
    if (parts.length > 1 && parts[0].toLowerCase() === language.toLowerCase()) {
      clean = parts.slice(1).join(" ");
    }
    if (clean) return clean;
  }

  const normalizedLanguage = language.toLowerCase();
  const normalizedCode = code.toLowerCase();

  if (
    normalizedCode.includes(".cursor/") ||
    normalizedCode.includes("cursor settings") ||
    normalizedCode.includes("cursor")
  ) {
    return "Cursor";
  }

  if (
    normalizedCode.includes("claude_desktop") ||
    normalizedCode.includes("claude")
  ) {
    return "Claude";
  }

  if (
    normalizedCode.includes(".vscode/") ||
    normalizedCode.includes("roo code") ||
    normalizedCode.includes("cline") ||
    normalizedCode.includes("vscode") ||
    normalizedCode.includes("vs code")
  ) {
    return "VS Code";
  }

  if (
    normalizedCode.includes("windsurf") ||
    normalizedCode.includes("codeium")
  ) {
    return "Windsurf";
  }

  if (normalizedCode.includes("perplexity")) {
    return "Perplexity";
  }

  if (normalizedCode.includes("chatgpt") || normalizedCode.includes("openai")) {
    return "ChatGPT";
  }

  if (
    normalizedLanguage.includes("powershell") ||
    normalizedCode.includes("install.ps1") ||
    normalizedCode.includes("uninstall.ps1") ||
    normalizedCode.includes("invoke-webrequest") ||
    normalizedCode.includes("get-filehash")
  ) {
    return "Windows";
  }

  if (normalizedCode.includes("shasum -a 256")) {
    return "macOS";
  }

  if (normalizedCode.includes("sha256sum")) {
    return "Linux";
  }

  if (
    normalizedCode.includes("install.sh") ||
    normalizedCode.includes("uninstall.sh")
  ) {
    return "Linux and macOS";
  }

  if (normalizedLanguage === "bash" || normalizedLanguage === "shellscript") {
    return "Shell";
  }

  if (normalizedLanguage === "yaml" || normalizedLanguage === "yml") {
    return "YAML";
  }

  if (normalizedLanguage === "json") {
    return "JSON";
  }

  if (normalizedLanguage) {
    return (
      normalizedLanguage.charAt(0).toUpperCase() + normalizedLanguage.slice(1)
    );
  }

  return `Example ${index + 1}`;
}

function inferCodeGroupIcon(label: string): CodeGroupTabItem["icon"] {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("cursor")) {
    return "cursor";
  }

  if (normalizedLabel.includes("claude")) {
    return "claude";
  }

  if (
    normalizedLabel.includes("chatgpt") ||
    normalizedLabel.includes("openai")
  ) {
    return "chatgpt";
  }

  if (normalizedLabel.includes("perplexity")) {
    return "perplexity";
  }

  if (
    normalizedLabel.includes("vscode") ||
    normalizedLabel.includes("vs code")
  ) {
    return "vscode";
  }

  if (
    normalizedLabel.includes("windsurf") ||
    normalizedLabel.includes("codeium")
  ) {
    return "windsurf";
  }

  if (normalizedLabel.includes("github")) {
    return "github";
  }

  if (normalizedLabel.includes("windows")) {
    return "windows";
  }

  if (normalizedLabel.includes("linux") && normalizedLabel.includes("macos")) {
    return "unix";
  }

  if (normalizedLabel.includes("linux")) {
    return "linux";
  }

  if (normalizedLabel.includes("macos") || normalizedLabel.includes("apple")) {
    return "macos";
  }

  return "code";
}

function sortCodeGroupTabs(items: CodeGroupTabItem[]) {
  const hasUnixInstall =
    items.some((item) => item.label === "Linux and macOS") &&
    items.some((item) => item.label === "Windows");

  if (!hasUnixInstall) {
    return items;
  }

  const rank = {
    "Linux and macOS": 0,
    Linux: 1,
    macOS: 2,
    Windows: 3,
  } as Record<string, number>;

  return [...items].sort(
    (a, b) => (rank[a.label] ?? 10) - (rank[b.label] ?? 10),
  );
}

function UniversalPre({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const rawCode = extractTextFromNode(children).replace(/\n$/, "");
  const language =
    typeof (props as Record<string, unknown>)["data-language"] === "string"
      ? String((props as Record<string, unknown>)["data-language"])
      : "code";

  return (
    <div className="docs-code-body group relative">
      <CopyButton
        code={rawCode}
        label={`${language} code block`}
        className="docs-code-copy absolute top-2 right-2 z-10 bg-black/70 opacity-0 backdrop-blur group-hover:opacity-100 focus:opacity-100"
      />
      <pre
        className={`docs-code-pre overflow-x-auto bg-transparent px-4 py-3 pr-12 font-mono text-[13px] leading-6 ${className}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

function UniversalTable({
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-white/[0.09]">
      <table className={`w-full text-left text-sm ${className}`} {...props} />
    </div>
  );
}

const paragraphClassName = "my-5 leading-7 text-white/58";
const headingBaseClassName = "scroll-mt-24 font-semibold text-white";

export const mdxComponents = {
  a: UniversalLink,
  blockquote: ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={`my-7 border-l border-white/[0.18] pl-5 text-white/60 ${className}`}
      {...props}
    />
  ),
  Card,
  CardGroup,
  Check: (props: CalloutProps) => <Callout tone="check" {...props} />,
  CodeGroup,
  h1: ({
    className = "",
    children,
    id,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id;
    return (
      <h1
        id={headingId}
        className={`group mt-12 mb-5 text-4xl leading-tight ${headingBaseClassName} ${className}`}
        {...props}
      >
        <span className="relative inline-flex max-w-full items-center">
          {headingId ? (
            <a
              href={`#${headingId}`}
              className="text-inherit no-underline hover:text-white"
            >
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-4.5" />
              </span>
            </a>
          ) : (
            <>
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-4.5" />
              </span>
            </>
          )}
        </span>
      </h1>
    );
  },
  h2: ({
    className = "",
    children,
    id,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id;
    return (
      <h2
        id={headingId}
        className={`group mt-12 border-t border-white/[0.09] pt-10 text-2xl leading-tight ${headingBaseClassName} ${className}`}
        {...props}
      >
        <span className="relative inline-flex max-w-full items-center">
          {headingId ? (
            <a
              href={`#${headingId}`}
              className="text-inherit no-underline hover:text-white"
            >
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-4" />
              </span>
            </a>
          ) : (
            <>
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-4" />
              </span>
            </>
          )}
        </span>
      </h2>
    );
  },
  h3: ({
    className = "",
    children,
    id,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id;
    return (
      <h3
        id={headingId}
        className={`group mt-9 text-xl leading-snug ${headingBaseClassName} ${className}`}
        {...props}
      >
        <span className="relative inline-flex max-w-full items-center">
          {headingId ? (
            <a
              href={`#${headingId}`}
              className="text-inherit no-underline hover:text-white"
            >
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-3.5" />
              </span>
            </a>
          ) : (
            <>
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-3.5" />
              </span>
            </>
          )}
        </span>
      </h3>
    );
  },
  h4: ({
    className = "",
    children,
    id,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id;
    return (
      <h4
        id={headingId}
        className={`group mt-8 text-base ${headingBaseClassName} ${className}`}
        {...props}
      >
        <span className="relative inline-flex max-w-full items-center">
          {headingId ? (
            <a
              href={`#${headingId}`}
              className="text-inherit no-underline hover:text-white"
            >
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-3.5" />
              </span>
            </a>
          ) : (
            <>
              <span>{children}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-full mt-0.5 ml-2.5 translate-x-[calc(50%-20px)] -translate-y-1/2 text-white opacity-0 transition-all duration-150 ease-out group-hover:-translate-x-[calc(50%-3px)] group-hover:opacity-60"
              >
                <LinkIcon className="size-3.5" />
              </span>
            </>
          )}
        </span>
      </h4>
    );
  },
  hr: ({ className = "", ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr className={`my-10 border-white/[0.09] ${className}`} {...props} />
  ),
  Info: (props: CalloutProps) => <Callout tone="info" {...props} />,
  li: ({ className = "", ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className={`pl-1 leading-7 text-white/58 ${className}`} {...props} />
  ),
  ol: ({ className = "", ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={`my-5 list-decimal space-y-2 pl-5 marker:text-white/35 ${className}`}
      {...props}
    />
  ),
  p: ({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`${paragraphClassName} ${className}`} {...props} />
  ),
  pre: UniversalPre,
  Step,
  Steps,
  table: UniversalTable,
  tbody: ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
    <tbody className={`divide-y divide-white/[0.08] ${className}`} {...props} />
  ),
  td: ({ className = "", ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={`min-w-48 px-4 py-3 align-top text-white/55 ${className}`}
      {...props}
    />
  ),
  th: ({ className = "", ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={`bg-white/[0.035] px-4 py-3 font-semibold text-white ${className}`}
      {...props}
    />
  ),
  Tip: (props: CalloutProps) => <Callout tone="tip" {...props} />,
  thead: ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
    <thead className={`border-b border-white/[0.09] ${className}`} {...props} />
  ),
  ul: ({ className = "", ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`my-5 list-disc space-y-2 pl-5 marker:text-white/28 ${className}`}
      {...props}
    />
  ),
  Warning: (props: CalloutProps) => <Callout tone="warning" {...props} />,
};
