import { createJolterOgImage } from "@/lib/og";

export const alt = "Jolter Blog";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function Image() {
  return createJolterOgImage({
    title: "Notes on reliable JavaScript toolchains",
    description:
      "Product updates, release context, engineering notes, and security guidance from the Jolter team.",
  });
}
