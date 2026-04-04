export const cssFormatterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this CSS formatter and minifier do?",
    answer:
      "Paste a stylesheet to beautify it with readable indentation and line breaks, or minify it by stripping comments and collapsing whitespace for smaller files. String contents and quotation marks are preserved so url(...) and content values stay intact. Everything runs locally in your browser.",
  },
  {
    question: "Is my CSS uploaded to a server?",
    answer:
      "No. Formatting and minification use JavaScript in your tab only. Nothing is sent to our backend unless you navigate away or use another tool that explicitly performs network requests.",
  },
  {
    question: "Does minifying remove comments?",
    answer:
      "Yes. Minify strips block comments (/* ... */) to save bytes. Use Format if you want to keep comments in the output for documentation. For production builds, teams often rely on bundlers or PostCSS pipelines that can drop comments while applying autoprefixer and other transforms.",
  },
  {
    question: "Will this break modern CSS like nesting or custom properties?",
    answer:
      "The tool treats your input as text: it balances braces, respects strings, and reformats whitespace. Valid nested rules and var(--tokens) pass through as long as braces and quotes are balanced. Very new syntax edge cases may need verification in a full browser or build tool.",
  },
  {
    question: "How is this different from Prettier or stylelint?",
    answer:
      "Prettier and stylelint are project-level tools with rich configuration, autofix rules, and editor integration. This page is a quick, install-free scratchpad for pasting snippets, comparing minified vs readable output, and sharing examples—pair it with our HTML formatter or JavaScript formatter when you clean full-page assets.",
  },
  {
    question: "Why do I see an unbalanced braces error?",
    answer:
      "A missing or extra { or } prevents safe restructuring. Fix the typo in your editor, or isolate the problematic block and format it separately. If you pasted HTML by mistake, switch to the HTML formatter and minifier instead.",
  },
  {
    question: "Can I use this for critical CSS or above-the-fold snippets?",
    answer:
      "Yes. Minify small critical-CSS blobs before inlining them in <style> tags to reduce HTML weight. Afterward, validate full pages with our meta tags extractor or schema tools if you are tuning SEO-related markup.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Beautify markup with the HTML formatter and minifier, shrink scripts with the JavaScript formatter and minifier, pretty-print SQL for data-heavy pages, and test selectors or animations with the regex tester when you debug patterns in class names or build scripts—all listed in the code and developer tools section on the home page.",
  },
];
