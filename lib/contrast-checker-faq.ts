export const contrastCheckerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What contrast ratio passes WCAG AA for normal body text?",
    answer:
      "WCAG 2.1 Success Criterion 1.4.3 requires a contrast ratio of at least 4.5:1 between text and its background for regular (non-large) text, unless the text is purely decorative or logotype. Large text—roughly 18pt and up at regular weight, or 14pt bold and up—can meet AA at 3:1.",
  },
  {
    question: "What is the difference between WCAG AA and AAA for color contrast?",
    answer:
      "AA is the baseline conformance level most teams target for legal and procurement requirements. AAA is stricter: normal text needs at least 7:1, and large text needs at least 4.5:1. AAA is not always required for every control, but it helps users with low vision and glare sensitivity.",
  },
  {
    question: "Does this tool work for gradients, images, or glassmorphism backgrounds?",
    answer:
      "This checker computes the ratio between two solid sRGB colors. For gradients or photos, test the worst-case area behind the text (often the lightest and darkest stops). For translucent overlays, composite the text color over the underlying background first, then measure that pair.",
  },
  {
    question: "Why do my Figma or Sketch hex values look slightly different here?",
    answer:
      "Browsers and design tools may use different color profiles or export settings. Always verify contrast in the medium where users see it (browser, OS, PDF). This page uses the same sRGB math as WCAG luminance definitions for web content.",
  },
  {
    question: "Are my images uploaded when I use pick color from image?",
    answer:
      "No server upload. The image loads into an HTML canvas in your tab so you can sample pixels. The file never leaves your device unless you download or share it elsewhere yourself.",
  },
  {
    question: "How does this relate to the color picker and palette tools on this site?",
    answer:
      "Use the color picker to capture or convert HEX, RGB, and HSL values, then paste them here to validate pairs. The palette generator helps you build harmonious sets; run each foreground and background candidate through this contrast checker before shipping components.",
  },
];
