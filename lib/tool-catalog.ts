export type ToolEntry = {
  name: string;
  href: string;
  description: string;
  icon?: string;
};

export type ToolSection = {
  id: string;
  title: string;
  tools: ToolEntry[];
};

export const toolSections: ToolSection[] = [
  {
    id: "website-url-tools",
    title: "Website & URL Tools",
    tools: [
      {
        name: "Broken Link Checker",
        href: "/website/broken-link-checker",
        icon: "Unlink",
        description:
          "Scan outbound links from any URL for 404s and broken hrefs—paste a page and audit links in seconds.",
      },
      {
        name: "HTTP Header Checker",
        href: "/website/http-header-checker",
        icon: "Heading",
        description:
          "Inspect HTTP response headers for any URL: cache control, content-type, CORS, and security-related values.",
      },
      {
        name: "Redirect Chain Checker",
        href: "/website/redirect-chain-checker",
        icon: "CornerDownRight",
        description:
          "Trace the full redirect path to the final URL and spot unnecessary hops hurting SEO and performance.",
      },
      {
        name: "SSL Certificate Checker",
        href: "/website/ssl-certificate-checker",
        icon: "ShieldCheck",
        description:
          "Verify TLS certificate validity, expiry, issuer, and chain for any domain before users hit errors.",
      },
      {
        name: "DNS Lookup Tool",
        href: "/website/dns-lookup",
        icon: "Globe",
        description:
          "Query A, AAAA, MX, CNAME, TXT, NS, and SOA records for troubleshooting email, hosting, and DNS.",
      },
      {
        name: "WHOIS Lookup",
        href: "/website/whois-lookup",
        icon: "UserCheck",
        description:
          "Look up domain registration details: registrar, dates, and status for research and due diligence.",
      },
      {
        name: "IP Address Lookup",
        href: "/website/ip-lookup",
        icon: "MapPin",
        description:
          "Resolve IPv4 or IPv6 to geolocation, ISP, ASN, and hostname for network and fraud analysis.",
      },
      {
        name: "Domain Age Checker",
        href: "/website/domain-age-checker",
        icon: "Hourglass",
        description:
          "See how long a domain has been registered—useful for SEO trust signals and quick vetting.",
      },
      {
        name: "Robots.txt Checker",
        href: "/website/robots-txt-checker",
        icon: "Bot",
        description:
          "Fetch and review robots.txt rules, directives, and sitemap lines to catch crawler misconfiguration.",
      },
      {
        name: "Meta Tags Extractor",
        href: "/website/meta-tags-extractor",
        icon: "Tags",
        description:
          "Extract title, meta description, Open Graph, Twitter Card, and canonical tags from any live URL.",
      },
      {
        name: "Open Graph Preview",
        href: "/website/open-graph-preview",
        icon: "Share2",
        description:
          "Preview how a link may appear when shared on social networks before you publish or pitch.",
      },
      {
        name: "Website Technology Detector",
        href: "/website/technology-detector",
        icon: "Cpu",
        description:
          "Detect CMS, frameworks, analytics, CDNs, and common scripts used on a site—great for competitive research.",
      },
      {
        name: "Canonical Tag Checker",
        href: "/website/canonical-tag-checker",
        icon: "CheckCheck",
        description:
          "Confirm canonical tags, targets, and self-references to reduce duplicate-content SEO issues.",
      },
      {
        name: "Server Response Code Checker",
        href: "/website/response-code-checker",
        icon: "Activity",
        description:
          "Check HTTP status codes (200, 301, 404, 500, and more) for any URL in one request.",
      },
    ],
  },
  {
    id: "code-developer-tools",
    title: "Code & Developer Tools",
    tools: [
      {
        name: "JSON Formatter & Validator",
        href: "/dev/json-formatter",
        icon: "Braces",
        description:
          "Format, validate, minify, and explore JSON in a collapsible tree—fix payloads before they hit production.",
      },
      {
        name: "JSON to CSV Converter",
        href: "/dev/json-to-csv",
        icon: "FileSpreadsheet",
        description:
          "Turn JSON arrays into downloadable CSV with automatic column detection for spreadsheets and BI tools.",
      },
      {
        name: "JSON to YAML Converter",
        href: "/dev/json-to-yaml",
        icon: "FileCode2",
        description:
          "Convert JSON to readable YAML for configs and Kubernetes—copy or download the result.",
      },
      {
        name: "CSV to JSON Converter",
        href: "/dev/csv-to-json",
        icon: "FileJson",
        description:
          "Paste or upload CSV and get structured JSON with header-aware typing for APIs and apps.",
      },
      {
        name: "YAML to JSON Converter",
        href: "/dev/yaml-to-json",
        icon: "FileCode",
        description:
          "Parse YAML to valid JSON with clear errors—ideal for CI configs and cloud templates.",
      },
      {
        name: "XML Formatter & Validator",
        href: "/dev/xml-formatter",
        icon: "CodeXml",
        description:
          "Beautify and validate XML with structure insight and actionable parse errors.",
      },
      {
        name: "Regex Tester & Debugger",
        href: "/dev/regex-tester",
        icon: "Regex",
        description:
          "Test patterns live with highlights, capture groups, and flags—debug regex without leaving the browser.",
      },
      {
        name: "SQL Formatter",
        href: "/dev/sql-formatter",
        icon: "Database",
        description:
          "Pretty-print SQL with indentation and keyword casing for readable queries and code review.",
      },
      {
        name: "HTML Formatter & Minifier",
        href: "/dev/html-formatter",
        icon: "FileCode",
        description:
          "Beautify or minify HTML and compare raw markup with a quick rendered preview.",
      },
      {
        name: "CSS Formatter & Minifier",
        href: "/dev/css-formatter",
        icon: "Paintbrush",
        description:
          "Format messy stylesheets or minify CSS for faster loads—keep design tokens consistent.",
      },
      {
        name: "JavaScript Formatter & Minifier",
        href: "/dev/js-formatter",
        icon: "Zap",
        description:
          "Pretty-print or minify JavaScript for debugging locally and shipping smaller bundles.",
      },
      {
        name: "HTML to Markdown Converter",
        href: "/dev/html-to-markdown",
        icon: "FileDown",
        description:
          "Convert HTML snippets to Markdown for docs, CMS migrations, and README cleanup.",
      },
      {
        name: "Markdown to HTML Converter",
        href: "/dev/markdown-to-html",
        icon: "FileUp",
        description:
          "Turn Markdown into HTML with a live preview—handy for emails, blogs, and static pages.",
      },
      {
        name: "Code Diff Checker",
        href: "/dev/code-diff",
        icon: "GitCompare",
        description:
          "Compare two code blocks side by side with clear add/remove highlighting for reviews.",
      },
      {
        name: "JWT Decoder",
        href: "/dev/jwt-decoder",
        icon: "KeyRound",
        description:
          "Decode JWT header and payload and check expiry—signature verification not included, client-side safe.",
      },
      {
        name: "Base64 Encoder & Decoder",
        href: "/dev/base64",
        icon: "Binary",
        description:
          "Encode text or files to Base64 or decode strings back—common for APIs, data URIs, and debugging.",
      },
      {
        name: "URL Encoder & Decoder",
        href: "/dev/url-encoder",
        icon: "Percent",
        description:
          "Percent-encode query strings or decode encoded URLs for correct linking and parsing.",
      },
      {
        name: "Hash Generator",
        href: "/dev/hash-generator",
        icon: "Hash",
        description:
          "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any string for checksums and testing.",
      },
      {
        name: "UUID Generator",
        href: "/dev/uuid-generator",
        icon: "Fingerprint",
        description:
          "Create one or many UUID v4 values with copy-friendly output for databases and APIs.",
      },
      {
        name: "Cron Expression Generator",
        href: "/dev/cron-generator",
        icon: "Clock",
        description:
          "Build cron schedules with simple controls and see the human-readable meaning instantly.",
      },
      {
        name: "Cron Expression Explainer",
        href: "/dev/cron-explainer",
        icon: "CalendarClock",
        description:
          "Paste a cron string for plain-English explanation and the next scheduled run times.",
      },
      {
        name: "Unix Timestamp Converter",
        href: "/dev/unix-timestamp",
        icon: "Watch",
        description:
          "Convert Unix epoch seconds or milliseconds to local time and back—essential for logs and APIs.",
      },
      {
        name: "Number System Converter",
        href: "/dev/number-converter",
        icon: "Calculator",
        description:
          "Convert between binary, octal, decimal, and hexadecimal for low-level debugging and study.",
      },
      {
        name: ".gitignore Generator",
        href: "/dev/gitignore-generator",
        icon: "GitBranch",
        description:
          "Pick your stack and download a tailored .gitignore so secrets and build artifacts stay out of git.",
      },
      {
        name: "Password Generator",
        href: "/dev/password-generator",
        icon: "Lock",
        description:
          "Generate strong passwords with length and charset options—bulk mode for test accounts.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/dev/lorem-ipsum",
        icon: "Pilcrow",
        description:
          "Create placeholder paragraphs, sentences, or words with optional HTML wrapping for mockups.",
      },
      {
        name: "Dummy Data Generator",
        href: "/dev/dummy-data-generator",
        icon: "DatabaseBackup",
        description:
          "Produce fake names, emails, and addresses as JSON or CSV for fixtures and UI testing.",
      },
      {
        name: "HTML Entity Encoder & Decoder",
        href: "/dev/html-entities",
        icon: "Brackets",
        description:
          "Encode special characters to entities or decode entity strings for safe HTML and CMS work.",
      },
    ],
  },
  {
    id: "text-string-tools",
    title: "Text & String Tools",
    tools: [
      {
        name: "Word Counter",
        href: "/text/word-counter",
        icon: "CaseSensitive",
        description:
          "Count words, characters, sentences, paragraphs, and estimated reading time for articles and limits.",
      },
      {
        name: "Text Case Converter",
        href: "/text/case-converter",
        icon: "Type",
        description:
          "Switch between uppercase, lowercase, title, camelCase, snake_case, and kebab-case in one pass.",
      },
      {
        name: "Text Diff Checker",
        href: "/text/diff-checker",
        icon: "FileDiff",
        description:
          "Compare two text versions with line-level highlights for copy, legal, and content workflows.",
      },
      {
        name: "Duplicate Line Remover",
        href: "/text/duplicate-line-remover",
        icon: "ListFilter",
        description:
          "Deduplicate pasted lists with case-sensitive or insensitive matching for clean datasets.",
      },
      {
        name: "Text Reverser",
        href: "/text/text-reverser",
        icon: "ArrowLeftRight",
        description:
          "Reverse full text, words per line, or each line—quick puzzles, tests, and obfuscation demos.",
      },
      {
        name: "Find & Replace Tool",
        href: "/text/find-replace",
        icon: "Replace",
        description:
          "Find and replace plain text or regex patterns across long documents without an editor install.",
      },
      {
        name: "Slug Generator",
        href: "/text/slug-generator",
        icon: "Link2",
        description:
          "Turn titles into URL-safe, lowercase, hyphenated slugs for blogs, products, and routes.",
      },
      {
        name: "Line Sorter",
        href: "/text/line-sorter",
        icon: "ArrowUpDown",
        description:
          "Sort lines A–Z, Z–A, by length, or randomly to tidy logs, lists, and imports.",
      },
      {
        name: "Whitespace Remover",
        href: "/text/whitespace-remover",
        icon: "Space",
        description:
          "Trim edges and normalize spaces so pasted content fits forms, CSVs, and code blocks.",
      },
      {
        name: "Text to Binary Converter",
        href: "/text/text-to-binary",
        icon: "Binary",
        description:
          "Encode text to binary strings or decode binary back to readable characters for learning and demos.",
      },
      {
        name: "ROT13 Encoder & Decoder",
        href: "/text/rot13",
        icon: "Shuffle",
        description:
          "Apply ROT13 encode/decode in the browser for quick CTF-style or legacy text tasks.",
      },
      {
        name: "Caesar Cipher Tool",
        href: "/text/caesar-cipher",
        icon: "ShieldAlert",
        description:
          "Encrypt or decrypt with a custom Caesar shift—educational and lightweight obfuscation.",
      },
      {
        name: "Word Frequency Analyzer",
        href: "/text/word-frequency",
        icon: "BarChart2",
        description:
          "Rank word counts in pasted text to spot repetition, SEO stuffing, or vocabulary patterns.",
      },
      {
        name: "Email Extractor",
        href: "/text/email-extractor",
        icon: "Mail",
        description:
          "Pull every valid email from messy text or HTML into a deduplicated list for outreach prep.",
      },
      {
        name: "URL Extractor",
        href: "/text/url-extractor",
        icon: "ExternalLink",
        description:
          "Extract URLs from blobs of text or HTML for audits, archiving, and link inventories.",
      },
      {
        name: "Comma Separator Tool",
        href: "/text/comma-separator",
        icon: "ListPlus",
        description:
          "Convert newline lists to comma-separated values or split CSV-style lines into rows.",
      },
    ],
  },
  {
    id: "file-data-tools",
    title: "File & Data Tools",
    tools: [
      {
        name: "CSV Viewer & Editor",
        href: "/files/csv-viewer",
        icon: "Table",
        description:
          "Open CSV as a sortable, filterable table, tweak cells, and export without a spreadsheet app.",
      },
      {
        name: "CSV Deduplicator",
        href: "/files/csv-deduplicator",
        icon: "Filter",
        description:
          "Remove duplicate rows by chosen columns to clean mailing lists and product feeds.",
      },
      {
        name: "CSV to SQL Converter",
        href: "/files/csv-to-sql",
        icon: "Database",
        description:
          "Generate INSERT statements from a CSV for quick database seeding and migrations.",
      },
      {
        name: "Image to Base64 Converter",
        href: "/files/image-to-base64",
        icon: "FileImage",
        description:
          "Encode images to Base64 data URIs for embedding in HTML, CSS, or API payloads.",
      },
      {
        name: "Image Resizer",
        href: "/files/image-resizer",
        icon: "Scaling",
        description:
          "Resize by pixels or percentage in the browser—privacy-friendly, no server upload required.",
      },
      {
        name: "Image Compressor",
        href: "/files/image-compressor",
        icon: "Minimize2",
        description:
          "Shrink JPG and PNG with quality control and before/after size stats for faster pages.",
      },
      {
        name: "Image Format Converter",
        href: "/files/image-converter",
        icon: "RefreshCw",
        description:
          "Convert between JPG, PNG, and WebP locally to match CMS, email, and performance needs.",
      },
      {
        name: "Image Metadata Viewer",
        href: "/files/image-metadata",
        icon: "Camera",
        description:
          "Inspect EXIF: camera, lens, GPS, dimensions, and exposure—great for photographers and forensics.",
      },
      {
        name: "File Hash Checker",
        href: "/files/file-hash",
        icon: "FileCheck",
        description:
          "Compute MD5, SHA-1, and SHA-256 hashes of uploads to verify downloads and integrity.",
      },
      {
        name: "SVG Optimizer",
        href: "/files/svg-optimizer",
        icon: "Sparkles",
        description:
          "Minify and clean SVG markup to cut file size for icons, illustrations, and inline graphics.",
      },
    ],
  },
  {
    id: "design-color-tools",
    title: "Design & Color Tools",
    tools: [
      {
        name: "Color Picker & Converter",
        href: "/design/color-picker",
        icon: "Pipette",
        description:
          "Pick colors and copy HEX, RGB, HSL, and CMYK values for design systems and handoff.",
      },
      {
        name: "Color Contrast Checker",
        href: "/design/contrast-checker",
        icon: "Contrast",
        description:
          "Test text and background pairs against WCAG AA and AAA contrast ratios for accessible UI.",
      },
      {
        name: "Color Palette Generator",
        href: "/design/palette-generator",
        icon: "Palette",
        description:
          "From one base hue, build complementary, triadic, analogous, and monochrome palettes.",
      },
      {
        name: "Gradient Generator",
        href: "/design/gradient-generator",
        icon: "Blend",
        description:
          "Design linear and radial gradients visually and copy production-ready CSS in seconds.",
      },
      {
        name: "Tint & Shade Generator",
        href: "/design/tint-shade-generator",
        icon: "SunMedium",
        description:
          "Generate lighter tints and darker shades from a brand color for consistent UI scales.",
      },
      {
        name: "Color Blindness Simulator",
        href: "/design/color-blindness-simulator",
        icon: "EyeOff",
        description:
          "Preview images or palettes under common color-vision deficiencies to validate inclusive design.",
      },
      {
        name: "Box Shadow Generator",
        href: "/design/box-shadow-generator",
        icon: "Square",
        description:
          "Tune offset, blur, spread, color, and inset shadows with live preview and copyable CSS.",
      },
      {
        name: "Border Radius Generator",
        href: "/design/border-radius-generator",
        icon: "Square",
        description:
          "Adjust each corner visually and export shorthand border-radius for cards and buttons.",
      },
      {
        name: "CSS Gradient Generator",
        href: "/design/css-gradient",
        icon: "Sliders",
        description:
          "Build multi-stop gradients with angles and stops—outputs clean, modern CSS gradients.",
      },
      {
        name: "Flexbox Playground",
        href: "/design/flexbox-playground",
        icon: "Layout",
        description:
          "Tweak flex container and item properties and see layout updates in real time.",
      },
      {
        name: "CSS Grid Playground",
        href: "/design/css-grid-playground",
        icon: "Grid",
        description:
          "Prototype grid templates, gaps, and placement with instant visual feedback.",
      },
      {
        name: "Favicon Generator",
        href: "/design/favicon-generator",
        icon: "Sparkle",
        description:
          "Create favicon.ico and PNG sizes from an image or text for every device and browser tab.",
      },
    ],
  },
  {
    id: "security-encryption-tools",
    title: "Security & Encryption Tools",
    tools: [
      {
        name: "Password Strength Meter",
        href: "/security/password-strength",
        icon: "Gauge",
        description:
          "Score password entropy, estimate crack time, and get practical hardening tips.",
      },
      {
        name: "bcrypt Hash Generator",
        href: "/security/bcrypt-generator",
        icon: "Lock",
        description:
          "Generate bcrypt hashes with configurable cost for secure password storage testing.",
      },
      {
        name: "AES Encrypt & Decrypt",
        href: "/security/aes-encrypt-decrypt",
        icon: "ShieldCheck",
        description:
          "Encrypt and decrypt text with AES-256 and a passphrase—runs fully in your browser.",
      },
      {
        name: "RSA Key Pair Generator",
        href: "/security/rsa-key-generator",
        icon: "Award",
        description:
          "Create 1024–4096 bit RSA public/private key pairs locally for demos and dev workflows.",
      },
      {
        name: "CSP Builder",
        href: "/security/csp-builder",
        icon: "Shield",
        description:
          "Toggle Content-Security-Policy directives and copy a header value ready for your server.",
      },
      {
        name: "Security Headers Checker",
        href: "/security/headers-checker",
        icon: "ShieldCheck",
        description:
          "Analyze security-related HTTP headers on any URL with graded guidance to harden responses.",
      },
      {
        name: "JWT Encoder",
        href: "/security/jwt-encoder",
        icon: "FileKey",
        description:
          "Build HS256-signed JWTs from custom header and payload for API and auth testing.",
      },
      {
        name: "HMAC Generator",
        href: "/security/hmac-generator",
        icon: "Key",
        description:
          "Create HMAC-SHA256 or HMAC-SHA512 signatures with a secret for webhook and API verification.",
      },
      {
        name: "SSL Certificate Decoder",
        href: "/security/ssl-decoder",
        icon: "Scroll",
        description:
          "Paste PEM certificates to read subject, issuer, SANs, and validity windows.",
      },
      {
        name: ".htaccess Generator",
        href: "/security/htaccess-generator",
        icon: "Server",
        description:
          "Assemble common Apache .htaccess rules for redirects, HTTPS, caching, and access control.",
      },
    ],
  },
  {
    id: "seo-tools",
    title: "SEO Tools",
    tools: [
      {
        name: "Meta Title & Description Checker",
        href: "/seo/meta-length-checker",
        icon: "Heading",
        description:
          "Check title and meta description lengths against common search snippet limits before publish.",
      },
      {
        name: "Keyword Density Checker",
        href: "/seo/keyword-density",
        icon: "PieChart",
        description:
          "Measure keyword frequency, density, and prominence in your page copy for on-page SEO.",
      },
      {
        name: "Readability Score Checker",
        href: "/seo/readability-checker",
        icon: "BookOpen",
        description:
          "Run Flesch-Kincaid style analysis with grades and suggestions for clearer content.",
      },
      {
        name: "robots.txt Generator",
        href: "/seo/robots-txt-generator",
        icon: "Bot",
        description:
          "Build a valid robots.txt with allow/block rules and sitemap URL for crawler control.",
      },
      {
        name: "XML Sitemap Generator",
        href: "/seo/sitemap-generator",
        icon: "Network",
        description:
          "Turn a URL list into a standards-compliant XML sitemap for Search Console submission.",
      },
      {
        name: "Schema Markup Generator",
        href: "/seo/schema-generator",
        icon: "Code2",
        description:
          "Fill forms to output JSON-LD for articles, FAQs, products, reviews, and more.",
      },
      {
        name: "Open Graph Tag Generator",
        href: "/seo/og-tag-generator",
        icon: "Share2",
        description:
          "Generate Open Graph meta tags and preview social share cards for marketing QA.",
      },
      {
        name: "Hreflang Tag Generator",
        href: "/seo/hreflang-generator",
        icon: "Languages",
        description:
          "Pair URLs with language and region codes to output correct hreflang clusters for multilingual SEO.",
      },
      {
        name: "Redirect Type Checker",
        href: "/seo/redirect-checker",
        icon: "CornerUpRight",
        description:
          "See whether a URL returns 301, 302, or other redirects plus timing for migration audits.",
      },
      {
        name: "UTM Link Builder",
        href: "/seo/utm-builder",
        icon: "Target",
        description:
          "Add UTM parameters for source, medium, campaign, and term to track campaigns in analytics.",
      },
    ],
  },
  {
    id: "api-developer-toolbox",
    title: "API Developer Toolbox",
    tools: [
      {
        name: "HTTP Request Builder",
        href: "/api-toolbox/http-request-builder",
        icon: "Send",
        description:
          "Test, document, and debug APIs without leaving the browser—pick method, headers, and body, then send with fetch.",
      },
      {
        name: "API Response Formatter",
        href: "/api-toolbox/api-response-formatter",
        icon: "Braces",
        description:
          "Paste any JSON or XML API response: pretty-print, validate, and explore a collapsible tree view.",
      },
      {
        name: "OpenAPI / Swagger Viewer",
        href: "/api-toolbox/openapi-viewer",
        icon: "FileCode",
        description:
          "Paste OpenAPI in YAML or JSON and browse interactive docs—paths, schemas, and examples in one place.",
      },
      {
        name: "Webhook Payload Tester",
        href: "/api-toolbox/webhook-payload-tester",
        icon: "Webhook",
        description:
          "Practice webhook debugging client-side: log sample POST bodies locally (e.g. localStorage) when a public capture URL is not available.",
      },
      {
        name: "HTTP Status Code Reference",
        href: "/api-toolbox/http-status-codes",
        icon: "ListCheck",
        description:
          "Search HTTP status codes with plain-English meanings, typical causes, and what to do next.",
      },
      {
        name: "MIME Type Lookup",
        href: "/api-toolbox/mime-type-lookup",
        icon: "FileType",
        description:
          "Map filenames or extensions to MIME types for Content-Type headers, uploads, and API contracts.",
      },
      {
        name: "OAuth 2.0 Flow Visualizer",
        href: "/api-toolbox/oauth2-flow-visualizer",
        icon: "Workflow",
        description:
          "Walk through the authorization code flow step by step with interactive fields and diagrams.",
      },
      {
        name: "API Rate Limit Calculator",
        href: "/api-toolbox/rate-limit-calculator",
        icon: "Gauge",
        description:
          "Given X requests per minute and a daily budget of Y calls, see pacing and when you hit the wall.",
      },
    ],
  },
];

export const allTools: ToolEntry[] = toolSections.flatMap(
  (section) => section.tools,
);

export const totalToolCount = toolSections.reduce(
  (n, s) => n + s.tools.length,
  0,
);
