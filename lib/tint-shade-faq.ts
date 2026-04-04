export const tintShadeFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is the difference between a tint and a shade in UI design?",
    answer:
      "A tint is your base color mixed with white—it becomes lighter while keeping the same hue family. A shade is the base mixed with black—it becomes darker. Together they form a scale you can use for backgrounds, borders, hover states, and illustration without guessing hex values by hand.",
  },
  {
    question: "How many steps should I generate for a design system?",
    answer:
      "Many teams use 5–9 steps per side (tints and shades) plus the base, or they align to a 50–950 naming scheme. Fewer steps stay easier to document; more steps give finer control for data visualizations. Start with 5, ship components, then add stops only where real products need them.",
  },
  {
    question: "Why mix with white and black instead of only changing lightness in HSL?",
    answer:
      "Mixing in RGB with white and black matches how designers often describe brand scales (lighter tints, darker shades) and produces predictable ramps for a single brand color. HSL lightness can work too, but pure HSL lightening can shift perceived hue; mixing keeps ramps visually tied to your swatch. This tool uses linear RGB mixing for straightforward handoff to developers.",
  },
  {
    question: "Can I use these colors for text and still meet WCAG contrast?",
    answer:
      "Any tint or shade might fail contrast against arbitrary backgrounds. After you pick candidates, validate pairs with a contrast checker—especially body text (aim for WCAG AA 4.5:1 or better for normal text). Lighter tints often work as large backgrounds; darker shades often work for text on light UI.",
  },
  {
    question: "What does uploading an image do?",
    answer:
      "The tool reads the image in your browser, averages pixel colors, and sets that average as the new base color—handy when you want a scale that harmonizes with a logo, screenshot, or mood board. Nothing is uploaded to a server; processing stays in the page.",
  },
  {
    question: "How do I copy values into Figma, CSS, or Tailwind?",
    answer:
      "Copy individual hex codes from each swatch, or use Copy all HEX for a plain list. Copy CSS variables outputs :root custom properties you can paste into global styles or adapt to Tailwind theme extensions. Rename the --color-* tokens to match your design tokens.",
  },
  {
    question: "Does the base color appear twice in the scale?",
    answer:
      "The center swatch is always your exact base hex. Tints stop short of pure white and shades stop short of pure black so every step remains clearly related to the brand color; you can still add pure #ffffff and #000000 in your system separately.",
  },
];
