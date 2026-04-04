/**
 * Pure builders for robots.txt (REP / RFC 9309–style path rules).
 * Output is plain text suitable for /robots.txt at the site root.
 */

export type RobotsDirective = "Allow" | "Disallow";

export type RobotsRuleRow = {
  directive: RobotsDirective;
  /** Path prefix; empty string is valid for Disallow (allow all) or Allow. */
  path: string;
};

export type RobotsUserAgentBlock = {
  userAgent: string;
  rules: RobotsRuleRow[];
  /** Seconds; Google ignores this—include only if you rely on a bot that reads it. */
  crawlDelay: string;
};

export type RobotsGeneratorState = {
  /** Optional comment block at top (one line per row; # added if missing). */
  commentBlock: string;
  blocks: RobotsUserAgentBlock[];
  sitemaps: string[];
};

export const DEFAULT_ROBOTS_STATE: RobotsGeneratorState = {
  commentBlock: "",
  blocks: [
    {
      userAgent: "*",
      rules: [{ directive: "Disallow", path: "" }],
      crawlDelay: "",
    },
  ],
  sitemaps: [],
};

function normalizePathForOutput(path: string): string {
  const t = path.trim();
  if (t === "") return "";
  if (t.startsWith("/")) return t;
  return `/${t}`;
}

export function buildRobotsTxtContent(state: RobotsGeneratorState): string {
  const out: string[] = [];

  const rawComment = state.commentBlock.trim();
  if (rawComment) {
    for (const line of rawComment.split(/\r?\n/)) {
      const s = line.trimEnd();
      if (!s.trim()) {
        out.push("");
        continue;
      }
      out.push(s.startsWith("#") ? s : `# ${s}`);
    }
    out.push("");
  }

  for (let i = 0; i < state.blocks.length; i++) {
    const b = state.blocks[i];
    const ua = b.userAgent.trim() || "*";
    out.push(`User-agent: ${ua}`);
    for (const r of b.rules) {
      const p = normalizePathForOutput(r.path);
      out.push(`${r.directive}: ${p}`);
    }
    const cd = b.crawlDelay.trim();
    if (cd) {
      out.push(`Crawl-delay: ${cd}`);
    }
    if (i < state.blocks.length - 1) {
      out.push("");
    }
  }

  const sm = state.sitemaps.map((s) => s.trim()).filter(Boolean);
  if (sm.length > 0) {
    out.push("");
    for (const url of sm) {
      out.push(`Sitemap: ${url}`);
    }
  }

  let text = out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
  if (!text.endsWith("\n")) text += "\n";
  return text;
}

export function presetAllowAll(): RobotsGeneratorState {
  return {
    commentBlock: "",
    blocks: [
      {
        userAgent: "*",
        rules: [{ directive: "Disallow", path: "" }],
        crawlDelay: "",
      },
    ],
    sitemaps: [],
  };
}

export function presetBlockAll(): RobotsGeneratorState {
  return {
    commentBlock: "",
    blocks: [
      {
        userAgent: "*",
        rules: [{ directive: "Disallow", path: "/" }],
        crawlDelay: "",
      },
    ],
    sitemaps: [],
  };
}

/** Typical WordPress: block admin and sensitive dirs; allow AJAX endpoint. */
export function presetWordPress(): RobotsGeneratorState {
  return {
    commentBlock: "WordPress-oriented starter — adjust for your theme and plugins.",
    blocks: [
      {
        userAgent: "*",
        rules: [
          { directive: "Disallow", path: "/wp-admin/" },
          { directive: "Allow", path: "/wp-admin/admin-ajax.php" },
          { directive: "Disallow", path: "/wp-content/plugins/" },
          { directive: "Disallow", path: "/wp-content/uploads/private/" },
          { directive: "Disallow", path: "/readme.html" },
          { directive: "Disallow", path: "/license.txt" },
        ],
        crawlDelay: "",
      },
    ],
    sitemaps: [],
  };
}

/** Block staging from generic bots; allow Googlebot (common migration pattern). */
export function presetStagingAllowGoogle(): RobotsGeneratorState {
  return {
    commentBlock:
      "Staging pattern: verify policies for your org—some teams disallow all bots on staging.",
    blocks: [
      {
        userAgent: "Googlebot",
        rules: [{ directive: "Allow", path: "/" }],
        crawlDelay: "",
      },
      {
        userAgent: "*",
        rules: [{ directive: "Disallow", path: "/" }],
        crawlDelay: "",
      },
    ],
    sitemaps: [],
  };
}
