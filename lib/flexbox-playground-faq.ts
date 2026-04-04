export const flexboxPlaygroundFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is a flexbox playground?",
      answer:
        "A flexbox playground is an interactive CSS layout lab where you change flex container properties (direction, wrap, justify-content, align-items, gap) and flex item properties (grow, shrink, basis, align-self, order) while a live preview updates instantly. You copy the generated CSS into your stylesheet or component styles—ideal for learning flexbox without guessing in DevTools.",
    },
    {
      question: "When should I use CSS Flexbox instead of CSS Grid?",
      answer:
        "Use Flexbox for one-dimensional layouts: rows or columns of components that should distribute space, wrap, or align along a single axis—navigation bars, toolbars, form rows, and card footers. Use CSS Grid when you need two-dimensional templates with explicit rows and columns. Many UIs combine both: Grid for the page shell and Flexbox inside components. After exploring flex here, you can prototype grid-heavy layouts in our CSS Grid Playground.",
    },
    {
      question: "What does justify-content control in Flexbox?",
      answer:
        "justify-content distributes flex items along the main axis (horizontal in row, vertical in column). Values like flex-start and flex-end pin items to one side; center centers them; space-between pushes the first and last items to the edges with equal gaps between; space-around and space-evenly add symmetric spacing. It does not move wrapped rows as a whole—that is align-content when flex-wrap is not nowrap.",
    },
    {
      question: "What is the difference between align-items and align-self?",
      answer:
        "align-items sets the default cross-axis alignment for every flex item in the container (stretch, flex-start, flex-end, center, baseline). align-self overrides that default for a single item. In this tool, select an item in the preview to edit its align-self while keeping siblings on the container default—handy for centering one odd button in a row.",
    },
    {
      question: "How do flex-grow, flex-shrink, and flex-basis work together?",
      answer:
        "Together they form the flex shorthand. flex-grow is how much an item expands when extra space exists (0 means do not grow). flex-shrink is how much it contracts when space is tight (0 means do not shrink). flex-basis is the starting size before growing or shrinking—auto uses the item’s width or height from content, 0 makes flex-grow share space more predictably in equal-width layouts. The playground outputs flex: grow shrink basis for clarity.",
    },
    {
      question: "Does this tool send my layout to a server?",
      answer:
        "No. All state runs in your browser: the preview and CSS string are computed locally. Nothing is uploaded when you copy CSS. If you use a future import feature, parsing would still happen client-side unless explicitly stated otherwise.",
    },
    {
      question: "Can I use the copied CSS in Tailwind CSS or styled-components?",
      answer:
        "Yes. Paste the rules into a global stylesheet, a CSS module, or the style prop as a string. In Tailwind, many flex utilities map 1:1 (flex, flex-row, justify-center, gap-4). This playground helps when you need exact values, custom gaps in pixels, or nth-child rules that are faster to prototype visually than typing utilities from memory.",
    },
  ];
