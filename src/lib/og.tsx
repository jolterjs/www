import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { AuroraBackground } from "@/components/ui/aurora-background";

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
      <AuroraBackground
        staticMode
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />
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
