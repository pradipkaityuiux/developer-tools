/**
 * Domain registration lookup via RDAP (Registration Data Access Protocol).
 * Uses the IANA DNS bootstrap file to resolve the correct RDAP server per TLD.
 */

export type RdapSummary = {
  domainName?: string;
  unicodeName?: string;
  handle?: string;
  status: string[];
  registrar?: string;
  events: { action: string; date: string }[];
  nameservers: string[];
  notices: { title?: string; description?: string[] }[];
};

type BootstrapEntry = [string[], string[]];

type RdapJson = {
  rdapConformance?: string[];
  objectClassName?: string;
  ldhName?: string;
  unicodeName?: string;
  handle?: string;
  status?: string[];
  events?: { eventAction?: string; eventDate?: string }[];
  nameservers?: { ldhName?: string }[];
  entities?: RdapEntity[];
  notices?: {
    title?: string;
    description?: (string | { description?: string })[];
  }[];
};

type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  entities?: RdapEntity[];
};

let bootstrapCache: { map: Map<string, string[]>; fetchedAt: number } | null =
  null;
const BOOTSTRAP_TTL_MS = 1000 * 60 * 60 * 6;

function vcardFn(vcardArray: unknown): string | undefined {
  if (!Array.isArray(vcardArray) || vcardArray.length < 2) return undefined;
  const props = vcardArray[1];
  if (!Array.isArray(props)) return undefined;
  for (const p of props) {
    if (
      Array.isArray(p) &&
      p[0] === "fn" &&
      p.length > 3 &&
      typeof p[3] === "string"
    ) {
      return p[3];
    }
  }
  return undefined;
}

function collectRegistrarName(entities: RdapEntity[] | undefined): string | undefined {
  if (!entities) return undefined;
  for (const e of entities) {
    if (e.roles?.includes("registrar")) {
      const fn = vcardFn(e.vcardArray);
      if (fn) return fn;
    }
    const nested = collectRegistrarName(e.entities);
    if (nested) return nested;
  }
  return undefined;
}

function normalizeStatus(s: string): string {
  try {
    const u = new URL(s);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last ? last.replace(/_/g, " ") : s;
  } catch {
    return s;
  }
}

export function summarizeRdap(data: RdapJson): RdapSummary {
  const status = (data.status ?? []).map((x) =>
    typeof x === "string" ? normalizeStatus(x) : String(x),
  );
  const events = (data.events ?? [])
    .filter((ev) => ev.eventAction && ev.eventDate)
    .map((ev) => ({
      action: String(ev.eventAction),
      date: String(ev.eventDate),
    }));
  const nameservers = (data.nameservers ?? [])
    .map((ns) => ns.ldhName)
    .filter((x): x is string => typeof x === "string" && x.length > 0);
  const notices = (data.notices ?? []).map((n) => {
    const lines: string[] = [];
    for (const d of n.description ?? []) {
      if (typeof d === "string") lines.push(d);
      else if (
        d &&
        typeof d === "object" &&
        typeof d.description === "string"
      ) {
        lines.push(d.description);
      }
    }
    return { title: n.title, description: lines };
  });

  return {
    domainName: data.ldhName,
    unicodeName: data.unicodeName,
    handle: data.handle,
    status,
    registrar: collectRegistrarName(data.entities),
    events,
    nameservers,
    notices,
  };
}

function tldFromDomain(hostname: string): string {
  const labels = hostname.toLowerCase().split(".").filter(Boolean);
  return labels.length > 0 ? labels[labels.length - 1] : "";
}

async function loadBootstrapMap(): Promise<Map<string, string[]>> {
  const now = Date.now();
  if (
    bootstrapCache &&
    now - bootstrapCache.fetchedAt < BOOTSTRAP_TTL_MS
  ) {
    return bootstrapCache.map;
  }

  const res = await fetch("https://data.iana.org/rdap/dns.json", {
    signal: AbortSignal.timeout(20_000),
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`RDAP bootstrap returned HTTP ${res.status}.`);
  }

  const json: { services?: BootstrapEntry[] } = await res.json();
  const services = json.services;
  if (!Array.isArray(services)) {
    throw new Error("RDAP bootstrap has an unexpected shape.");
  }

  const map = new Map<string, string[]>();
  for (const entry of services) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [tlds, urls] = entry;
    if (!Array.isArray(tlds) || !Array.isArray(urls)) continue;
    const urlStrings = urls.map((u) => String(u));
    for (const t of tlds) {
      map.set(String(t).toLowerCase(), urlStrings);
    }
  }

  bootstrapCache = { map, fetchedAt: now };
  return map;
}

export async function lookupDomainRdap(domainLdh: string): Promise<RdapJson> {
  const tld = tldFromDomain(domainLdh);
  if (!tld) {
    throw new Error("Could not determine the top-level domain.");
  }

  const map = await loadBootstrapMap();
  const bases = map.get(tld);
  if (!bases?.length) {
    throw new Error(
      `No RDAP server is listed in the IANA bootstrap for .${tld}. Try a different TLD or check back later.`,
    );
  }

  const errors: string[] = [];
  const encoded = encodeURIComponent(domainLdh);

  for (const base of bases) {
    const baseTrim = base.replace(/\/$/, "");
    const url = `${baseTrim}/domain/${encoded}`;
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(25_000),
        headers: {
          accept:
            "application/rdap+json, application/json;q=0.9, */*;q=0.1",
          "user-agent": "Mozilla/5.0 (compatible; DevelopersTools-RDAP/1.0)",
        },
      });

      if (res.status === 404) {
        errors.push("Registry returned not found for this domain name.");
        continue;
      }

      if (!res.ok) {
        errors.push(`HTTP ${res.status} from registry.`);
        continue;
      }

      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("json")) {
        errors.push("Unexpected non-JSON response.");
        continue;
      }

      const data = (await res.json()) as RdapJson;
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      errors.push(msg);
    }
  }

  throw new Error(
    errors.length > 0
      ? errors.join(" ")
      : "Could not reach an RDAP server for this domain.",
  );
}
