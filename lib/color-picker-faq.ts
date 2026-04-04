export const colorPickerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is HEX, RGB, HSL, and CMYK in simple terms?",
    answer:
      "HEX is a six-digit shorthand for RGB on the web (#RRGGBB). RGB mixes red, green, and blue light (0–255 each). HSL describes the same color as hue, saturation, and lightness—handy for theming. CMYK is a print-oriented mix of cyan, magenta, yellow, and black ink; it is useful for brand handoffs to print vendors even though browsers primarily use sRGB.",
  },
  {
    question: "Are colors processed on your servers?",
    answer:
      "No. The picker, conversions, clipboard copy, image sampling, and system eyedropper (when available) run entirely in your browser. Nothing is uploaded for color conversion.",
  },
  {
    question: "Why does CMYK not match what I see on screen?",
    answer:
      "Screens use additive RGB (light); print uses subtractive CMYK (ink). Any CMYK values shown here are a common mathematical conversion from sRGB for reference. Final print proofing always depends on paper, ink, and ICC profiles at the print shop.",
  },
  {
    question: "How do I sample a color from an uploaded image?",
    answer:
      "Click Upload image, choose a PNG, JPEG, WebP, GIF, or other browser-supported raster image, then click anywhere on the preview. The tool reads that pixel from a canvas and updates HEX, RGB, HSL, and CMYK.",
  },
  {
    question: "What is the browser EyeDropper and where does it work?",
    answer:
      "Chromium-based browsers expose the EyeDropper API: pick Sample from screen to grab a color from anywhere on your display. It may require a secure context (HTTPS or localhost) and user permission. Safari and Firefox may hide the button when the API is unavailable.",
  },
  {
    question: "Which format should I paste into CSS?",
    answer:
      "Use HEX or rgb()/hsl() for modern stylesheets. Copy buttons output strings ready for CSS. For design tokens in JavaScript or JSON, HEX and comma-separated RGB are common. CMYK is mainly for print specs, not screen CSS.",
  },
  {
    question: "How is this different from the contrast checker or palette tools?",
    answer:
      "This page focuses on picking one color and copying exact values. For WCAG contrast ratios use the color contrast checker. For harmonies from a base hue use the palette generator, and for CSS gradients use the gradient generator—each is linked from this page.",
  },
];
