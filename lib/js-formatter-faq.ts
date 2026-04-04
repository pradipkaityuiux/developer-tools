export const jsFormatterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this JavaScript formatter and minifier do?",
    answer:
      "Format (beautify) uses Prettier’s Babel-based parser to pretty-print JavaScript and TypeScript with consistent indentation and line breaks. Minify uses Terser to remove whitespace and comments, shorten variable names where safe, and apply light compression so bundles are smaller. Both steps run entirely in your browser.",
  },
  {
    question: "Is my code sent to your servers?",
    answer:
      "No. Prettier and Terser execute locally in your tab. Nothing is uploaded for formatting or minification unless you use another page that explicitly makes network requests.",
  },
  {
    question: "Can I minify TypeScript or JSX as-is?",
    answer:
      "Minification expects JavaScript the engine can parse. Plain TypeScript types, interfaces, and some TS-only syntax will make Terser fail—use Format for TS/TSX, or compile to JavaScript first, then paste the output here to minify. JSX in .tsx-style snippets may need to be valid after your toolchain strips types.",
  },
  {
    question: "How is this different from my editor’s Prettier or my bundler?",
    answer:
      "Your repo’s Prettier config, ESLint rules, and bundler (Vite, webpack, esbuild) are the source of truth for CI and production. This page is a fast scratchpad: paste a snippet from a stack trace, beautify obfuscated code for reading, or estimate minified size without touching package.json.",
  },
  {
    question: "Will minify break my code?",
    answer:
      "Terser is widely used in production, but aggressive mangling can interact badly with eval, dynamic property access on minified names, or code that relies on Function.prototype.toString. Test minified output in your app. For libraries consumed by others, ship source maps and consider disabling mangle for public APIs.",
  },
  {
    question: "Why does Format fail with a parse error?",
    answer:
      "Prettier needs syntactically valid JavaScript or TypeScript. A missing bracket, unfinished template literal, or pasted HTML instead of script will fail. Fix the syntax in your editor, or use our HTML formatter if you grabbed a full page by mistake.",
  },
  {
    question: "Does this replace terser-webpack-plugin or Vite’s build.minify?",
    answer:
      "No. Use those tools for repeatable production builds, tree-shaking across modules, and integration with your framework. Use this utility for one-off inspection, demos, and quick before/after size checks on a single file or fragment.",
  },
  {
    question: "Which related tools pair well with this one?",
    answer:
      "Format CSS with the CSS formatter and minifier, clean markup with the HTML formatter and minifier, validate JSON payloads with the JSON formatter and validator, and debug patterns with the regex tester—all linked from the code and developer tools section on the home page.",
  },
];
