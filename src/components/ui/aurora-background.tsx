import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
  staticMode?: boolean;
}

const AURORA_GRADIENT =
  "repeating-linear-gradient(100deg, #ffffff 10%, #e2e8f0 15%, #94a3b8 20%, #ffffff 25%, #cbd5e1 30%)";
const DARK_GRADIENT =
  "repeating-linear-gradient(100deg, #000000 0%, #000000 7%, transparent 10%, transparent 12%, #000000 16%)";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  staticMode = false,
  style,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-black text-white",
        className,
      )}
      style={style}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-45 blur-[20px] filter will-change-transform",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_50%_20%,black_30%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_20%,black_30%,transparent_85%)]",
          )}
          style={{
            backgroundImage: `${DARK_GRADIENT}, ${AURORA_GRADIENT}`,
            backgroundSize: "300% 200%",
            backgroundPosition: "50% 50%",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 mix-blend-difference",
              !staticMode && "animate-aurora",
            )}
            style={{
              backgroundImage: `${DARK_GRADIENT}, ${AURORA_GRADIENT}`,
              backgroundSize: "200% 100%",
              mixBlendMode: "difference",
            }}
          />
        </div>
        {showRadialGradient && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_30%,#000000_85%)]" />
        )}
      </div>
      {children}
    </div>
  );
};
