const LABEL =
  /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|xn--[a-z0-9-]+)$/i;

/**
 * Parses user input into a lowercase LDH hostname suitable for RDAP domain queries.
 * Accepts bare domains or http(s) URLs; returns null if invalid.
 */
export function parseDomainQuery(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let host: string;
  try {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
      const u = new URL(trimmed);
      host = u.hostname;
    } else if (trimmed.includes("/")) {
      const u = new URL(`https://${trimmed}`);
      host = u.hostname;
    } else {
      host = trimmed.split("/")[0].split(":")[0] ?? "";
    }
  } catch {
    return null;
  }

  host = host.toLowerCase().replace(/\.$/, "");
  if (!host || host.length > 253) return null;

  const labels = host.split(".");
  if (labels.length < 2) return null;
  if (labels.some((l) => l.length === 0 || l.length > 63)) return null;
  if (!labels.every((l) => LABEL.test(l))) return null;

  return host;
}

/** Strips a single leading `www.` label for a second lookup attempt. */
export function withoutWww(hostname: string): string | null {
  const labels = hostname.split(".");
  if (labels.length > 2 && labels[0] === "www") {
    return labels.slice(1).join(".");
  }
  return null;
}
