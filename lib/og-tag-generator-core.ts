/**
 * Build Open Graph and Twitter Card meta tag snippets for pasting into <head>.
 */

export type OgTagGeneratorState = {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  /** When true, emit twitter:* tags using explicit fields or mirroring OG. */
  includeTwitter: boolean;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  /** og:article:* when og:type is article or user enables manually */
  includeArticle: boolean;
  articlePublishedTime: string;
  articleModifiedTime: string;
  articleAuthor: string;
};

export const DEFAULT_OG_TAG_STATE: OgTagGeneratorState = {
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogImageAlt: "",
  ogUrl: "",
  ogType: "website",
  ogSiteName: "",
  ogLocale: "en_US",
  includeTwitter: true,
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  includeArticle: false,
  articlePublishedTime: "",
  articleModifiedTime: "",
  articleAuthor: "",
};

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function metaLine(property: string, content: string, useName = false): string {
  const esc = escapeHtmlAttribute(content);
  const attr = useName ? "name" : "property";
  return `<meta ${attr}="${property}" content="${esc}" />`;
}

/** Returns lines to paste inside HTML <head>. */
export function buildOgMetaSnippet(state: OgTagGeneratorState): string {
  const lines: string[] = [];

  const pushOg = (prop: string, val: string) => {
    if (!val.trim()) return;
    lines.push(metaLine(prop, val, false));
  };

  pushOg("og:title", state.ogTitle);
  pushOg("og:description", state.ogDescription);
  pushOg("og:image", state.ogImage);
  pushOg("og:image:alt", state.ogImageAlt);
  pushOg("og:url", state.ogUrl);
  if (state.ogType.trim()) pushOg("og:type", state.ogType);
  pushOg("og:site_name", state.ogSiteName);
  pushOg("og:locale", state.ogLocale);

  const isArticle =
    state.includeArticle || state.ogType.trim().toLowerCase() === "article";
  if (isArticle) {
    pushOg("article:published_time", state.articlePublishedTime);
    pushOg("article:modified_time", state.articleModifiedTime);
    pushOg("article:author", state.articleAuthor);
  }

  if (state.includeTwitter) {
    const twTitle = state.twitterTitle.trim() || state.ogTitle;
    const twDesc = state.twitterDescription.trim() || state.ogDescription;
    const twImage = state.twitterImage.trim() || state.ogImage;
    if (state.twitterCard.trim()) {
      lines.push(metaLine("twitter:card", state.twitterCard.trim(), true));
    }
    if (twTitle) lines.push(metaLine("twitter:title", twTitle, true));
    if (twDesc) lines.push(metaLine("twitter:description", twDesc, true));
    if (twImage) lines.push(metaLine("twitter:image", twImage, true));
    const site = state.twitterSite.trim();
    if (site) {
      const handle = site.startsWith("@") ? site : `@${site}`;
      lines.push(metaLine("twitter:site", handle, true));
    }
  }

  return lines.join("\n");
}

function readMetaContent(
  doc: Document,
  property: string,
  byName: boolean,
): string {
  try {
    const attr = byName ? "name" : "property";
    const el = doc.querySelector(
      `meta[${attr}=${JSON.stringify(property)}]`,
    );
    return el?.getAttribute("content")?.trim() ?? "";
  } catch {
    return "";
  }
}

/** Best-effort parse of saved HTML to pre-fill the form (client-only). */
export function parseOgFromHtml(html: string): Partial<OgTagGeneratorState> {
  if (typeof document === "undefined") return {};
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: Partial<OgTagGeneratorState> = {};

  const og = (p: string) => readMetaContent(doc, p, false);
  const tw = (p: string) => readMetaContent(doc, p, true);

  out.ogTitle = og("og:title");
  out.ogDescription = og("og:description");
  out.ogImage = og("og:image");
  out.ogImageAlt = og("og:image:alt");
  out.ogUrl = og("og:url");
  out.ogType = og("og:type") || "website";
  out.ogSiteName = og("og:site_name");
  out.ogLocale = og("og:locale") || "en_US";

  const card = tw("twitter:card");
  if (card) {
    out.includeTwitter = true;
    out.twitterCard = card;
  }
  out.twitterTitle = tw("twitter:title");
  out.twitterDescription = tw("twitter:description");
  out.twitterImage = tw("twitter:image");
  const site = tw("twitter:site");
  out.twitterSite = site ? (site.startsWith("@") ? site : `@${site}`) : "";

  const pub = og("article:published_time");
  const mod = og("article:modified_time");
  const auth = og("article:author");
  if (pub || mod || auth) {
    out.includeArticle = true;
    out.articlePublishedTime = pub;
    out.articleModifiedTime = mod;
    out.articleAuthor = auth;
  }

  return out;
}

export function previewHostname(url: string): string {
  const u = url.trim();
  if (!u) return "yoursite.com";
  try {
    const withScheme = /^https?:\/\//i.test(u) ? u : `https://${u}`;
    return new URL(withScheme).hostname;
  } catch {
    return "yoursite.com";
  }
}
