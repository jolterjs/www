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

export function createJolterOgImage({ description, title }: OgImageOptions) {
  const titleFontSize = title.length > 68 ? 56 : title.length > 42 ? 64 : 72;
  const titleLineHeight = 1.03;
  const titleLineEstimate = Math.min(
    3,
    Math.max(1, Math.ceil(title.length / (titleFontSize >= 70 ? 25 : 32))),
  );
  const descriptionLineEstimate = description
    ? Math.min(2, Math.max(1, Math.ceil(description.length / 58)))
    : 0;
  const contentTop = 196;
  const titleHeight = titleLineEstimate * titleFontSize * titleLineHeight;
  const descriptionHeight = descriptionLineEstimate * 34;
  const contentBottom = Math.min(
    506,
    contentTop + 34 + titleHeight + (description ? 30 + descriptionHeight : 0),
  );
  const topRule = contentTop - 28;
  const bottomRule = contentBottom + 28;

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
        padding: 64,
        position: "relative",
        width: "100%",
      }}
    >
      <GridLine orientation="horizontal" x={64} y={topRule} width={1072} />
      <GridLine orientation="horizontal" x={64} y={bottomRule} width={1072} />
      <GridLine
        height={566 - bottomRule}
        orientation="vertical"
        x={600}
        y={bottomRule}
      />
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          bottom: 64,
          left: 64,
          position: "absolute",
          right: 64,
          top: 64,
        }}
      />
      <Corner x={64} y={64} />
      <Corner x={1136} y={64} />
      <Corner x={64} y={566} />
      <Corner x={1136} y={566} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-start",
          maxWidth: 960,
          padding: "12px 0 0",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: 86,
          }}
        >
          <img
            alt=""
            height={68}
            src={logoDataUrl}
            style={{
              height: 68,
              objectFit: "contain",
              width: 68,
            }}
            width={68}
          />
        </div>

        <div
          style={{
            background: "#000",
            display: "flex",
            flexDirection: "column",
            marginTop: contentTop - 64 - 98,
            padding: "0 0 2px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: -1.2,
              lineHeight: titleLineHeight,
              maxWidth: 930,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: 25,
                lineHeight: 1.4,
                marginTop: 28,
                maxWidth: 820,
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.36)",
            display: "flex",
            fontSize: 18,
            justifyContent: "space-between",
            marginTop: "auto",
            paddingBottom: 12,
          }}
        >
          <span>Runtimes</span>
          <span>Tools</span>
          <span>Plugins</span>
          <span>CI</span>
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
