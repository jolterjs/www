import { NextRequest, NextResponse } from "next/server";
import { getDocPage } from "@/lib/docs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slug") ?? "index";
  const slugParts = slugParam === "index" ? [] : slugParam.split("/");

  const page = getDocPage(slugParts);

  if (!page) {
    return new NextResponse("Document not found", { status: 404 });
  }

  return new NextResponse(page.content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
