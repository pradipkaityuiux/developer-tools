import { PublicUrlError, assertPublicHostname } from "@/lib/safe-public-url";

const RDAP_URL_PREFIX = "https://rdap.org/domain/";
const FETCH_TIMEOUT_MS = 22_000;
const UA = "Mozilla/5.0 (compatible; DevTool-DomainAgeChecker/1.0)";
const MAX_LABEL_STRIPS = 12;

export function normalizeDomainInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let host: string;
  try {
    const prefixed = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const u = new URL(prefixed);
    if (u.username || u.password) return null;
    host = u.hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return null;
  }
  if (!host || host.length > 253 || !host.includes(".")) return null;
  return host;
}

function stripWww(host: string): string {
  return host.startsWith("www.") ? host.slice(4) : host;
}

function stripLeftLabel(host: string): string | null {
  const parts = host.split(".");
  if (parts.length <= 2) return null;
  return parts.slice(1).join(".");
}

type RdapEvent = { eventAction?: string; eventDate?: string };

type RdapJson = {
  objectClassName?: string;
  ldhName?: string;
  title?: string;
  events?: RdapEvent[];
  errorCode?: string | number;
  status?: string[];
  entities?: unknown[];
};

function isRdapNotFound(obj: RdapJson, httpStatus: number): boolean {
  if (httpStatus === 404) return true;
  if (obj.errorCode === 404 || obj.errorCode === "404") return true;
  const t = obj.title;
  if (typeof t === "string" && t.toLowerCase() === "not found") return true;
  return false;
}

async function fetchRdapOnce(
  domain: string,
): Promise<
  | { ok: true; data: RdapJson }
  | { ok: false; notFound: boolean; status: number; data?: RdapJson }
> {
  const url = `${RDAP_URL_PREFIX}${encodeURIComponent(domain)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/rdap+json", "user-agent": UA },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, notFound: false, status: 0 };
  }

  let data: RdapJson;
  try {
    data = (await res.json()) as RdapJson;
  } catch {
    return { ok: false, notFound: false, status: res.status };
  }

  if (
    res.ok &&
    data.objectClassName === "domain" &&
    Array.isArray(data.events)
  ) {
    return { ok: true, data };
  }

  return {
    ok: false,
    notFound: isRdapNotFound(data, res.status),
    status: res.status,
    data,
  };
}

export type DomainAgeLookupResult = {
  domainInput: string;
  domainMatched: string;
  ldhName: string | null;
  registrationDate: string | null;
  expirationDate: string | null;
  lastChangedDate: string | null;
  ageDays: number | null;
  ageDescription: string | null;
  domainStatuses: string[];
  registrarName: string | null;
};

function pickEventDate(
  events: RdapEvent[] | undefined,
  action: string,
): string | null {
  if (!events?.length) return null;
  const want = action.toLowerCase();
  const hit = events.find((x) => (x.eventAction ?? "").toLowerCase() === want);
  return hit?.eventDate ?? null;
}

function daysBetweenUtc(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function describeAgeFromDays(totalDays: number): string {
  if (totalDays < 0) return "—";
  if (totalDays === 0) return "0 days";
  const years = Math.floor(totalDays / 365);
  const remAfterYears = totalDays - years * 365;
  const months = Math.floor(remAfterYears / 30);
  const days = remAfterYears - months * 30;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (parts.length === 0 && days > 0) {
    parts.push(`${days} day${days === 1 ? "" : "s"}`);
  }
  if (parts.length === 0) return "less than a month";
  return parts.join(", ");
}

function registrarFromEntity(ent: unknown): string | null {
  if (!ent || typeof ent !== "object") return null;
  const o = ent as Record<string, unknown>;
  const roles = o.roles;
  if (Array.isArray(roles) && roles.includes("registrar")) {
    const vcard = o.vcardArray;
    if (Array.isArray(vcard) && vcard.length >= 2) {
      const inner = vcard[1];
      if (Array.isArray(inner)) {
        for (const row of inner) {
          if (!Array.isArray(row) || row[0] !== "fn") continue;
          const val = row[row.length - 1];
          if (typeof val === "string" && val.trim()) return val.trim();
        }
      }
    }
  }
  if (Array.isArray(o.entities)) {
    for (const child of o.entities) {
      const n = registrarFromEntity(child);
      if (n) return n;
    }
  }
  return null;
}

function extractRegistrarName(obj: RdapJson): string | null {
  const entities = obj.entities;
  if (!Array.isArray(entities)) return null;
  for (const ent of entities) {
    const name = registrarFromEntity(ent);
    if (name) return name;
  }
  return null;
}

export async function lookupDomainAge(
  domainInput: string,
): Promise<DomainAgeLookupResult | { error: string }> {
  const normalized = normalizeDomainInput(domainInput);
  if (!normalized) {
    return {
      error: "Enter a valid domain name (for example example.com).",
    };
  }

  try {
    await assertPublicHostname(normalized);
  } catch (e) {
    const msg =
      e instanceof PublicUrlError ? e.message : "That hostname is not allowed.";
    return { error: msg };
  }

  let candidate = stripWww(normalized);

  let strips = 0;
  while (strips < MAX_LABEL_STRIPS) {
    strips += 1;
    const r = await fetchRdapOnce(candidate);
    if (r.ok) {
      const data = r.data;
      const reg = pickEventDate(data.events, "registration");
      const exp = pickEventDate(data.events, "expiration");
      const last =
        pickEventDate(data.events, "last changed") ??
        pickEventDate(data.events, "last update of rdap database");

      let ageDays: number | null = null;
      let ageDescription: string | null = null;
      if (reg) {
        const start = new Date(reg);
        if (!Number.isNaN(start.getTime())) {
          ageDays = daysBetweenUtc(start, new Date());
          ageDescription = describeAgeFromDays(ageDays);
        }
      }

      return {
        domainInput: normalized,
        domainMatched: candidate.toLowerCase(),
        ldhName: data.ldhName?.toLowerCase() ?? null,
        registrationDate: reg,
        expirationDate: exp,
        lastChangedDate: last,
        ageDays,
        ageDescription,
        domainStatuses: Array.isArray(data.status) ? data.status : [],
        registrarName: extractRegistrarName(data),
      };
    }

    if (r.notFound) {
      const next = stripLeftLabel(candidate);
      if (!next) {
        return {
          error:
            "No public RDAP record was found for that domain. Try the apex domain (for example example.com), or note that some country-code combinations need the exact registrable name.",
        };
      }
      candidate = next;
      continue;
    }

    if (r.status === 0) {
      return {
        error: "Could not reach RDAP services. Try again in a moment.",
      };
    }
    return {
      error: `RDAP lookup failed (HTTP ${r.status}). The registry may be rate-limiting or temporarily unavailable.`,
    };
  }

  return {
    error:
      "Could not resolve a matching RDAP domain after several attempts. Enter the registrable apex domain if you used a deep subdomain.",
  };
}
