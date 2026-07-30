import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

type OgImageOptions = {
  title: string;
  description?: string;
};

const logoDataUrl = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public/jnbg.png"))
  .toString("base64")}`;

const auroraDataUrl = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public/og-aurora.png"))
  .toString("base64")}`;

export function createJolterOgImage({ title, description }: OgImageOptions) {
  const titleFontSize = title.length > 68 ? 64 : title.length > 42 ? 76 : 88;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "48px 64px",
        background: "#000",
        color: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <img
        src={auroraDataUrl}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
          opacity: 0.45,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "75%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,1) 70%, #000 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "18%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          maxWidth: 1072,
          marginTop: -42,
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
          <img
            src={logoDataUrl}
            alt=""
            width={76}
            height={76}
            style={{
              width: 76,
              height: 76,
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.8,
              maxWidth: 1072,
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                marginTop: 24,
                maxWidth: 1000,
                fontSize: 32,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.65)",
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
