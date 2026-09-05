# Contributing to ZeroSnippet

Thank you for your interest in contributing to **ZeroSnippet**! 🚀

We welcome all contributions, especially new developer tools, UX improvements, bug fixes, and documentation updates.

---

## 🛠️ Adding a New Tool

ZeroSnippet is designed to make adding new utilities easy and modular.

### 1. Choose the Category
Find the appropriate category folder under `app/(pages)/`:
- `website/` — Domain, URL, DNS, WHOIS, HTTP inspection
- `dev/` — Formatters, validators, generators, diffing
- `text/` — String manipulation, case converters, word counters
- `files/` — File converters, compression, EXIF, metadata
- `design/` — Color pickers, gradients, CSS generators, typography
- `security/` — Hashing, encryption, JWT, SSL, tokens
- `seo/` — Meta tags, sitemaps, robots, hreflang
- `api-toolbox/` — Request builders, payloads, status codes

### 2. Create the Tool Page & Component
Under your chosen directory, create:
`app/(pages)/<category>/<tool-slug>/`
- `page.tsx` — Metadata, layout, explanation, and FAQ.
- `<tool-slug>-tool.tsx` — Interactive client component (`"use client"`).

### 3. Register the Tool in the Catalog
Open [`lib/tool-catalog.ts`](lib/tool-catalog.ts) and add your tool to the corresponding `toolSections` entry:

```typescript
{
  name: "Your Tool Name",
  href: "/<category>/<tool-slug>",
  description: "Brief 1-line description of what this tool does.",
}
```

### 4. Test Locally
Run the dev server and test your new tool:
```bash
npm run dev
```

---

## 🔒 Golden Rule: Privacy First

ZeroSnippet is built on the philosophy that **developer data belongs to the developer**:
- Any tool that can process data in the browser **MUST** process it client-side.
- Never transmit user payloads, tokens, code, or data to external servers unless the tool strictly requires network resolution (e.g. DNS or WHOIS lookup).

---

## 📦 Pull Request Process

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/add-my-awesome-tool
   ```
2. Ensure the code compiles and passes linter:
   ```bash
   npm run build
   npm run lint
   ```
3. Commit your changes with a clear message.
4. Push to your fork and submit a Pull Request!
