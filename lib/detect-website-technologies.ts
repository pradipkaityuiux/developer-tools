export type TechnologyCategory =
  | "cms"
  | "framework"
  | "cdn"
  | "analytics"
  | "marketing"
  | "ecommerce"
  | "fonts"
  | "security"
  | "other";

export type TechnologyHit = {
  name: string;
  category: TechnologyCategory;
  confidence: "high" | "medium" | "low";
  evidence: string;
};

export type TechnologyDetectionResult = {
  generatorMeta: string | null;
  serverHeader: string | null;
  hits: TechnologyHit[];
};

const CATEGORY_ORDER: TechnologyCategory[] = [
  "cms",
  "framework",
  "cdn",
  "analytics",
  "marketing",
  "ecommerce",
  "fonts",
  "security",
  "other",
];

function extractGeneratorMeta(html: string): string | null {
  const re =
    /<meta\s+[^>]*name\s*=\s*["']generator["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i;
  const re2 =
    /<meta\s+[^>]*content\s*=\s*["']([^"']+)["'][^>]*name\s*=\s*["']generator["'][^>]*>/i;
  const m = html.match(re) ?? html.match(re2);
  return m?.[1]?.trim() || null;
}

type HeaderMap = Map<string, string>;

function getHeader(headers: HeaderMap, name: string): string | null {
  return headers.get(name.toLowerCase()) ?? null;
}

function addHit(
  hits: TechnologyHit[],
  seen: Set<string>,
  hit: TechnologyHit,
) {
  const key = `${hit.category}:${hit.name.toLowerCase()}`;
  if (seen.has(key)) return;
  seen.add(key);
  hits.push(hit);
}

function matchHtml(
  htmlLower: string,
  patterns: string[],
): { matched: boolean; evidence: string } {
  for (const p of patterns) {
    if (htmlLower.includes(p)) {
      return { matched: true, evidence: `HTML contains “${p}”` };
    }
  }
  return { matched: false, evidence: "" };
}

export function detectWebsiteTechnologies(
  html: string,
  headerPairs: { name: string; value: string }[],
  _finalUrl: string,
): TechnologyDetectionResult {
  const htmlLower = html.toLowerCase();
  const headers = new Map<string, string>();
  for (const { name, value } of headerPairs) {
    headers.set(name.toLowerCase(), value);
  }

  const hits: TechnologyHit[] = [];
  const seen = new Set<string>();

  const generatorMeta = extractGeneratorMeta(html);
  if (generatorMeta) {
    const g = generatorMeta.toLowerCase();
    if (g.includes("wordpress")) {
      addHit(hits, seen, {
        name: "WordPress",
        category: "cms",
        confidence: "high",
        evidence: `Meta generator: ${generatorMeta}`,
      });
    } else if (g.includes("drupal")) {
      addHit(hits, seen, {
        name: "Drupal",
        category: "cms",
        confidence: "high",
        evidence: `Meta generator: ${generatorMeta}`,
      });
    } else if (g.includes("joomla")) {
      addHit(hits, seen, {
        name: "Joomla",
        category: "cms",
        confidence: "high",
        evidence: `Meta generator: ${generatorMeta}`,
      });
    } else if (g.includes("ghost")) {
      addHit(hits, seen, {
        name: "Ghost",
        category: "cms",
        confidence: "high",
        evidence: `Meta generator: ${generatorMeta}`,
      });
    } else if (g.includes("shopify")) {
      addHit(hits, seen, {
        name: "Shopify",
        category: "cms",
        confidence: "high",
        evidence: `Meta generator: ${generatorMeta}`,
      });
    } else {
      addHit(hits, seen, {
        name: `Generator: ${generatorMeta.slice(0, 120)}${generatorMeta.length > 120 ? "…" : ""}`,
        category: "other",
        confidence: "medium",
        evidence: "Meta name=generator",
      });
    }
  }

  const server = getHeader(headers, "server");
  const poweredBy = getHeader(headers, "x-powered-by");
  const via = getHeader(headers, "via");

  if (server) {
    const s = server.toLowerCase();
    if (s.includes("cloudflare")) {
      addHit(hits, seen, {
        name: "Cloudflare",
        category: "cdn",
        confidence: "high",
        evidence: `Server: ${server}`,
      });
    }
    if (s.includes("nginx")) {
      addHit(hits, seen, {
        name: "nginx",
        category: "other",
        confidence: "medium",
        evidence: `Server: ${server}`,
      });
    }
    if (s.includes("apache")) {
      addHit(hits, seen, {
        name: "Apache",
        category: "other",
        confidence: "medium",
        evidence: `Server: ${server}`,
      });
    }
    if (s.includes("microsoft-iis") || s.includes("iis/")) {
      addHit(hits, seen, {
        name: "Microsoft IIS",
        category: "other",
        confidence: "medium",
        evidence: `Server: ${server}`,
      });
    }
  }

  if (poweredBy) {
    const p = poweredBy.toLowerCase();
    if (p.includes("php")) {
      addHit(hits, seen, {
        name: "PHP (X-Powered-By)",
        category: "other",
        confidence: "medium",
        evidence: `X-Powered-By: ${poweredBy}`,
      });
    }
    if (p.includes("express")) {
      addHit(hits, seen, {
        name: "Express",
        category: "framework",
        confidence: "medium",
        evidence: `X-Powered-By: ${poweredBy}`,
      });
    }
    if (p.includes("asp.net")) {
      addHit(hits, seen, {
        name: "ASP.NET",
        category: "framework",
        confidence: "medium",
        evidence: `X-Powered-By: ${poweredBy}`,
      });
    }
  }

  if (via && via.toLowerCase().includes("varnish")) {
    addHit(hits, seen, {
      name: "Varnish",
      category: "cdn",
      confidence: "medium",
      evidence: `Via: ${via}`,
    });
  }

  if (getHeader(headers, "cf-ray")) {
    addHit(hits, seen, {
      name: "Cloudflare (CF-Ray)",
      category: "cdn",
      confidence: "high",
      evidence: "CF-Ray response header present",
    });
  }

  if (getHeader(headers, "x-vercel-id")) {
    addHit(hits, seen, {
      name: "Vercel",
      category: "cdn",
      confidence: "high",
      evidence: "x-vercel-id header present",
    });
  }

  if (getHeader(headers, "x-nf-request-id")) {
    addHit(hits, seen, {
      name: "Netlify",
      category: "cdn",
      confidence: "high",
      evidence: "x-nf-request-id header present",
    });
  }

  const servedBy = getHeader(headers, "x-served-by") ?? "";
  if (servedBy.toLowerCase().includes("fastly")) {
    addHit(hits, seen, {
      name: "Fastly",
      category: "cdn",
      confidence: "high",
      evidence: `x-served-by: ${servedBy}`,
    });
  }

  if (getHeader(headers, "x-shopify-stage") || getHeader(headers, "x-shopid")) {
    addHit(hits, seen, {
      name: "Shopify (headers)",
      category: "cms",
      confidence: "high",
      evidence: "Shopify-specific response headers",
    });
  }

  const htmlChecks: Array<{
    name: string;
    category: TechnologyCategory;
    confidence: TechnologyHit["confidence"];
    patterns: string[];
  }> = [
    {
      name: "WordPress",
      category: "cms",
      confidence: "high",
      patterns: ["/wp-content/", "/wp-includes/", "wp-json"],
    },
    {
      name: "Next.js",
      category: "framework",
      confidence: "high",
      patterns: ["__next_f", "__next_data__", "/_next/static/"],
    },
    {
      name: "React (heuristic)",
      category: "framework",
      confidence: "low",
      patterns: ["reactroot", "data-reactroot"],
    },
    {
      name: "Vue.js (heuristic)",
      category: "framework",
      confidence: "low",
      patterns: ["data-v-", "__vue__"],
    },
    {
      name: "Nuxt",
      category: "framework",
      confidence: "medium",
      patterns: ["__nuxt", "/_nuxt/"],
    },
    {
      name: "Svelte / SvelteKit (heuristic)",
      category: "framework",
      confidence: "low",
      patterns: ["svelte-", "__sveltekit"],
    },
    {
      name: "Angular (heuristic)",
      category: "framework",
      confidence: "low",
      patterns: ["ng-version", "ng-app"],
    },
    {
      name: "Gatsby",
      category: "framework",
      confidence: "medium",
      patterns: ["___gatsby", "gatsby-browser", "gatsby-script"],
    },
    {
      name: "Astro (heuristic)",
      category: "framework",
      confidence: "low",
      patterns: ["astro-", "is:inline"],
    },
    {
      name: "Shopify storefront",
      category: "cms",
      confidence: "high",
      patterns: ["cdn.shopify.com", "shopify.theme", "shopifycdn.com"],
    },
    {
      name: "Wix",
      category: "cms",
      confidence: "high",
      patterns: ["wix.com", "parastorage.com", "_wix_browser_sess"],
    },
    {
      name: "Squarespace",
      category: "cms",
      confidence: "high",
      patterns: ["squarespace-cdn", "static1.squarespace"],
    },
    {
      name: "Webflow",
      category: "cms",
      confidence: "high",
      patterns: ["webflow.com", "data-wf-domain", "w-webflow-badge"],
    },
    {
      name: "Drupal",
      category: "cms",
      confidence: "medium",
      patterns: ["/sites/default/files", "drupal.settings"],
    },
    {
      name: "Joomla",
      category: "cms",
      confidence: "medium",
      patterns: ["/media/jui/", "joomla.scriptoptions"],
    },
    {
      name: "Magento / Adobe Commerce",
      category: "cms",
      confidence: "medium",
      patterns: ["mage/cookies", "magento", "x-magento-"],
    },
    {
      name: "BigCommerce",
      category: "cms",
      confidence: "medium",
      patterns: ["bigcommerce.com", "stencil-utils"],
    },
    {
      name: "Google Tag Manager",
      category: "analytics",
      confidence: "high",
      patterns: ["googletagmanager.com/gtm.js", "googletagmanager.com/ns.html"],
    },
    {
      name: "Google Analytics (gtag.js / GA4)",
      category: "analytics",
      confidence: "high",
      patterns: ["googletagmanager.com/gtag", "gtag('config'", "gtag(\"config\""],
    },
    {
      name: "Google Analytics (legacy UA)",
      category: "analytics",
      confidence: "medium",
      patterns: ["google-analytics.com/analytics.js", "ua-", "www.google-analytics.com/ga.js"],
    },
    {
      name: "Facebook / Meta Pixel",
      category: "analytics",
      confidence: "high",
      patterns: ["connect.facebook.net", "fbevents.js", "fbq("],
    },
    {
      name: "Hotjar",
      category: "analytics",
      confidence: "high",
      patterns: ["static.hotjar.com", "hjid", "hotjar"],
    },
    {
      name: "Microsoft Clarity",
      category: "analytics",
      confidence: "high",
      patterns: ["clarity.ms", "clarity("],
    },
    {
      name: "Plausible Analytics",
      category: "analytics",
      confidence: "high",
      patterns: ["plausible.io/js", "data-domain"],
    },
    {
      name: "Matomo / Piwik",
      category: "analytics",
      confidence: "high",
      patterns: ["matomo.js", "piwik.js", "matomo.php"],
    },
    {
      name: "Segment",
      category: "analytics",
      confidence: "medium",
      patterns: ["cdn.segment.com", "analytics.min.js"],
    },
    {
      name: "Mixpanel",
      category: "analytics",
      confidence: "medium",
      patterns: ["cdn.mxpnl.com", "mixpanel"],
    },
    {
      name: "HubSpot",
      category: "marketing",
      confidence: "high",
      patterns: ["js.hs-scripts.com", "js.hsforms.net", "hubspot"],
    },
    {
      name: "Intercom",
      category: "marketing",
      confidence: "high",
      patterns: ["widget.intercom.io", "intercomsettings"],
    },
    {
      name: "Zendesk",
      category: "marketing",
      confidence: "medium",
      patterns: ["zendesk.com/embeddable", "zdassets.com"],
    },
    {
      name: "Crisp",
      category: "marketing",
      confidence: "high",
      patterns: ["client.crisp.chat", "$crisp"],
    },
    {
      name: "Drift",
      category: "marketing",
      confidence: "medium",
      patterns: ["js.driftt.com", "drift"],
    },
    {
      name: "Stripe",
      category: "ecommerce",
      confidence: "high",
      patterns: ["js.stripe.com", "stripe.com/v3"],
    },
    {
      name: "PayPal",
      category: "ecommerce",
      confidence: "medium",
      patterns: ["paypal.com/sdk", "paypalobjects.com"],
    },
    {
      name: "Google Fonts",
      category: "fonts",
      confidence: "high",
      patterns: ["fonts.googleapis.com", "fonts.gstatic.com"],
    },
    {
      name: "Adobe Fonts (Typekit)",
      category: "fonts",
      confidence: "medium",
      patterns: ["use.typekit.net", "typekit"],
    },
    {
      name: "reCAPTCHA",
      category: "security",
      confidence: "high",
      patterns: ["google.com/recaptcha", "grecaptcha"],
    },
    {
      name: "hCaptcha",
      category: "security",
      confidence: "high",
      patterns: ["hcaptcha.com", "hcaptcha"],
    },
    {
      name: "CloudFront (heuristic)",
      category: "cdn",
      confidence: "low",
      patterns: ["cloudfront.net"],
    },
    {
      name: "jsDelivr",
      category: "cdn",
      confidence: "medium",
      patterns: ["cdn.jsdelivr.net"],
    },
    {
      name: "unpkg",
      category: "cdn",
      confidence: "medium",
      patterns: ["unpkg.com"],
    },
    {
      name: "cdnjs",
      category: "cdn",
      confidence: "medium",
      patterns: ["cdnjs.cloudflare.com"],
    },
  ];

  for (const check of htmlChecks) {
    const { matched, evidence } = matchHtml(htmlLower, check.patterns);
    if (matched) {
      addHit(hits, seen, {
        name: check.name,
        category: check.category,
        confidence: check.confidence,
        evidence,
      });
    }
  }

  hits.sort((a, b) => {
    const ci = CATEGORY_ORDER.indexOf(a.category);
    const cj = CATEGORY_ORDER.indexOf(b.category);
    if (ci !== cj) return ci - cj;
    const confOrder = { high: 0, medium: 1, low: 2 };
    if (confOrder[a.confidence] !== confOrder[b.confidence]) {
      return confOrder[a.confidence] - confOrder[b.confidence];
    }
    return a.name.localeCompare(b.name);
  });

  return {
    generatorMeta,
    serverHeader: server,
    hits,
  };
}
