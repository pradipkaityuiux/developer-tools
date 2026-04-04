export const markdownToHtmlFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does this Markdown to HTML converter do?",
      answer:
        "You paste Markdown (headings, lists, links, fenced code blocks, tables with GFM) and get an HTML fragment you can copy into a CMS, email template, static page, or README pipeline. A sandboxed live preview shows how the HTML renders while keeping scripts disabled in the preview frame.",
    },
    {
      question: "Is my Markdown sent to your servers?",
      answer:
        "No. Parsing runs entirely in your browser with JavaScript. Nothing is uploaded for conversion unless you use another tool on this site that explicitly performs network requests.",
    },
    {
      question: "Which Markdown flavor do you support?",
      answer:
        "The converter uses GitHub-Flavored Markdown-style features enabled in the parser: tables, task lists, strikethrough, and autolinks where supported. For strict CommonMark-only behavior, validate critical docs in your build pipeline as well.",
    },
    {
      question: "Why does the preview look different from my site?",
      answer:
        "The preview uses a minimal document with basic typography so you can check structure, not your production CSS. After you paste HTML into your theme, headings, spacing, and code blocks will pick up your design system styles.",
    },
    {
      question: "Is the HTML safe to inject with dangerouslySetInnerHTML?",
      answer:
        "Treat copied HTML as untrusted unless you sanitize it in your app. The on-page preview is sanitized for display and shown inside a sandboxed iframe. Before binding Markdown output in React or any framework, run a trusted sanitizer (for example DOMPurify) server-side or client-side according to your threat model.",
    },
    {
      question: "How do I go from HTML back to Markdown?",
      answer:
        "Use our HTML to Markdown converter on the same developer tools hub when you need to migrate CMS content, clean up legacy snippets, or produce Markdown for docs from existing markup.",
    },
    {
      question: "Can I use this for email HTML?",
      answer:
        "Yes for structure and copy-paste of simple content, but many email clients need inline styles, table layouts, and tested templates. Use this tool to generate semantic HTML from Markdown, then adapt classes and styles in your ESP or HTML formatter workflow.",
    },
    {
      question: "Which related tools should I use next?",
      answer:
        "Beautify or minify the resulting markup with the HTML formatter and minifier, pair with the CSS formatter for styling snippets, validate JSON or YAML configs beside your content with the JSON formatter or YAML to JSON converter, and explore the full code and developer tools list on the home page.",
    },
  ];
