export type DirectiveId =
  | "defaultSrc"
  | "scriptSrc"
  | "styleSrc"
  | "imgSrc"
  | "fontSrc"
  | "connectSrc"
  | "frameSrc"
  | "objectSrc"
  | "mediaSrc"
  | "workerSrc"
  | "manifestSrc"
  | "baseUri"
  | "formAction"
  | "frameAncestors"
  | "reportUri"
  | "reportTo"
  | "upgradeInsecureRequests"
  | "blockAllMixedContent";

export type DirectiveRow = {
  enabled: boolean;
  /** Space-separated sources, or empty for flags when enabled */
  sources: string;
};

export type CspBuilderState = {
  directives: Record<DirectiveId, DirectiveRow>;
  /** Semicolon-separated extra directives (advanced) */
  extraDirectives: string;
};

export const DIRECTIVE_DEFS: {
  id: DirectiveId;
  cspName: string;
  label: string;
  description: string;
  type: "sources" | "flag";
  placeholder?: string;
}[] = [
  {
    id: "defaultSrc",
    cspName: "default-src",
    label: "default-src",
    description:
      "Fallback for other fetch directives when they are not specified.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "scriptSrc",
    cspName: "script-src",
    label: "script-src",
    description: "Where scripts may be loaded and executed from.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "styleSrc",
    cspName: "style-src",
    label: "style-src",
    description: "Stylesheets and inline style sources.",
    type: "sources",
    placeholder: "'self' 'unsafe-inline'",
  },
  {
    id: "imgSrc",
    cspName: "img-src",
    label: "img-src",
    description: "Images and image-like content.",
    type: "sources",
    placeholder: "'self' data: https:",
  },
  {
    id: "fontSrc",
    cspName: "font-src",
    label: "font-src",
    description: "Web fonts (@font-face).",
    type: "sources",
    placeholder: "'self' data:",
  },
  {
    id: "connectSrc",
    cspName: "connect-src",
    label: "connect-src",
    description: "XHR, fetch, WebSocket, EventSource, etc.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "frameSrc",
    cspName: "frame-src",
    label: "frame-src",
    description: "Nested browsing contexts (frames, iframes, workers in some cases).",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "objectSrc",
    cspName: "object-src",
    label: "object-src",
    description: "Plugins and legacy object/embed tags—often set to 'none'.",
    type: "sources",
    placeholder: "'none'",
  },
  {
    id: "mediaSrc",
    cspName: "media-src",
    label: "media-src",
    description: "Audio and video elements.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "workerSrc",
    cspName: "worker-src",
    label: "worker-src",
    description: "Dedicated workers and shared workers.",
    type: "sources",
    placeholder: "'self' blob:",
  },
  {
    id: "manifestSrc",
    cspName: "manifest-src",
    label: "manifest-src",
    description: "Web app manifest files.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "baseUri",
    cspName: "base-uri",
    label: "base-uri",
    description: "Restricts URLs that can be used in a document base element.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "formAction",
    cspName: "form-action",
    label: "form-action",
    description: "URLs form submissions may target.",
    type: "sources",
    placeholder: "'self'",
  },
  {
    id: "frameAncestors",
    cspName: "frame-ancestors",
    label: "frame-ancestors",
    description:
      "Who may embed this page—use 'none' or specific origins instead of X-Frame-Options alone.",
    type: "sources",
    placeholder: "'none'",
  },
  {
    id: "reportUri",
    cspName: "report-uri",
    label: "report-uri",
    description: "Legacy reporting endpoint for violations (prefer report-to when possible).",
    type: "sources",
    placeholder: "https://example.com/csp-report",
  },
  {
    id: "reportTo",
    cspName: "report-to",
    label: "report-to",
    description:
      "Names a Reporting API endpoint group—often paired with a Report-To header.",
    type: "sources",
    placeholder: "csp-endpoint",
  },
  {
    id: "upgradeInsecureRequests",
    cspName: "upgrade-insecure-requests",
    label: "upgrade-insecure-requests",
    description:
      "Automatically upgrade insecure HTTP subresource requests to HTTPS.",
    type: "flag",
  },
  {
    id: "blockAllMixedContent",
    cspName: "block-all-mixed-content",
    label: "block-all-mixed-content",
    description:
      "Blocks mixed content (deprecated in favor of stricter defaults but still seen in policies).",
    type: "flag",
  },
];

const NAME_TO_ID = new Map<string, DirectiveId>(
  DIRECTIVE_DEFS.map((d) => [d.cspName.toLowerCase(), d.id]),
);

export const DEFAULT_CSP_STATE: CspBuilderState = {
  directives: {
    defaultSrc: { enabled: true, sources: "'self'" },
    scriptSrc: { enabled: false, sources: "'self'" },
    styleSrc: { enabled: false, sources: "'self' 'unsafe-inline'" },
    imgSrc: { enabled: false, sources: "'self' data: https:" },
    fontSrc: { enabled: false, sources: "'self' data:" },
    connectSrc: { enabled: false, sources: "'self'" },
    frameSrc: { enabled: false, sources: "'self'" },
    objectSrc: { enabled: false, sources: "'none'" },
    mediaSrc: { enabled: false, sources: "'self'" },
    workerSrc: { enabled: false, sources: "'self'" },
    manifestSrc: { enabled: false, sources: "'self'" },
    baseUri: { enabled: false, sources: "'self'" },
    formAction: { enabled: false, sources: "'self'" },
    frameAncestors: { enabled: false, sources: "'none'" },
    reportUri: { enabled: false, sources: "" },
    reportTo: { enabled: false, sources: "" },
    upgradeInsecureRequests: { enabled: false, sources: "" },
    blockAllMixedContent: { enabled: false, sources: "" },
  },
  extraDirectives: "",
};

