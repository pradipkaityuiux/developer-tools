export const svgOptimizerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does an SVG optimizer or minifier do?",
    answer:
      "It reduces SVG file size and noise by removing comments, stripping unnecessary whitespace between tags, dropping empty text nodes, optionally removing metadata and editor-specific attributes (Inkscape, Sketch, Figma exports), and shortening hex colors like #ffffff to #fff. The result is easier to cache, inline in HTML, or ship inside icon fonts and design systems.",
  },
  {
    question: "Is my SVG uploaded to your servers?",
    answer:
      "No. Parsing and serialization run entirely in your browser with the DOMParser API. Nothing is sent to our backend for optimization.",
  },
  {
    question: "Is this the same as SVGO?",
    answer:
      "SVGO is a Node-based toolchain with many more plugins (path simplification, merging paths, etc.). This tool focuses on fast, safe cleanup you can run without installing packages: valid XML output, script removal, and optional metadata/editor stripping. For deep path optimization in CI, many teams still run SVGO or similar in build pipelines.",
  },
  {
    question: "Will minifying break my SVG or animations?",
    answer:
      "Whitespace between tags and comments do not affect rendering. Removing metadata or editor attributes is usually safe for production assets. If your file relies on SMIL animation, foreignObject, or embedded scripts, strip only what you understand—scripts are always removed here for safety. Test the preview before you deploy.",
  },
  {
    question: "How do I use the optimized SVG in React or Next.js?",
    answer:
      "Copy the minified string into a component as JSX (rename reserved attributes like class to className), import as a raw file if your bundler supports it, or reference the file from /public. For inline data URIs in CSS, pair this page with /files/image-to-base64 after you save the SVG as a file, or paste inline if your stack allows.",
  },
  {
    question: "Can I optimize SVG icons for the web and Core Web Vitals?",
    answer:
      "Smaller SVGs reduce download and parse cost, which supports LCP and overall payload budgets—especially when you inline many icons. Combine minification with HTTP caching, sprites or symbol defs where appropriate, and avoid inlining huge illustrations as data URIs. See also /files/image-compressor for raster assets.",
  },
  {
    question: "Why remove Inkscape or Figma-specific attributes?",
    answer:
      "Design tools add editor metadata and namespaced attributes that browsers ignore at runtime. Removing them shrinks files and avoids leaking internal layer or grid data. Keep a master editable copy in your design repo; use the optimized export for production.",
  },
];
