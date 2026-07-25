import { createHighlighter, type BundledLanguage } from "shiki";

export type HighlightLanguage = Extract<
  BundledLanguage,
  "json" | "shellscript" | "yaml" | "javascript"
>;

export type HighlightedSnippet = {
  code: string;
  highlightedHtml: string;
};

const highlighterPromise = createHighlighter({
  themes: ["github-dark"],
  langs: ["json", "shellscript", "yaml", "javascript"],
});

export async function highlightCode(
  code: string,
  lang: HighlightLanguage,
): Promise<HighlightedSnippet> {
  const highlighter = await highlighterPromise;

  return {
    code,
    highlightedHtml: highlighter.codeToHtml(code, {
      lang,
      theme: "github-dark",
    }),
  };
}
