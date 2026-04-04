import {
  MIME_BY_EXTENSION,
  MIME_COMPOUND_EXTENSIONS,
} from "@/lib/mime-type-lookup-data";

/** Extra notes when one extension maps to multiple common Content-Types. */
export const MIME_ALTERNATIVES: Readonly<
  Record<string, readonly { readonly mime: string; readonly note: string }[]>
> = {
  ts: [
    {
      mime: "text/typescript",
      note:
        "Often used for TypeScript source files in editors and bundlers (not a single IANA standard for .ts).",
    },
  ],
  csv: [
    {
      mime: "text/csv; charset=utf-8",
      note:
        "RFC 4180 CSV; many APIs add charset for UTF-8 payloads.",
    },
  ],
  js: [
    {
      mime: "application/javascript",
      note:
        "Legacy HTTP Content-Type; modern specs reference text/javascript for classic scripts.",
    },
  ],
};

export type MimeLookupResult = {
  /** Normalized extension without leading dot (e.g. pdf, tar.gz). */
  extension: string;
  /** Primary MIME type from the catalog, if any. */
  mime: string | null;
  /** Additional common types for the same extension. */
  alternatives: readonly { mime: string; note: string }[];
};

const MIME_TYPE_PATTERN =
  /^[a-z0-9][a-z0-9._+-]*\/[a-z0-9][a-z0-9._+-]*$/i;

export function looksLikeMimeType(input: string): boolean {
  const t = input.trim();
  if (t.includes("\\") || t.includes("://") || t.startsWith("/")) return false;
  if (!t.includes("/")) return false;
  const parts = t.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  return MIME_TYPE_PATTERN.test(t);
}

function basename(path: string): string {
  const normalized = path.replace(/\\/g, "/").trim();
  const slash = normalized.lastIndexOf("/");
  return slash >= 0 ? normalized.slice(slash + 1) : normalized;
}

/**
 * Extract extension: tries compound suffixes (e.g. tar.gz) before the last segment.
 * Accepts bare extensions like `json` or `.svg` when there is no path.
 */
export function extensionFromFilename(filename: string): string {
  const raw = filename.trim();
  if (!raw) return "";

  const hasPath = raw.includes("/") || raw.includes("\\");

  if (!hasPath) {
    if (raw.startsWith(".") && raw.length > 1) {
      const rest = raw.slice(1);
      if (!rest.includes(".")) return rest.toLowerCase();
    }
    if (!raw.includes(".")) {
      if (/^[a-z0-9][a-z0-9._+-]*$/i.test(raw)) return raw.toLowerCase();
    }
  }

  const base = basename(raw).toLowerCase();
  if (!base || base === "." || base === "..") return "";

  for (const { suffix } of MIME_COMPOUND_EXTENSIONS) {
    if (base.endsWith(`.${suffix}`)) return suffix;
  }

  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1);
}

export function lookupMimeFromExtension(ext: string): string | undefined {
  const e = ext.trim().toLowerCase().replace(/^\.+/, "");
  if (!e) return undefined;
  return MIME_BY_EXTENSION[e];
}

export function lookupFromFilename(filename: string): MimeLookupResult {
  const extension = extensionFromFilename(filename);
  if (!extension) {
    return { extension: "", mime: null, alternatives: [] };
  }
  const mime = lookupMimeFromExtension(extension) ?? null;
  const alt = MIME_ALTERNATIVES[extension] ?? [];
  return { extension, mime, alternatives: alt };
}

/** Reverse lookup: typical file extensions for a MIME type (may be incomplete). */
export function extensionsForMimeType(mime: string): string[] {
  const needle = mime.trim().toLowerCase();
  if (!needle) return [];
  const out: string[] = [];
  for (const [ext, m] of Object.entries(MIME_BY_EXTENSION)) {
    if (m.toLowerCase() === needle) out.push(ext);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

export function lookupFromMimeInput(mime: string): {
  mime: string;
  extensions: string[];
} {
  const normalized = mime.trim().toLowerCase().split(/\s*;/)[0] ?? "";
  return {
    mime: normalized,
    extensions: extensionsForMimeType(normalized),
  };
}
