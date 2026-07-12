import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
} from "react";
import { isValidElement } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

function normalizeBlogHref(href: string) {
  if (!href || href.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }

  return href;
}

function BlogLink({
  href = "",
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const normalizedHref = normalizeBlogHref(href);
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

function BlogPre({
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

function BlogTable({
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto border border-white/[0.09]">
      <table className={`w-full text-left text-sm ${className}`} {...props} />
    </div>
  );
}

const paragraphClassName = "my-5 leading-7 text-white/58";
const headingBaseClassName = "scroll-mt-24 font-semibold text-white";

export const blogMdxComponents = {
  a: BlogLink,
  blockquote: ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={`my-7 border-l border-white/[0.18] pl-5 text-white/60 ${className}`}
      {...props}
    />
  ),
  h1: ({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={`mt-12 mb-5 text-4xl leading-tight ${headingBaseClassName} ${className}`}
      {...props}
    />
  ),
  h2: ({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={`mt-12 border-t border-white/[0.09] pt-10 text-2xl leading-tight ${headingBaseClassName} ${className}`}
      {...props}
    />
  ),
  h3: ({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={`mt-9 text-xl leading-snug ${headingBaseClassName} ${className}`}
      {...props}
    />
  ),
  h4: ({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={`mt-8 text-base ${headingBaseClassName} ${className}`}
      {...props}
    />
  ),
  hr: ({ className = "", ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr className={`my-10 border-white/[0.09] ${className}`} {...props} />
  ),
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
  pre: BlogPre,
  table: BlogTable,
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
  thead: ({ className = "", ...props }: HTMLAttributes<HTMLElement>) => (
    <thead className={`border-b border-white/[0.09] ${className}`} {...props} />
  ),
  ul: ({ className = "", ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`my-5 list-disc space-y-2 pl-5 marker:text-white/28 ${className}`}
      {...props}
    />
  ),
};
