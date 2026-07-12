import { createJolterOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const alt = "Jolter";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function Image() {
  return createJolterOgImage({
    eyebrow: "Jolter",
    title: "Reliable JavaScript toolchain management",
    description: siteConfig.description,
  });
}
