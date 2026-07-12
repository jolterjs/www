"use client";

import React from "react";
import { Code2 } from "lucide-react";
import AppleIcon from "@/icons/apple";
import LinuxIcon from "@/icons/linux";
import WindowsIcon from "@/icons/windows";

export type CodeGroupTabItem = {
  content: React.ReactNode;
  icon: "code" | "linux" | "macos" | "unix" | "windows";
  label: string;
};

export default function CodeGroupTabs({
  items,
}: {
  items: CodeGroupTabItem[];
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selected = items[selectedIndex] ?? items[0];

  if (!selected) {
    return null;
  }

  return (
    <div
      className="docs-code-tabs my-7 overflow-hidden rounded-lg border border-white/[0.1] bg-[#050505]"
      data-code-group-tabs
    >
      <div
        className="flex gap-1 overflow-x-auto border-b border-white/[0.09] p-1"
        role="tablist"
      >
        {items.map((item, index) => {
          const active = index === selectedIndex;

          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex min-h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-black"
                  : "text-white/48 hover:bg-white/[0.06] hover:text-white"
              }`}
              aria-selected={active}
              role="tab"
            >
              <TabIcon icon={item.icon} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div>
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}-panel`}
            hidden={index !== selectedIndex}
            role="tabpanel"
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabIcon({ icon }: { icon: CodeGroupTabItem["icon"] }) {
  if (icon === "windows") {
    return <WindowsIcon className="size-4 fill-current" />;
  }

  if (icon === "linux") {
    return <LinuxIcon className="size-4 fill-current" />;
  }

  if (icon === "macos") {
    return <AppleIcon className="size-4 fill-current" />;
  }

  if (icon === "unix") {
    return (
      <span className="flex items-center gap-1">
        <AppleIcon className="size-4 fill-current" />
        <LinuxIcon className="size-4 fill-current" />
      </span>
    );
  }

  return <Code2 className="size-4" />;
}
