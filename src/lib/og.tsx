import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogImageSize = {
  height: 630,
  width: 1200,
};

type OgImageOptions = {
  description?: string;
  title: string;
};

const logoDataUrl = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public/jnbg.png"))
  .toString("base64")}`;

/**
 * Static aurora background for OG images, built with Satori-compatible
 * inline styles only. Reproduces the visual effect of the AuroraBackground
 * component without Tailwind classes, CSS variables, pseudo-elements, or
 * animations (none of which Satori supports).
 *
 * Uses layered gradients at different angles and opacities to create
 * the characteristic aurora shimmer, plus a radial mask to fade edges.
 */
function OgAuroraBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        display: "flex",
        background: "#000",
      }}
    >
      {/* Base aurora glow layer - primary streaks */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          right: -40,
          bottom: -40,
          backgroundImage:
            "repeating-linear-gradient(100deg, #ffffff 10%, #e2e8f0 15%, #94a3b8 20%, #ffffff 25%, #cbd5e1 30%)",
          backgroundSize: "300% 200%",
          backgroundPosition: "50% 50%",
          opacity: 0.5,
          filter: "blur(30px)",
          display: "flex",
        }}
      />
      {/* Secondary aurora layer - offset for depth */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          right: -40,
          bottom: -40,
          backgroundImage:
            "repeating-linear-gradient(100deg, #e2e8f0 5%, #94a3b8 12%, #cbd5e1 18%, #ffffff 24%, #e2e8f0 30%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "70% 50%",
          opacity: 0.35,
          filter: "blur(25px)",
          display: "flex",
        }}
      />
      {/* Dark masking layer - breaks up the aurora into streaks */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          right: -40,
          bottom: -40,
          backgroundImage:
            "repeating-linear-gradient(100deg, #000000 0%, #000000 7%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 12%, #000000 16%)",
          backgroundSize: "300% 200%",
          backgroundPosition: "50% 50%",
          opacity: 0.85,
          display: "flex",
        }}
      />
      {/* Radial gradient mask — fades edges to black like the real component's
          mask-image: radial-gradient(ellipse at 50% 20%, black 30%, transparent 85%) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(ellipse 120% 100% at 50% 20%, rgba(0,0,0,0) 30%, #000000 85%)",
          display: "flex",
        }}
      />
    </div>
  );
}

export function createJolterOgImage({ description, title }: OgImageOptions) {
  const titleFontSize = title.length > 68 ? 64 : title.length > 42 ? 76 : 88;
  const titleLineHeight = 1.05;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#000",
        color: "#fff",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "48px 64px",
        position: "relative",
        width: "100%",
      }}
    >
      <OgAuroraBackground />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 1072,
          position: "relative",
          marginTop: -42,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: 80,
          }}
        >
          <img
            alt=""
            height={76}
            src={logoDataUrl}
            style={{
              height: 76,
              objectFit: "contain",
              width: 76,
            }}
            width={76}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: -1.8,
              lineHeight: titleLineHeight,
              maxWidth: 1072,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 32,
                lineHeight: 1.35,
                marginTop: 24,
                maxWidth: 1000,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>,
    ogImageSize,
  );
}

function GridLine({
  height = 1,
  orientation,
  width = 1,
  x,
  y,
}: {
  height?: number;
  orientation: "horizontal" | "vertical";
  width?: number;
  x: number;
  y: number;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        height: orientation === "horizontal" ? 1 : height,
        left: x,
        position: "absolute",
        top: y,
        width: orientation === "horizontal" ? width : 1,
      }}
    />
  );
}

function Corner({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.64)",
        height: 8,
        left: x - 4,
        position: "absolute",
        top: y - 4,
        width: 8,
      }}
    />
  );
}
