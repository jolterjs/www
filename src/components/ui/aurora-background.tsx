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
  const isTransparentBg = className?.includes("bg-transparent");

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-black text-white",
        className,
      )}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isTransparentBg ? "transparent" : "#000000",
        color: "#ffffff",
        ...style,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: "hidden",
          pointerEvents: "none",
          display: "flex",
        }}
      >
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-45 blur-[20px] filter will-change-transform",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_50%_20%,black_30%,var(--transparent)_85%)]",
          )}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            bottom: "-10px",
            left: "-10px",
            backgroundImage: `${DARK_GRADIENT}, ${AURORA_GRADIENT}`,
            backgroundSize: "300% 200%",
            backgroundPosition: "50% 50%",
            opacity: 0.45,
            filter: "blur(20px)",
            pointerEvents: "none",
            display: "flex",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 mix-blend-difference",
              !staticMode && "animate-aurora",
            )}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `${DARK_GRADIENT}, ${AURORA_GRADIENT}`,
              backgroundSize: "200% 100%",
              mixBlendMode: "difference",
              display: "flex",
            }}
          />
        </div>
        {showRadialGradient && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 20%, transparent 30%, #000000 85%)",
              pointerEvents: "none",
              display: "flex",
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
};
