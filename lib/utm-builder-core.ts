export type UtmFields = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function emptyUtmFields(): UtmFields {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };
}

/** Prepend https when the user omits the scheme (common for landing pages). */
export function normalizeBaseUrl(input: string): string {
  const t = input.trim();
  if (!t) return "";
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;
  return t;
}

/** First plausible URL line in pasted or uploaded text. */
export function extractFirstUrlFromText(text: string): string | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const candidate = normalizeBaseUrl(s);
    try {
      const u = new URL(candidate);
      if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    } catch {
      continue;
    }
  }
  return null;
}

export function buildUtmUrl(
  baseUrl: string,
  utm: UtmFields,
): { ok: true; url: string } | { ok: false; error: string } {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return { ok: false, error: "Enter a destination URL." };

  let u: URL;
  try {
    u = new URL(normalized);
  } catch {
    return { ok: false, error: "That does not look like a valid URL." };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  for (const key of UTM_KEYS) {
    const v = utm[key]?.trim();
    if (v) u.searchParams.set(key, v);
    else u.searchParams.delete(key);
  }

  return { ok: true, url: u.toString() };
}

/**
 * Parse a full URL that may already include UTM query params: return a clean base
 * (without utm_* keys) plus the five standard fields for the form.
 */
export function splitUrlAndUtm(full: string): { ok: true; baseUrl: string; utm: UtmFields } | { ok: false; error: string } {
  const normalized = normalizeBaseUrl(full);
  if (!normalized) return { ok: false, error: "Paste a full URL to import." };

  let u: URL;
  try {
    u = new URL(normalized);
  } catch {
    return { ok: false, error: "Could not parse that URL." };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  const utm = emptyUtmFields();
  for (const key of UTM_KEYS) {
    const v = u.searchParams.get(key);
    if (v) utm[key] = v;
    u.searchParams.delete(key);
  }

  let baseUrl = u.toString();
  if (baseUrl.endsWith("?")) baseUrl = baseUrl.slice(0, -1);

  return { ok: true, baseUrl, utm };
}
