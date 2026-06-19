"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const [osSelected, setOsSelected] = React.useState<"unix" | "windows">(
    "unix",
  );

  return (
    <>
      <div className="absolute z-[-1] flex h-full w-full flex-col items-center justify-center overflow-hidden blur-3xl">
        <div
          className="relative aspect-1155/678 w-full bg-linear-to-br from-blue-500 to-purple-700 opacity-35"
          style={{
            clipPath:
              "polygon(85.7% 38.5%, 65.8% 0.5%, 7.7% 50.6%, 87% 15.7%, 27.6% 27.1%, 90% 43.7%, 57.2% 93.2%, 51.3% 28.8%, 48.5% 80%, 37.2% 95.2%, 81.3% 61.7%, 30.8% 89.3%, 4.8% 27.3%, 20.7% 93.7%, 90% 53.7%, 4% 67.7%)",
          }}
        />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center px-24">
        <div className="flex flex-row items-center justify-center px-6 select-none cursor-pointer py-2 rounded-full bg-white/7.5 backdrop-blur-lg hover:bg-white/12.5 transition-all text-white font-medium text-sm">
          <img src="/logo.png" className="size-5 mr-1.25" />
          v1.0.0 release
          <ChevronRight className="size-4 ml-0.5" />
        </div>
        <h1
          className="text-center text-8xl leading-tight font-bold mt-4"
          style={{ letterSpacing: "1.5px" }}
        >
          One fast, reliable home for your{" "}
          <span className="bg-linear-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
            JavaScript runtimes & tools
          </span>.
        </h1>
        <p className="mt-2 text-xl font-normal text-white/70 max-w-3xl text-center">
          Keep Node.js, Bun, Deno, npm, pnpm, and Yarn consistent across your
          machine, team, and CI. Built in 100% pure Rust.
        </p>
        <div className="mt-8 flex flex-row items-center justify-center gap-4">
          <button
            type="button"
            className="text-md cursor-pointer rounded-full bg-linear-to-br from-blue-500 to-purple-500 px-9 py-3 font-semibold transition-all hover:opacity-80"
          >
            Get Started
          </button>
          <button
            type="button"
            className="text-md cursor-pointer rounded-full bg-white/7.5 px-9 py-3 font-medium backdrop-blur-lg transition-all hover:bg-white/12.5"
          >
            Learn Jolter
          </button>
        </div>
      </div>
    </>
  );
}