export function buildCspPolicyValue(state: CspBuilderState): string {
  const parts: string[] = [];

  for (const def of DIRECTIVE_DEFS) {
    const row = state.directives[def.id];
    if (!row.enabled) continue;

    if (def.type === "flag") {
      parts.push(def.cspName);
      continue;
    }

    const v = row.sources.trim().replace(/\s+/g, " ");
    if (v) {
      parts.push(`${def.cspName} ${v}`);
    }
  }

  const extra = state.extraDirectives.trim();
  if (extra) {
    for (const seg of extra.split(";")) {
      const s = seg.trim();
      if (s) parts.push(s);
    }
  }

  return parts.join("; ");
}

export type CspPreset = {
  id: string;
  label: string;
  description: string;
  state: CspBuilderState;
};

export const CSP_PRESETS: CspPreset[] = [
  {
    id: "self-only",
    label: "Default 'self'",
    description: "Single default-src for a locked-down starting point.",
    state: {
      ...DEFAULT_CSP_STATE,
      directives: {
        ...DEFAULT_CSP_STATE.directives,
        defaultSrc: { enabled: true, sources: "'self'" },
      },
      extraDirectives: "",
    },
  },
  {
    id: "typical-spa",
    label: "Typical SPA",
    description:
      "Common split directives with inline styles—tighten script-src for production.",
    state: {
      directives: {
        ...DEFAULT_CSP_STATE.directives,
        defaultSrc: { enabled: true, sources: "'self'" },
        scriptSrc: { enabled: true, sources: "'self'" },
        styleSrc: { enabled: true, sources: "'self' 'unsafe-inline'" },
        imgSrc: { enabled: true, sources: "'self' data: https:" },
        fontSrc: { enabled: true, sources: "'self' data:" },
        connectSrc: { enabled: true, sources: "'self'" },
        frameAncestors: { enabled: true, sources: "'none'" },
        objectSrc: { enabled: true, sources: "'none'" },
        baseUri: { enabled: true, sources: "'self'" },
        formAction: { enabled: true, sources: "'self'" },
      },
      extraDirectives: "",
    },
  },
  {
    id: "strict-no-inline-script",
    label: "Stricter scripts",
    description:
      "No inline script keywords—pair with nonces or hashes in production.",
    state: {
      directives: {
        ...DEFAULT_CSP_STATE.directives,
        defaultSrc: { enabled: true, sources: "'none'" },
        scriptSrc: { enabled: true, sources: "'self'" },
        styleSrc: { enabled: true, sources: "'self' 'unsafe-inline'" },
        imgSrc: { enabled: true, sources: "'self' data: https:" },
        fontSrc: { enabled: true, sources: "'self' data:" },
        connectSrc: { enabled: true, sources: "'self'" },
        frameAncestors: { enabled: true, sources: "'none'" },
        objectSrc: { enabled: true, sources: "'none'" },
        baseUri: { enabled: true, sources: "'self'" },
        formAction: { enabled: true, sources: "'self'" },
        upgradeInsecureRequests: { enabled: true, sources: "" },
      },
      extraDirectives: "",
    },
  },
  {
    id: "report-only-baseline",
    label: "Report-only baseline",
    description:
      "Same as Typical SPA—use with Content-Security-Policy-Report-Only first.",
    state: {
      directives: {
        ...DEFAULT_CSP_STATE.directives,
        defaultSrc: { enabled: true, sources: "'self'" },
        scriptSrc: { enabled: true, sources: "'self'" },
        styleSrc: { enabled: true, sources: "'self' 'unsafe-inline'" },
        imgSrc: { enabled: true, sources: "'self' data: https:" },
        fontSrc: { enabled: true, sources: "'self' data:" },
        connectSrc: { enabled: true, sources: "'self'" },
        frameAncestors: { enabled: true, sources: "'none'" },
        objectSrc: { enabled: true, sources: "'none'" },
        baseUri: { enabled: true, sources: "'self'" },
        formAction: { enabled: true, sources: "'self'" },
      },
      extraDirectives: "",
    },
  },
];

/**
 * Best-effort parse of a CSP string (from a header, meta tag, or text file).
 * Unknown directives are appended to extraDirectives.
 */
export function parseCspPolicyString(raw: string): CspBuilderState {
  const base: CspBuilderState = {
    directives: {
      ...DEFAULT_CSP_STATE.directives,
    },
    extraDirectives: "",
  };

  let text = raw.trim();
  const headerMatch = text.match(
    /^\s*content-security-policy(?:-report-only)?\s*:\s*(.+)$/i,
  );
  if (headerMatch) {
    text = headerMatch[1].trim();
  }

  const metaMatch = text.match(
    /^\s*http-equiv\s*=\s*["']?content-security-policy["']?\s+content\s*=\s*["'](.+)["']\s*$/i,
  );
  if (metaMatch) {
    text = metaMatch[1].trim();
  }

  const unknown: string[] = [];

  for (const seg of text.split(";")) {
    const part = seg.trim();
    if (!part) continue;

    const spaceIdx = part.search(/\s/);
    let name: string;
    let rest = "";
    if (spaceIdx === -1) {
      name = part;
    } else {
      name = part.slice(0, spaceIdx).trim();
      rest = part.slice(spaceIdx + 1).trim();
    }

    const lower = name.toLowerCase();
    const id = NAME_TO_ID.get(lower);

    if (id) {
      const def = DIRECTIVE_DEFS.find((d) => d.id === id)!;
      if (def.type === "flag") {
        base.directives[id] = { enabled: true, sources: "" };
      } else {
        base.directives[id] = { enabled: true, sources: rest };
      }
    } else {
      unknown.push(part);
    }
  }

  if (unknown.length) {
    base.extraDirectives = unknown.join("; ");
  }

  return base;
}
