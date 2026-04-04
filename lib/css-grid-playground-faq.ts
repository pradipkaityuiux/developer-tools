export const cssGridPlaygroundFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is a CSS Grid playground?",
      answer:
        "A CSS Grid playground is an interactive layout lab where you edit grid-template-columns, grid-template-rows, gap, alignment, and per-item grid-column and grid-row rules while a live preview updates instantly. You copy the generated CSS into your project—useful for learning grid placement without juggling DevTools panels.",
    },
    {
      question: "When should I use CSS Grid instead of Flexbox?",
      answer:
        "Use CSS Grid when you need two-dimensional templates: dashboards, card galleries with explicit tracks, full-page shells, and overlapping regions. Use Flexbox for one-dimensional rows or columns (nav bars, toolbars, form fields). Most production apps combine both. After prototyping grid here, one-dimensional tweaks often fit our Flexbox Playground.",
    },
    {
      question: "What is the difference between gap, row-gap, and column-gap?",
      answer:
        "gap sets both row and column gutters at once (in this tool via two sliders that output gap: row column). row-gap and column-gap let you set them independently; the generated CSS uses the shorthand when both values differ or a single length when they match.",
    },
    {
      question: "How do grid-column and grid-row work with line numbers?",
      answer:
        "Grid lines are numbered starting at 1 from the start edge of the grid. This tool expresses placement as a starting line plus span—for example grid-column: 1 / span 2 means begin at line 1 and cover two tracks. Implicit rows appear automatically when items need more space than your template rows define.",
    },
    {
      question: "What do justify-items and align-items do on a grid container?",
      answer:
        "justify-items aligns each grid item inside its column along the inline axis; align-items aligns inside its row along the block axis. Common pairs are stretch (default, fill the cell) and center for icon grids. justify-content and align-content distribute extra space around the whole grid when the container is larger than the sum of tracks.",
    },
    {
      question: "Does this CSS Grid tool upload my layout to a server?",
      answer:
        "No. Preview and CSS generation run entirely in your browser. The Upload button only reads a JSON file you choose locally to restore saved settings; nothing is transmitted to us. Copy CSS uses your clipboard locally.",
    },
    {
      question: "Can I use fr, minmax(), and repeat() in column and row templates?",
      answer:
        "Yes. Choose a preset or switch to custom and type valid track lists such as repeat(4, minmax(0, 1fr)), 240px 1fr, or repeat(auto-fill, minmax(120px, 1fr)). Invalid values may not render as expected in the preview; simplify the expression or check browser support for advanced functions.",
    },
  ];
