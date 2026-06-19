"use client";

import { usePathname } from "next/navigation";
import GitHubIcon from "@/icons/github";

export default function Header() {
  const pathname = usePathname();

  const items = [
    { name: "Homepage", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "Guides", href: "/guides" }
  ];
    
  return (
    <>
      <div className="absolute z-9999999 top-0 left-1/2 -translate-x-1/2 py-4 items-center justify-center w-auto">
        <nav className="flex flex-row items-center justify-center gap-2 w-auto bg-white/5 backdrop-blur-lg p-1.5 rounded-full">
            {items.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                    <button type="button" className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer ${isActive ? "text-background bg-white hover:opacity-80" : "bg-transparent text-white hover:bg-white/5"} transition-all`}>
                        {item.name}
                    </button>
                );
            })}
        </nav>
      </div>
      <header className="absolute z-99999 flex w-full flex-row items-center justify-between px-58 py-4">
        <div className="flex flex-row items-center justify-center gap-0.5 select-none hover:opacity-80 cursor-pointer transition-all">
          <img src="/logo.png" className="size-10"></img>
          <h1 className="text-2xl font-semibold">Jolter</h1>
        </div>
        <div className="flex flex-row items-center justify-center">
          <button className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-white/7.5 px-6 py-3.5 text-sm text-white backdrop-blur-lg transition-all hover:bg-white/12.5">
            <GitHubIcon className="size-5 invert" />
            Star on GitHub
          </button>
        </div>
      </header>
    </>
  );
}
