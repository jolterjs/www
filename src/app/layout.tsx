import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Header from "@/components/Header";
import "@/styles/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jolter — One fast, reliable home for your toolchains",
  description:
    "Fast, reliable JavaScript runtime and toolchain management for local development and CI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased selection:bg-white selection:text-black`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
