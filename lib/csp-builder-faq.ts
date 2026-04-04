export const cspBuilderFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a Content Security Policy (CSP)?",
    answer:
      "Content Security Policy is a browser security layer delivered as an HTTP header (Content-Security-Policy or Content-Security-Policy-Report-Only) or, for simpler cases, a meta tag. It tells the browser which origins are allowed for scripts, styles, images, XHR, frames, and more. Well-tuned CSP reduces cross-site scripting impact because inline script and unexpected third-party loads can be blocked or reported.",
  },
  {
    question: "What is the difference between Content-Security-Policy and Report-Only?",
    answer:
      "Content-Security-Policy enforces rules: violations are blocked (or stripped) in the browser. Content-Security-Policy-Report-Only sends violation reports but does not block—ideal for rolling out a new policy while you fix broken assets. After logs look clean, switch to the enforcing header. This builder outputs the policy value; you choose which header name your server sends.",
  },
  {
    question: "What does default-src do?",
    answer:
      "default-src is a fallback for fetch-related directives that you do not list explicitly. Many policies start with default-src 'self' and then add script-src, style-src, and others for finer control. If you set only default-src, it applies broadly—splitting directives is usually clearer for production reviews.",
  },
  {
    question: "Why avoid 'unsafe-inline' for scripts?",
    answer:
      "Inline script and event handlers are a common XSS path. If script-src includes 'unsafe-inline', much of CSP's benefit for scripts is lost. Prefer nonces (per-response random tokens on script tags) or hashes (cryptographic hashes of inline script bodies) together with script-src, or move logic to external files on allowed origins.",
  },
  {
    question: "What is frame-ancestors used for?",
    answer:
      "frame-ancestors controls which pages may embed your site in iframes. It replaces many uses of X-Frame-Options for framing policy. Typical values are 'none' (no embedding) or 'self' plus specific partner origins. It is not the same as frame-src, which controls what your page may embed.",
  },
  {
    question: "How do I deploy this policy on my server?",
    answer:
      "Copy the policy value from this tool, then add an HTTP header: Content-Security-Policy: <value>. On nginx use add_header; on Apache mod_headers; on Node or Express use middleware; on Vercel or Netlify use headers in config. For static sites you can use a meta http-equiv tag, but HTTP headers are preferred. Always test in staging and consider Report-Only first.",
  },
  {
    question: "Can I use CSP with Next.js or React?",
    answer:
      "Yes. Frameworks often need script-src and style-src tuned for hydration, inline styles, and third-party scripts. Next.js and other stacks may emit inline scripts—use nonces or hashes where supported, or tighten gradually. Pair this builder with your staging environment and browser devtools to resolve violations before production.",
  },
  {
    question: "Does this tool upload my policy to a server?",
    answer:
      "No. The policy is built and copied in your browser. Optional upload only reads a text file you choose locally to pre-fill directives—nothing is transmitted to us. Avoid pasting secrets into any web form as a general habit.",
  },
  {
    question: "How do I validate headers after deployment?",
    answer:
      "Use browser developer tools (Network tab) to confirm the header value, or run security scanners and dedicated header checkers. This site includes an HTTP header checker at /website/http-header-checker to inspect live responses for Content-Security-Policy and related headers.",
  },
];
