import { marked } from "marked";

marked.setOptions({
  gfm: true,
});

export function markdownToHtml(
  md: string,
): { ok: true; html: string } | { ok: false; error: string } {
  try {
    const html = marked.parse(md.trim() ? md : "", { async: false }) as string;
    return { ok: true, html };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not parse Markdown.";
    return { ok: false, error: message };
  }
}
