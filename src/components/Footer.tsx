import Link from "next/link";
import { ExternalLink } from "lucide-react";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Plugins", href: "/#plugins" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Commands", href: "/docs/reference/commands" },
      { label: "Security model", href: "/docs/security/model" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Plugin registry", href: "https://plugins.jolter.dev" },
      { label: "Build a plugin", href: "/docs/plugins/build-a-plugin" },
      { label: "Plugin API", href: "/docs/plugins/plugin-api-reference" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/jolterjs/jolter" },
      { label: "Report vulnerability", href: "/docs/security/reporting" },
      { label: "Maintainers", href: "/docs/maintainers/architecture" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-white/[0.08] bg-black text-white"
      data-no-reveal
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div>
            <Link
              href="/#top"
              className="inline-flex items-center transition hover:opacity-80"
              aria-label="Jolter home"
            >
              <img src="/jnbg.png" className="size-8" alt="" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">
              Fast, reliable JavaScript runtime and toolchain management for
              local development, teams, and CI.
            </p>
          </div>

          <nav
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Footer"
          >
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-mono text-xs font-semibold tracking-normal text-white/35 uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.08] pt-6 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jolter. Built for reproducible toolchains.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/docs/security/reporting" className="hover:text-white">
              Security
            </Link>
            <Link
              href="/docs/reference/environment"
              className="hover:text-white"
            >
              Environment
            </Link>
            <Link
              href="/docs/operations/diagnostics"
              className="hover:text-white"
            >
              Diagnostics
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith("http");
  const className =
    "flex w-fit items-center gap-1.5 text-sm leading-5 text-white/48 transition hover:text-white";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
        <ExternalLink className="size-3 text-white/28" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
