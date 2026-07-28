import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollRevealProvider from "@/components/ScrollRevealProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ToastViewport from "@/components/ToastViewport";
import { getDocsSearchIndex } from "@/lib/docs";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Jolter - Reliable JavaScript toolchain management",
    template: "%s - Jolter",
  },
  description: siteConfig.description,
  applicationName: "Jolter",
  authors: [{ name: "Jolter Team" }],
  creator: "Jolter Team",
  publisher: "Jolter",
  keywords: [
    "JavaScript toolchain manager",
    "Node.js version manager",
    "pnpm version manager",
    "runtime management",
    "CI toolchains",
    "developer tooling",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jolter - Reliable JavaScript toolchain management",
    description: siteConfig.description,
    url: "/",
    siteName: "Jolter",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jolter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jolter - Reliable JavaScript toolchain management",
    description: siteConfig.description,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/jnbg.png"),
    sameAs: ["https://github.com/jolterjs/jolter"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      query: "required name=search_term_string",
      target: absoluteUrl("/docs?search={search_term_string}"),
    },
  },
];

import MobileDrawer from "@/components/MobileDrawer";
import { MobileDrawerProvider } from "@/components/MobileDrawerProvider";
import { GlobalAuroraBackground } from "@/components/GlobalAuroraBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docsSearchIndex = getDocsSearchIndex();

  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full bg-black antialiased selection:bg-white selection:text-black`}
    >
      <body className="bg-black text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <MobileDrawerProvider>
          <div className="app-scale-wrapper relative flex min-h-screen flex-col bg-black">
            <GlobalAuroraBackground />

            <SmoothScrollProvider>
              <ScrollRevealProvider>
                <div className="relative z-10 flex min-h-screen flex-col">
                  <Header docsSearchIndex={docsSearchIndex} />
                  {children}
                  <Footer />
                  <ToastViewport />
                </div>
              </ScrollRevealProvider>
            </SmoothScrollProvider>
          </div>
          <MobileDrawer />
        </MobileDrawerProvider>
      </body>
    </html>
  );
}
