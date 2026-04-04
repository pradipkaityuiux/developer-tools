export const cssGradientFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a multi-stop CSS gradient generator?",
    answer:
      "A multi-stop CSS gradient generator lets you define many color stops along a linear or radial axis, each with an exact percentage, so you can build smooth rainbow blends, stepped brand ramps, metallic effects, and UI mesh-style backgrounds. This page outputs standards-based linear-gradient, radial-gradient, and repeating variants you can paste into background-image, Tailwind arbitrary values, or inline styles—everything is computed locally in your browser.",
  },
  {
    question: "Should I use an angle or direction keywords for linear gradients?",
    answer:
      "Use CSS direction keywords such as to right or to bottom when you want readable, maintainable code that matches how designers describe flow. Use degrees (for example 135deg) when you need precise rotation independent of writing mode or when you are matching a mock from Figma or Sketch. Both are valid; this tool lets you switch modes and still edit the same color stops.",
  },
  {
    question: "How do repeating-linear-gradient and repeating-radial-gradient work?",
    answer:
      "Repeating gradients take the same color-stop list as the non-repeating functions but tile the pattern along the line or from the center. The distance between your first and last meaningful stops controls how often the pattern repeats—tighter stops create stripes and rhythm; wider spreads create subtle texture. Preview here before pasting into cards, buttons, or hero sections.",
  },
  {
    question: "Can I sample colors from an image to seed my gradient?",
    answer:
      "Yes. Click Upload image (upload icon), pick a PNG, JPEG, WebP, or GIF, and the tool averages horizontal bands into starter stops you can refine. No file leaves your device—the image is decoded with a canvas in the browser. For single-color precision from a screenshot, pair this with the color picker tool in the same design section.",
  },
  {
    question: "How is this page different from the Gradient Generator tool?",
    answer:
      "The Gradient Generator emphasizes fast two- to five-stop linear and radial presets. This CSS Gradient Generator adds up to twelve stops, a choice between degree angles and to-* keywords, and repeating gradient modes for patterns—ideal when you are hand-tuning a complex stop list for production CSS.",
  },
  {
    question: "Will my gradients meet WCAG contrast for text?",
    answer:
      "Gradients are not a single solid color behind text, so automated contrast checks apply to worst-case slices. Test the lightest and darkest areas behind your copy, or simplify to a solid pair using the color contrast checker linked from our design tools. For body text over busy backgrounds, consider a translucent scrim or a darker overlay.",
  },
  {
    question: "Can I use the copied CSS in Tailwind CSS or CSS modules?",
    answer:
      "Yes. Paste the full background-image declaration into a stylesheet or use arbitrary properties in Tailwind such as bg-[linear-gradient(...)] with the gradient function from this tool. In React or Vue, assign the gradient string to style.backgroundImage. Keep hex stops aligned with your design tokens for consistency.",
  },
];
