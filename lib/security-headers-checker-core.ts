import type { HeaderRow } from "@/lib/collect-http-response-headers";

export type SecurityCheckStatus = "pass" | "warn" | "fail" | "info";

export type SecurityHeaderCheck = {
  id: string;
  title: string;
  status: SecurityCheckStatus;
  message: string;
};

export type SecurityHeadersAnalysis = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
  checks: SecurityHeaderCheck[];
};

function headerMap(rows: HeaderRow[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const r of rows) {
    m.set(r.name.toLowerCase(), r.value);
  }
  return m;
}

function parseHstsMaxAge(value: string): number | null {
  const m = /max-age\s*=\s*(\d+)/i.exec(value);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function hasFrameProtection(
  h: Map<string, string>,
  csp: string | undefined,
): boolean {
  const xfo = h.get("x-frame-options")?.trim().toUpperCase();
  if (xfo === "DENY" || xfo === "SAMEORIGIN") return true;
  if (!csp) return false;
  const low = csp.toLowerCase();
  if (!low.includes("frame-ancestors")) return false;
  if (/frame-ancestors\s+['"]?\*['"]?/i.test(csp)) return false;
  if (/frame-ancestors\s+['"]?none['"]?/i.test(csp)) return true;
  if (/frame-ancestors\s+['"]?self['"]?/i.test(csp)) return true;
  return true;
}

function cspIssues(csp: string | undefined): string | null {
  if (!csp?.trim()) return null;
  const low = csp.toLowerCase();
  if (low.includes("default-src") && low.includes("'unsafe-inline'")) {
    return "default-src allows 'unsafe-inline' — consider tightening script/style policies.";
  }
  if (/script-src[^;]*/i.test(csp)) {
    const snip = csp.match(/script-src[^;]*/i)?.[0] ?? "";
    if (snip.toLowerCase().includes("'unsafe-inline'")) {
      return "script-src includes 'unsafe-inline' — prefer nonces or hashes where possible.";
    }
  }
  if (low.includes("unsafe-eval")) {
    return "CSP allows 'unsafe-eval' — remove if your stack does not require it.";
  }
  return null;
}

export function parseRawHeadersText(text: string): {
  headers: HeaderRow[];
  error?: string;
} {
  const lines = text.split(/\r?\n/);
  const headers: HeaderRow[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^https?:\/\//i.test(line)) continue;
    if (/^HTTP\/\d/i.test(line)) continue;
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const name = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!name) continue;
    headers.push({ name, value });
  }
  if (headers.length === 0) {
    return {
      headers: [],
      error:
        "No headers parsed. Use lines like Content-Security-Policy: default-src 'self', or paste output from curl -I.",
    };
  }
  return { headers };
}

export function analyzeSecurityHeaders(input: {
  headers: HeaderRow[];
  finalUrl: string;
  status: number;
  /** Pasted headers cannot prove TLS; we skip strict transport scoring penalties. */
  mode?: "url" | "paste";
}): SecurityHeadersAnalysis {
  const { headers, finalUrl, status, mode = "url" } = input;
  const h = headerMap(headers);
  const checks: SecurityHeaderCheck[] = [];

  let urlObj: URL;
  try {
    urlObj = new URL(finalUrl);
  } catch {
    urlObj = new URL("https://invalid.invalid");
  }
  const isHttps = urlObj.protocol === "https:";

  if (mode === "paste") {
    checks.push({
      id: "https",
      title: "HTTPS (transport)",
      status: "info",
      message:
        "Paste mode — TLS and redirects were not verified here. Use a live URL scan to confirm HTTPS or paste headers only from an HTTPS response you trust.",
    });
  } else if (!isHttps) {
    checks.push({
      id: "https",
      title: "HTTPS",
      status: "fail",
      message:
        "Final URL is not HTTPS. Serve the site over TLS and redirect HTTP to HTTPS before tuning security headers.",
    });
  } else {
    checks.push({
      id: "https",
      title: "HTTPS",
      status: "pass",
      message: "Response is served over HTTPS.",
    });
  }

  const hsts = h.get("strict-transport-security");
  if (mode === "url" && !isHttps) {
    checks.push({
      id: "hsts",
      title: "Strict-Transport-Security (HSTS)",
      status: "info",
      message:
        "HSTS is only meaningful over HTTPS; fix transport first, then add HSTS with a long max-age.",
    });
  } else if (!hsts?.trim()) {
    checks.push({
      id: "hsts",
      title: "Strict-Transport-Security (HSTS)",
      status: "warn",
      message:
        "Missing HSTS. Add Strict-Transport-Security with max-age of at least one year, then consider preload after testing.",
    });
  } else {
    const age = parseHstsMaxAge(hsts);
    if (age === 0) {
      checks.push({
        id: "hsts",
        title: "Strict-Transport-Security (HSTS)",
        status: "fail",
        message:
          "max-age=0 removes HSTS for clients — use only during intentional rollback.",
      });
    } else if (age !== null && age >= 31536000) {
      checks.push({
        id: "hsts",
        title: "Strict-Transport-Security (HSTS)",
        status: "pass",
        message: `HSTS present with max-age=${age} (≥ 1 year).`,
      });
    } else if (age !== null && age >= 60) {
      checks.push({
        id: "hsts",
        title: "Strict-Transport-Security (HSTS)",
        status: "warn",
        message: `HSTS max-age=${age} is short — aim for ≥ 31536000 once stable.`,
      });
    } else {
      checks.push({
        id: "hsts",
        title: "Strict-Transport-Security (HSTS)",
        status: "warn",
        message:
          "HSTS present but max-age looks missing or very low — verify configuration.",
      });
    }
  }

  const csp = h.get("content-security-policy");
  const cspRo = h.get("content-security-policy-report-only");
  if (!csp?.trim()) {
    checks.push({
      id: "csp",
      title: "Content-Security-Policy",
      status: "warn",
      message: cspRo
        ? "Only report-only CSP is set. Promote a enforced Content-Security-Policy after tuning reports."
        : "No Content-Security-Policy. Start with a restrictive policy and relax as needed.",
    });
  } else {
    const issue = cspIssues(csp);
    checks.push({
      id: "csp",
      title: "Content-Security-Policy",
      status: issue ? "warn" : "pass",
      message: issue ?? "Content-Security-Policy is present.",
    });
  }

  const xcto = h.get("x-content-type-options")?.trim().toLowerCase();
  if (xcto === "nosniff") {
    checks.push({
      id: "xcto",
      title: "X-Content-Type-Options",
      status: "pass",
      message: "nosniff is set — good MIME-type discipline.",
    });
  } else {
    checks.push({
      id: "xcto",
      title: "X-Content-Type-Options",
      status: "warn",
      message:
        "Set X-Content-Type-Options: nosniff to reduce MIME confusion attacks.",
    });
  }

  const frameOk = hasFrameProtection(h, csp);
  if (frameOk) {
    checks.push({
      id: "frame",
      title: "Clickjacking protection",
      status: "pass",
      message:
        "X-Frame-Options and/or CSP frame-ancestors limits framing.",
    });
  } else {
    checks.push({
      id: "frame",
      title: "Clickjacking protection",
      status: "fail",
      message:
        "No strong frame denial. Use CSP frame-ancestors 'none' or X-Frame-Options DENY/SAMEORIGIN as appropriate.",
    });
  }

  const ref = h.get("referrer-policy")?.trim();
  if (ref) {
    checks.push({
      id: "referrer",
      title: "Referrer-Policy",
      status: "pass",
      message: `Referrer-Policy is set (${ref.slice(0, 80)}${ref.length > 80 ? "…" : ""}).`,
    });
  } else {
    checks.push({
      id: "referrer",
      title: "Referrer-Policy",
      status: "warn",
      message:
        "Set Referrer-Policy (e.g. strict-origin-when-cross-origin) to control leakage in Referer.",
    });
  }

  const perm = h.get("permissions-policy") ?? h.get("feature-policy");
  if (perm?.trim()) {
    checks.push({
      id: "permissions",
      title: "Permissions-Policy",
      status: "pass",
      message: "Permissions-Policy / Feature-Policy present — review for least privilege.",
    });
  } else {
    checks.push({
      id: "permissions",
      title: "Permissions-Policy",
      status: "info",
      message:
        "No Permissions-Policy — optionally restrict powerful features (camera, geolocation, etc.).",
    });
  }

  const coop = h.get("cross-origin-opener-policy")?.trim();
  if (coop) {
    checks.push({
      id: "coop",
      title: "Cross-Origin-Opener-Policy",
      status: "pass",
      message: `COOP is set (${coop}) — helps isolate browsing context.`,
    });
  } else {
    checks.push({
      id: "coop",
      title: "Cross-Origin-Opener-Policy",
      status: "info",
      message:
        "COOP not set — consider same-origin or same-origin-allow-popups for sensitive apps.",
    });
  }

  const corp = h.get("cross-origin-resource-policy")?.trim();
  if (corp) {
    checks.push({
      id: "corp",
      title: "Cross-Origin-Resource-Policy",
      status: "info",
      message: `CORP is set (${corp}) — clarifies cross-origin embedding rules for this resource.`,
    });
  } else {
    checks.push({
      id: "corp",
      title: "Cross-Origin-Resource-Policy",
      status: "info",
      message:
        "CORP not set — optional; use same-origin or cross-origin as appropriate for APIs and static assets.",
    });
  }

  const powered = h.get("x-powered-by");
  const server = h.get("server");
  if (powered || (server && /^\s*[\d.]+\s*$/i.test(server) === false)) {
    checks.push({
      id: "fingerprint",
      title: "Server fingerprint",
      status: "info",
      message:
        "X-Powered-By or a verbose Server header may aid attackers — remove or genericize in production.",
    });
  }

  if (h.has("x-xss-protection")) {
    checks.push({
      id: "xxss",
      title: "X-XSS-Protection",
      status: "info",
      message:
        "Legacy X-XSS-Protection header present — modern mitigations rely on CSP; this header is deprecated in most browsers.",
    });
  }

  let score = 0;
  const add = (
    id: string,
    pass: number,
    warn: number,
    fail: number,
    info: number,
  ) => {
    const c = checks.find((x) => x.id === id);
    if (!c) return;
    if (c.status === "pass") score += pass;
    else if (c.status === "warn") score += warn;
    else if (c.status === "fail") score += fail;
    else score += info;
  };

  /* Weights sum to 100 when all critical checks pass */
  add("https", 15, 0, 0, 10);
  add("hsts", 15, 8, 0, 2);
  add("csp", 20, 10, 0, 0);
  add("xcto", 10, 5, 0, 0);
  add("frame", 20, 0, 0, 0);
  add("referrer", 10, 5, 0, 0);
  add("permissions", 5, 0, 0, 2);
  add("coop", 5, 0, 0, 2);
  add("corp", 0, 0, 0, 0);
  add("fingerprint", 0, 0, 0, 0);
  add("xxss", 0, 0, 0, 0);

  if (!isHttps && mode === "url") score = Math.min(score, 35);

  score = Math.round(Math.min(100, Math.max(0, score)));

  let grade: SecurityHeadersAnalysis["grade"] = "F";
  if (score >= 90) grade = "A";
  else if (score >= 78) grade = "B";
  else if (score >= 62) grade = "C";
  else if (score >= 42) grade = "D";

  const summary =
    status >= 400
      ? `HTTP ${status}: headers were returned, but the response indicates an error — hardening checks still apply to whatever the origin emitted.`
      : `Overall score ${score}/100 (grade ${grade}). Use the checklist below to close gaps and re-scan after deployment.`;

  return { score, grade, summary, checks };
}

export function buildSecurityReportMarkdown(input: {
  finalUrl: string;
  status: number;
  statusText?: string;
  analysis: SecurityHeadersAnalysis;
  headers: HeaderRow[];
}): string {
  const lines: string[] = [];
  lines.push(`# Security headers report`);
  lines.push("");
  lines.push(`- **URL:** ${input.finalUrl}`);
  lines.push(`- **Status:** ${input.status}${input.statusText ? ` ${input.statusText}` : ""}`);
  lines.push(`- **Score:** ${input.analysis.score}/100 (grade ${input.analysis.grade})`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push(input.analysis.summary);
  lines.push("");
  lines.push(`## Checks`);
  for (const c of input.analysis.checks) {
    lines.push(`- **${c.title}** (${c.status}): ${c.message}`);
  }
  lines.push("");
  lines.push(`## Raw headers (${input.headers.length})`);
  for (const row of input.headers) {
    lines.push(`${row.name}: ${row.value}`);
  }
  return lines.join("\n");
}
