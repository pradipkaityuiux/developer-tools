<div align="center">

# 🛠️ ZeroSnippet

### 108+ Free, Privacy-First, Client-Side Developer Utilities

**All the daily tools developers, devops, and marketers need — running entirely in your browser.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-zerosnippet.com-22c55e?style=for-the-badge&logo=googlechrome&logoColor=white)](https://zerosnippet.com)
[![Docker](https://img.shields.io/badge/Docker-Self--Hostable-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-self-hosting-with-docker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

<p align="center">
  <a href="https://zerosnippet.com"><strong>🌐 Explore the Live Website »</strong></a>
  <br />
  <a href="#-quick-start">Quick Start</a>
  ·
  <a href="#-self-hosting-with-docker">Self-Hosting</a>
  ·
  <a href="#-available-tools-108">Available Tools</a>
  ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>

</div>

---

## ✨ Why ZeroSnippet?

Most online developer tools are bloated with intrusive ads, slow to load, or silently send your private snippets, JSON objects, tokens, and SQL queries to backend servers.

**ZeroSnippet was built with three foundational principles:**

- 🔒 **100% Client-Side Privacy**: Data manipulation happens strictly in your browser via Web APIs and WebAssembly. Your payloads and credentials are never transmitted, stored, or logged on any external server.
- ⚡ **Blazing Fast**: Built with Next.js 16, React 19, and Tailwind CSS v4 for instantaneous page switches, minimal footprint, and zero clutter.
- 🐳 **Self-Hostable**: Need an internal tools dashboard for your company VPN or home lab? Spin up the full suite with a single Docker command.
- 🌓 **Dark & Light Mode**: Clean, developer-tailored interface designed for long debugging sessions.
- 🔍 **Instant Search**: Find any utility in milliseconds using the integrated search palette (`/` or `Cmd+K`).

---

## 🐳 Self-Hosting with Docker

You can host your own private instance of ZeroSnippet inside your home lab or corporate network:

### Using Docker Compose (Recommended)

```yaml
# docker-compose.yml
services:
  zerosnippet:
    image: zerosnippet:latest
    build: .
    container_name: zerosnippet
    restart: unless-stopped
    ports:
      - "3000:3000"
```

Start the container:
```bash
docker compose up -d
```

### Using Docker CLI

```bash
docker build -t zerosnippet .
docker run -d -p 3000:3000 --name zerosnippet zerosnippet
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Local Development

Ensure you have **Node.js 20+** installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/developer-tools.git
   cd developer-tools
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧰 Available Tools (108+)

<details open>
<summary><h3>🌐 Website & URL Tools (14 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **Broken Link Checker** | Scan outbound links from any URL for 404s and broken hrefs. |
| **HTTP Header Checker** | Inspect HTTP response headers: cache-control, CORS, security headers. |
| **Redirect Chain Checker** | Trace the full redirect path to the final URL and spot unnecessary hops. |
| **SSL Certificate Checker** | Verify TLS certificate validity, expiry, issuer, and chain. |
| **DNS Lookup Tool** | Query A, AAAA, MX, CNAME, TXT, NS, and SOA records. |
| **WHOIS Lookup** | Look up domain registration details: registrar, dates, and status. |
| **IP Address Lookup** | Resolve IPv4 or IPv6 to geolocation, ISP, ASN, and hostname. |
| **Domain Age Checker** | Check domain registration age and vetting signals. |
| **Robots.txt Checker** | Review robots.txt rules, directives, and sitemap lines. |
| **Meta Tags Extractor** | Extract title, meta description, Open Graph, and Twitter Card tags. |
| **Open Graph Preview** | Preview social share cards across Facebook, Twitter/X, and LinkedIn. |
| **Website Technology Detector** | Detect CMS, frontend frameworks, analytics, and CDNs on any site. |
| **Canonical Tag Checker** | Confirm canonical tags and self-references to prevent SEO duplicate issues. |
| **Server Response Code Checker** | Check HTTP status codes (200, 301, 404, 500) for any URL in one request. |

</details>

<details>
<summary><h3>💻 Code & Developer Tools (28 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **JSON Formatter & Validator** | Pretty-print, validate, minify, and browse JSON in a collapsible tree. |
| **JavaScript / TypeScript Formatter** | Beautify or minify JS/TS code with customizable indentation. |
| **HTML Formatter** | Clean up messy HTML tags and indent nested trees. |
| **CSS Formatter & Minifier** | Beautify or minify CSS rules and optimize stylesheets. |
| **SQL Formatter** | Pretty-print complex SQL queries with syntax highlighting and dialect support. |
| **XML Formatter** | Format, validate, and tree-view XML structures. |
| **JSON to CSV Converter** | Flatten and export JSON data into CSV spreadsheets. |
| **CSV to JSON Converter** | Parse CSV datasets into structured JSON arrays and objects. |
| **JSON to YAML Converter** | Convert configuration between JSON and YAML syntax. |
| **YAML to JSON Converter** | Parse YAML manifests into clean JSON objects. |
| **HTML to Markdown Converter** | Convert HTML snippets into clean Markdown format. |
| **Markdown to HTML Previewer** | Real-time Markdown editor with live HTML rendering and copyable code. |
| **Regex Tester & Debugger** | Test regular expressions with instant match highlighting and flags. |
| **Base64 Encoder & Decoder** | Encode/decode plain text and binary strings to Base64 format. |
| **URL Encoder & Decoder** | Percent-encode or decode URL query strings and URI components. |
| **HTML Entities Encoder/Decoder** | Convert special characters into HTML entities (`&amp;`, `&lt;`, etc.). |
| **UUID / GUID Generator** | Generate v4 and custom UUIDs in bulk with formatting options. |
| **Hash Generator** | Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. |
| **JWT Decoder** | Inspect decoded headers, payloads, and timestamps without sending secrets. |
| **Cron Expression Generator & Explainer** | Build cron schedules with human-readable plain-English explanations. |
| **Timestamp / Unix Epoch Converter** | Convert epoch timestamps to human dates and ISO-8601 strings. |
| **Code Diff & Comparison Tool** | Side-by-side visual difference comparison between two text snippets. |
| **Lorem Ipsum Generator** | Generate custom placeholder paragraphs, sentences, and words. |
| **Dummy Data Generator** | Generate realistic test data (names, emails, addresses, phones) for testing. |
| **Number Base Converter** | Convert between Binary, Octal, Decimal, and Hexadecimal notations. |
| **Color Code Converter** | Convert between HEX, RGB, HSL, HSV, and CMYK color formats. |
| **.gitignore Generator** | Assemble standard `.gitignore` templates for Node, Python, Go, Rust, and more. |

</details>

<details>
<summary><h3>📝 Text & String Tools (18 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **Case Converter** | Convert text to camelCase, snake_case, kebab-case, PascalCase, UPPER, lower. |
| **Word & Character Counter** | Count words, characters, sentences, paragraphs, and estimated reading time. |
| **Duplicate Line Remover** | Remove duplicate lines from lists and sort unique entries alphabetically. |
| **Text Sorter** | Sort lists alphabetically, numerically, by length, or reversed. |
| **Slug Generator** | Convert titles and headlines into clean, URL-friendly slugs. |
| **String Reverser** | Reverse strings, word order, or letter sequences. |
| **Random String & Password Generator** | Create cryptographically secure random passwords and tokens. |
| **Morse Code Converter** | Translate text to Morse code and Morse back to plain text. |
| **Binary to Text Converter** | Convert 8-bit binary strings to ASCII characters and back. |
| **Whitespace Cleaner** | Strip extra spaces, tabs, and trailing line breaks from raw text. |
| **Line Break Converter** | Normalize LF (Unix) and CRLF (Windows) newline line endings. |
| **ASCII Art Generator** | Convert text strings into stylish ASCII banner art. |
| **ROT13 Cipher** | Encode and decode text using classic ROT13 cipher rotation. |

</details>

<details>
<summary><h3>🔒 Security & Encryption Tools (10 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **Password Strength Meter** | Score password entropy, estimate crack time, and get hardening tips. |
| **bcrypt Hash Generator** | Generate bcrypt hashes with configurable salt cost for auth testing. |
| **AES-256 Encrypt & Decrypt** | Encrypt and decrypt text with AES-256 and passphrase locally in-browser. |
| **RSA Key Pair Generator** | Generate 1024–4096 bit RSA public/private key pairs locally. |
| **CSP (Content-Security-Policy) Builder** | Assemble and test CSP directives for secure web response headers. |
| **Security Headers Checker** | Audit security headers (`HSTS`, `X-Frame-Options`, `CSP`) on any domain. |
| **JWT Encoder** | Build HS256-signed JWTs from custom headers and claims. |
| **HMAC Generator** | Create HMAC-SHA256 and HMAC-SHA512 signatures with secret keys. |
| **SSL Certificate Decoder** | Decode PEM certificates to read subject, issuer, SANs, and expiry. |
| **.htaccess Generator** | Assemble Apache `.htaccess` rules for redirects, HTTPS, and caching. |

</details>

<details>
<summary><h3>🎨 Design & CSS Tools (10 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **Color Picker & Palette Generator** | Pick colors, preview harmonies, and export CSS/Tailwind variables. |
| **Contrast Checker (WCAG 2.1)** | Check foreground/background contrast ratios against AA and AAA guidelines. |
| **Color Blindness Simulator** | Preview designs through Protanopia, Deuteranopia, and Tritanopia filters. |
| **CSS Box Shadow Generator** | Build smooth layered box shadows with real-time CSS output. |
| **CSS Border Radius Generator** | Design custom 8-point asymmetric border curves visually. |
| **CSS Gradient Generator** | Build multi-stop linear and radial gradients with modern CSS output. |
| **Flexbox Playground** | Test flex directions, alignment, wrapping, and item properties live. |
| **CSS Grid Playground** | Prototype grid templates, gaps, areas, and tracks with instant visual feedback. |
| **Favicon Generator** | Generate `favicon.ico` and multi-size PNG icons from images or text. |

</details>

<details>
<summary><h3>🔍 SEO Tools (10 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **Meta Title & Description Checker** | Preview search snippet lengths for Google Desktop and Mobile SERPs. |
| **Keyword Density Checker** | Measure keyword frequency and density percentage across page copy. |
| **Readability Score Checker** | Run Flesch-Kincaid and Gunning-Fog readability grade calculations. |
| **Robots.txt Generator** | Generate crawler-friendly `robots.txt` directives and sitemap declarations. |
| **XML Sitemap Generator** | Convert a list of URLs into a standards-compliant XML sitemap. |
| **Schema Markup Generator** | Build JSON-LD structured data for Articles, FAQs, Products, and Organizations. |
| **Open Graph Tag Generator** | Build OpenGraph and Twitter Card `<meta>` tags with live preview. |
| **Hreflang Tag Generator** | Generate multilingual hreflang tag clusters for international SEO. |
| **Redirect Type Checker** | Differentiate 301 permanent vs 302 temporary redirects. |
| **UTM Link Builder** | Build tracking URLs with campaign, source, medium, and term parameters. |

</details>

<details>
<summary><h3>🔌 API Developer Toolbox (8 tools)</h3></summary>

| Tool | Description |
| :--- | :--- |
| **HTTP Request Builder** | Compose and send GET, POST, PUT, DELETE requests directly with fetch. |
| **API Response Formatter** | Parse JSON and XML API responses with tree navigation and syntax highlighting. |
| **OpenAPI / Swagger Viewer** | Render OpenAPI YAML/JSON specs in an interactive documentation viewer. |
| **Webhook Payload Tester** | Debug and log webhook POST bodies locally without external proxies. |
| **HTTP Status Code Reference** | Search HTTP status codes (1xx–5xx) with plain-English causes and remedies. |
| **MIME Type Lookup** | Map file extensions to Content-Type headers for API contracts. |
| **OAuth 2.0 Flow Visualizer** | Interactive step-by-step visualizer for Authorization Code & PKCE flows. |
| **API Rate Limit Calculator** | Calculate requests per minute and pacing against daily quota limits. |

</details>

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Standalone Output)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content & Blog**: Next-MDX-Remote, Contentlayer2, Gray-Matter
- **Containerization**: [Docker](https://www.docker.com/) (Alpine Multi-Stage Build)

---

## 🤝 Contributing

Contributions make the open-source community thrive! Whether it's adding a new developer utility, refining an existing UI, or fixing a bug:

1. Check out our **[Contributing Guide](CONTRIBUTING.md)**.
2. Fork the repository & create a feature branch (`git checkout -b feat/my-new-tool`).
3. Commit your changes and open a Pull Request.

---

## 📄 License

This project is open-source and licensed under the **[MIT License](LICENSE)**.

---

<div align="center">
  <sub>Built with ❤️ for developers worldwide by the <a href="https://zerosnippet.com">ZeroSnippet</a> team.</sub>
</div>
