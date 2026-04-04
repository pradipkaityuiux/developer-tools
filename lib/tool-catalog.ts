export type ToolEntry = {
  name: string;
  href: string;
  description: string;
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
        description:
          "Scan outbound links from any URL for 404s and broken hrefs—paste a page and audit links in seconds.",
      },
      {
        name: "HTTP Header Checker",
        href: "/website/http-header-checker",
        description:
          "Inspect HTTP response headers for any URL: cache control, content-type, CORS, and security-related values.",
      },
      {
        name: "Redirect Chain Checker",
        href: "/website/redirect-chain-checker",
        description:
          "Trace the full redirect path to the final URL and spot unnecessary hops hurting SEO and performance.",
      },
      {
        name: "SSL Certificate Checker",
        href: "/website/ssl-certificate-checker",
        description:
          "Verify TLS certificate validity, expiry, issuer, and chain for any domain before users hit errors.",
      },
      {
        name: "DNS Lookup Tool",
        href: "/website/dns-lookup",
        description:
          "Query A, AAAA, MX, CNAME, TXT, NS, and SOA records for troubleshooting email, hosting, and DNS.",
      },
      {
        name: "WHOIS Lookup",
        href: "/website/whois-lookup",
        description:
          "Look up domain registration details: registrar, dates, and status for research and due diligence.",
      },
      {
        name: "IP Address Lookup",
        href: "/website/ip-lookup",
        description:
          "Resolve IPv4 or IPv6 to geolocation, ISP, ASN, and hostname for network and fraud analysis.",
      },
      {
        name: "Domain Age Checker",
        href: "/website/domain-age-checker",
        description:
          "See how long a domain has been registered—useful for SEO trust signals and quick vetting.",
      },
      {
        name: "Robots.txt Checker",
        href: "/website/robots-txt-checker",
        description:
          "Fetch and review robots.txt rules, directives, and sitemap lines to catch crawler misconfiguration.",
      },
      {
        name: "Meta Tags Extractor",
        href: "/website/meta-tags-extractor",
        description:
          "Extract title, meta description, Open Graph, Twitter Card, and canonical tags from any live URL.",
      },
      {
        name: "Open Graph Preview",
        href: "/website/open-graph-preview",
        description:
          "Preview how a link may appear when shared on social networks before you publish or pitch.",
      },
      {
        name: "Website Technology Detector",
        href: "/website/technology-detector",
        description:
          "Detect CMS, frameworks, analytics, CDNs, and common scripts used on a site—great for competitive research.",
      },
      {
        name: "Canonical Tag Checker",
        href: "/website/canonical-tag-checker",
        description:
          "Confirm canonical tags, targets, and self-references to reduce duplicate-content SEO issues.",
      },
      {
        name: "Server Response Code Checker",
        href: "/website/response-code-checker",
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
        description:
          "Format, validate, minify, and explore JSON in a collapsible tree—fix payloads before they hit production.",
      },
      {
        name: "JSON to CSV Converter",
        href: "/dev/json-to-csv",
        description:
          "Turn JSON arrays into downloadable CSV with automatic column detection for spreadsheets and BI tools.",
      },
      {
        name: "JSON to YAML Converter",
        href: "/dev/json-to-yaml",
        description:
          "Convert JSON to readable YAML for configs and Kubernetes—copy or download the result.",
      },
      {
        name: "CSV to JSON Converter",
        href: "/dev/csv-to-json",
        description:
          "Paste or upload CSV and get structured JSON with header-aware typing for APIs and apps.",
      },
      {
        name: "YAML to JSON Converter",
        href: "/dev/yaml-to-json",
        description:
          "Parse YAML to valid JSON with clear errors—ideal for CI configs and cloud templates.",
      },
      {
        name: "XML Formatter & Validator",
        href: "/dev/xml-formatter",
        description:
          "Beautify and validate XML with structure insight and actionable parse errors.",
      },
      {
        name: "Regex Tester & Debugger",
        href: "/dev/regex-tester",
        description:
          "Test patterns live with highlights, capture groups, and flags—debug regex without leaving the browser.",
      },
      {
        name: "SQL Formatter",
        href: "/dev/sql-formatter",
        description:
          "Pretty-print SQL with indentation and keyword casing for readable queries and code review.",
      },
      {
        name: "HTML Formatter & Minifier",
        href: "/dev/html-formatter",
        description:
          "Beautify or minify HTML and compare raw markup with a quick rendered preview.",
      },
      {
        name: "CSS Formatter & Minifier",
        href: "/dev/css-formatter",
        description:
          "Format messy stylesheets or minify CSS for faster loads—keep design tokens consistent.",
      },
      {
        name: "JavaScript Formatter & Minifier",
        href: "/dev/js-formatter",
        description:
          "Pretty-print or minify JavaScript for debugging locally and shipping smaller bundles.",
      },
      {
        name: "HTML to Markdown Converter",
        href: "/dev/html-to-markdown",
        description:
          "Convert HTML snippets to Markdown for docs, CMS migrations, and README cleanup.",
      },
      {
        name: "Markdown to HTML Converter",
        href: "/dev/markdown-to-html",
        description:
          "Turn Markdown into HTML with a live preview—handy for emails, blogs, and static pages.",
      },
      {
        name: "Code Diff Checker",
        href: "/dev/code-diff",
        description:
          "Compare two code blocks side by side with clear add/remove highlighting for reviews.",
      },
      {
        name: "JWT Decoder",
        href: "/dev/jwt-decoder",
        description:
          "Decode JWT header and payload and check expiry—signature verification not included, client-side safe.",
      },
      {
        name: "Base64 Encoder & Decoder",
        href: "/dev/base64",
        description:
          "Encode text or files to Base64 or decode strings back—common for APIs, data URIs, and debugging.",
      },
      {
        name: "URL Encoder & Decoder",
        href: "/dev/url-encoder",
        description:
          "Percent-encode query strings or decode encoded URLs for correct linking and parsing.",
      },
      {
        name: "Hash Generator",
        href: "/dev/hash-generator",
        description:
          "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any string for checksums and testing.",
      },
      {
        name: "UUID Generator",
        href: "/dev/uuid-generator",
        description:
          "Create one or many UUID v4 values with copy-friendly output for databases and APIs.",
      },
      {
        name: "Cron Expression Generator",
        href: "/dev/cron-generator",
        description:
          "Build cron schedules with simple controls and see the human-readable meaning instantly.",
      },
      {
        name: "Cron Expression Explainer",
        href: "/dev/cron-explainer",
        description:
          "Paste a cron string for plain-English explanation and the next scheduled run times.",
      },
      {
        name: "Unix Timestamp Converter",
        href: "/dev/unix-timestamp",
        description:
          "Convert Unix epoch seconds or milliseconds to local time and back—essential for logs and APIs.",
      },
      {
        name: "Number System Converter",
        href: "/dev/number-converter",
        description:
          "Convert between binary, octal, decimal, and hexadecimal for low-level debugging and study.",
      },
      {
        name: ".gitignore Generator",
        href: "/dev/gitignore-generator",
        description:
          "Pick your stack and download a tailored .gitignore so secrets and build artifacts stay out of git.",
      },
      {
        name: "Password Generator",
        href: "/dev/password-generator",
        description:
          "Generate strong passwords with length and charset options—bulk mode for test accounts.",
      },
      {
        name: "Lorem Ipsum Generator",
        href: "/dev/lorem-ipsum",
        description:
          "Create placeholder paragraphs, sentences, or words with optional HTML wrapping for mockups.",
      },
      {
        name: "Dummy Data Generator",
        href: "/dev/dummy-data-generator",
        description:
          "Produce fake names, emails, and addresses as JSON or CSV for fixtures and UI testing.",
      },
      {
        name: "HTML Entity Encoder & Decoder",
        href: "/dev/html-entities",
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
        description:
          "Count words, characters, sentences, paragraphs, and estimated reading time for articles and limits.",
      },
      {
        name: "Text Case Converter",
        href: "/text/case-converter",
        description:
          "Switch between uppercase, lowercase, title, camelCase, snake_case, and kebab-case in one pass.",
      },
      {
        name: "Text Diff Checker",
        href: "/text/diff-checker",
        description:
          "Compare two text versions with line-level highlights for copy, legal, and content workflows.",
      },
      {
        name: "Duplicate Line Remover",
        href: "/text/duplicate-line-remover",
        description:
          "Deduplicate pasted lists with case-sensitive or insensitive matching for clean datasets.",
      },
      {
        name: "Text Reverser",
        href: "/text/text-reverser",
        description:
          "Reverse full text, words per line, or each line—quick puzzles, tests, and obfuscation demos.",
      },
      {
        name: "Find & Replace Tool",
        href: "/text/find-replace",
        description:
          "Find and replace plain text or regex patterns across long documents without an editor install.",
      },
      {
        name: "Slug Generator",
        href: "/text/slug-generator",
        description:
          "Turn titles into URL-safe, lowercase, hyphenated slugs for blogs, products, and routes.",
      },
      {
        name: "Line Sorter",
        href: "/text/line-sorter",
        description:
          "Sort lines A–Z, Z–A, by length, or randomly to tidy logs, lists, and imports.",
      },
      {
        name: "Whitespace Remover",
        href: "/text/whitespace-remover",
        description:
          "Trim edges and normalize spaces so pasted content fits forms, CSVs, and code blocks.",
      },
      {
        name: "Text to Binary Converter",
        href: "/text/text-to-binary",
        description:
          "Encode text to binary strings or decode binary back to readable characters for learning and demos.",
      },
      {
        name: "ROT13 Encoder & Decoder",
        href: "/text/rot13",
        description:
          "Apply ROT13 encode/decode in the browser for quick CTF-style or legacy text tasks.",
      },
      {
        name: "Caesar Cipher Tool",
        href: "/text/caesar-cipher",
        description:
          "Encrypt or decrypt with a custom Caesar shift—educational and lightweight obfuscation.",
      },
      {
        name: "Word Frequency Analyzer",
        href: "/text/word-frequency",
        description:
          "Rank word counts in pasted text to spot repetition, SEO stuffing, or vocabulary patterns.",
      },
      {
        name: "Email Extractor",
        href: "/text/email-extractor",
        description:
          "Pull every valid email from messy text or HTML into a deduplicated list for outreach prep.",
      },
      {
        name: "URL Extractor",
        href: "/text/url-extractor",
        description:
          "Extract URLs from blobs of text or HTML for audits, archiving, and link inventories.",
      },
      {
        name: "Comma Separator Tool",
        href: "/text/comma-separator",
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
        description:
          "Open CSV as a sortable, filterable table, tweak cells, and export without a spreadsheet app.",
      },
      {
        name: "CSV Deduplicator",
        href: "/files/csv-deduplicator",
        description:
          "Remove duplicate rows by chosen columns to clean mailing lists and product feeds.",
      },
      {
        name: "CSV to SQL Converter",
        href: "/files/csv-to-sql",
        description:
          "Generate INSERT statements from a CSV for quick database seeding and migrations.",
      },
      {
        name: "Image to Base64 Converter",
        href: "/files/image-to-base64",
        description:
          "Encode images to Base64 data URIs for embedding in HTML, CSS, or API payloads.",
      },
      {
        name: "Image Resizer",
        href: "/files/image-resizer",
        description:
          "Resize by pixels or percentage in the browser—privacy-friendly, no server upload required.",
      },
      {
        name: "Image Compressor",
        href: "/files/image-compressor",
        description:
          "Shrink JPG and PNG with quality control and before/after size stats for faster pages.",
      },
      {
        name: "Image Format Converter",
        href: "/files/image-converter",
        description:
          "Convert between JPG, PNG, and WebP locally to match CMS, email, and performance needs.",
      },
      {
        name: "Image Metadata Viewer",
        href: "/files/image-metadata",
        description:
          "Inspect EXIF: camera, lens, GPS, dimensions, and exposure—great for photographers and forensics.",
      },
      {
        name: "File Hash Checker",
        href: "/files/file-hash",
        description:
          "Compute MD5, SHA-1, and SHA-256 hashes of uploads to verify downloads and integrity.",
      },
      {
        name: "SVG Optimizer",
        href: "/files/svg-optimizer",
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
        description:
          "Pick colors and copy HEX, RGB, HSL, and CMYK values for design systems and handoff.",
      },
      {
        name: "Color Contrast Checker",
        href: "/design/contrast-checker",
        description:
          "Test text and background pairs against WCAG AA and AAA contrast ratios for accessible UI.",
      },
      {
        name: "Color Palette Generator",
        href: "/design/palette-generator",
        description:
          "From one base hue, build complementary, triadic, analogous, and monochrome palettes.",
      },
      {
        name: "Gradient Generator",
        href: "/design/gradient-generator",
        description:
          "Design linear and radial gradients visually and copy production-ready CSS in seconds.",
      },
      {
        name: "Tint & Shade Generator",
        href: "/design/tint-shade-generator",
        description:
          "Generate lighter tints and darker shades from a brand color for consistent UI scales.",
      },
      {
        name: "Color Blindness Simulator",
        href: "/design/color-blindness-simulator",
        description:
          "Preview images or palettes under common color-vision deficiencies to validate inclusive design.",
      },
      {
        name: "Box Shadow Generator",
        href: "/design/box-shadow-generator",
        description:
          "Tune offset, blur, spread, color, and inset shadows with live preview and copyable CSS.",
      },
      {
        name: "Border Radius Generator",
        href: "/design/border-radius-generator",
        description:
          "Adjust each corner visually and export shorthand border-radius for cards and buttons.",
      },
      {
        name: "CSS Gradient Generator",
        href: "/design/css-gradient",
        description:
          "Build multi-stop gradients with angles and stops—outputs clean, modern CSS gradients.",
      },
      {
        name: "Flexbox Playground",
        href: "/design/flexbox-playground",
        description:
          "Tweak flex container and item properties and see layout updates in real time.",
      },
      {
        name: "CSS Grid Playground",
        href: "/design/css-grid-playground",
        description:
          "Prototype grid templates, gaps, and placement with instant visual feedback.",
      },
      {
        name: "Favicon Generator",
        href: "/design/favicon-generator",
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
        description:
          "Score password entropy, estimate crack time, and get practical hardening tips.",
      },
      {
        name: "bcrypt Hash Generator",
        href: "/security/bcrypt-generator",
        description:
          "Generate bcrypt hashes with configurable cost for secure password storage testing.",
      },
      {
        name: "AES Encrypt & Decrypt",
        href: "/security/aes-encrypt-decrypt",
        description:
          "Encrypt and decrypt text with AES-256 and a passphrase—runs fully in your browser.",
      },
      {
        name: "RSA Key Pair Generator",
        href: "/security/rsa-key-generator",
        description:
          "Create 1024–4096 bit RSA public/private key pairs locally for demos and dev workflows.",
      },
      {
        name: "CSP Builder",
        href: "/security/csp-builder",
        description:
          "Toggle Content-Security-Policy directives and copy a header value ready for your server.",
      },
      {
        name: "Security Headers Checker",
        href: "/security/headers-checker",
        description:
          "Analyze security-related HTTP headers on any URL with graded guidance to harden responses.",
      },
      {
        name: "JWT Encoder",
        href: "/security/jwt-encoder",
        description:
          "Build HS256-signed JWTs from custom header and payload for API and auth testing.",
      },
      {
        name: "HMAC Generator",
        href: "/security/hmac-generator",
        description:
          "Create HMAC-SHA256 or HMAC-SHA512 signatures with a secret for webhook and API verification.",
      },
      {
        name: "SSL Certificate Decoder",
        href: "/security/ssl-decoder",
        description:
          "Paste PEM certificates to read subject, issuer, SANs, and validity windows.",
      },
      {
        name: ".htaccess Generator",
        href: "/security/htaccess-generator",
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
        description:
          "Check title and meta description lengths against common search snippet limits before publish.",
      },
      {
        name: "Keyword Density Checker",
        href: "/seo/keyword-density",
        description:
          "Measure keyword frequency, density, and prominence in your page copy for on-page SEO.",
      },
      {
        name: "Readability Score Checker",
        href: "/seo/readability-checker",
        description:
          "Run Flesch-Kincaid style analysis with grades and suggestions for clearer content.",
      },
      {
        name: "robots.txt Generator",
        href: "/seo/robots-txt-generator",
        description:
          "Build a valid robots.txt with allow/block rules and sitemap URL for crawler control.",
      },
      {
        name: "XML Sitemap Generator",
        href: "/seo/sitemap-generator",
        description:
          "Turn a URL list into a standards-compliant XML sitemap for Search Console submission.",
      },
      {
        name: "Schema Markup Generator",
        href: "/seo/schema-generator",
        description:
          "Fill forms to output JSON-LD for articles, FAQs, products, reviews, and more.",
      },
      {
        name: "Open Graph Tag Generator",
        href: "/seo/og-tag-generator",
        description:
          "Generate Open Graph meta tags and preview social share cards for marketing QA.",
      },
      {
        name: "Hreflang Tag Generator",
        href: "/seo/hreflang-generator",
        description:
          "Pair URLs with language and region codes to output correct hreflang clusters for multilingual SEO.",
      },
      {
        name: "Redirect Type Checker",
        href: "/seo/redirect-checker",
        description:
          "See whether a URL returns 301, 302, or other redirects plus timing for migration audits.",
      },
      {
        name: "UTM Link Builder",
        href: "/seo/utm-builder",
        description:
          "Add UTM parameters for source, medium, campaign, and term to track campaigns in analytics.",
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
