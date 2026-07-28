"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
  staticMode?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  staticMode = false,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-black text-white",
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={
          {
            "--aurora":
              "repeating-linear-gradient(100deg,#ffffff_10%,#e2e8f0_15%,#94a3b8_20%,#ffffff_25%,#cbd5e1_30%)",
            "--dark-gradient":
              "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",

            "--white": "#ffffff",
            "--silver": "#e2e8f0",
            "--gray": "#94a3b8",
            "--black": "#000000",
            "--transparent": "transparent",
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            `pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-45 blur-[20px] filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--white)_10%,var(--silver)_15%,var(--gray)_20%,var(--white)_25%,var(--silver)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:scroll] after:mix-blend-difference after:content-[""]`,
            !staticMode && "after:animate-aurora",
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_50%_20%,black_30%,var(--transparent)_85%)]`,
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
