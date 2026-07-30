import { NextResponse } from "next/server";

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/jolterjs/jolter/main/scripts";

export async function fetchGitHubScript(filename: string) {
  const url = `${GITHUB_RAW_BASE}/${filename}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new NextResponse(
        `Failed to fetch ${filename} from GitHub: ${res.statusText}`,
        {
          status: res.status,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        },
      );
    }

    const content = await res.text();

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return new NextResponse(`Error fetching script ${filename}: ${error}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
