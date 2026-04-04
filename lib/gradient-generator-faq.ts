export const gradientGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a CSS gradient generator?",
    answer:
      "A CSS gradient generator is a visual editor that builds linear-gradient and radial-gradient values from color stops, angles, and positions so you can preview the blend in the browser and copy ready-to-paste CSS for backgrounds, overlays, and hero sections—without memorizing syntax or hand-tuning percentages.",
  },
  {
    question: "What is the difference between linear and radial gradients?",
    answer:
      "A linear gradient transitions colors along a straight line defined by an angle or side keywords (for example left to right). A radial gradient radiates outward from a center point in a circle or ellipse, which is ideal for spotlights, vignettes, and soft circular blends. Both use color stops with optional positions between 0% and 100%.",
  },
  {
    question: "How do color stops work in CSS gradients?",
    answer:
      "Each stop is a color plus an optional position along the gradient line (linear) or ray (radial). Browsers interpolate between stops. If you omit positions, stops are spread evenly. Uneven spacing (for example 0%, 30%, 100%) creates sharper or softer transitions. You can add or remove stops in this tool and drag positions to match your design.",
  },
  {
    question: "Can I sample colors from a photo for my gradient?",
    answer:
      "Yes. Use Upload image (upload icon) to load a JPEG, PNG, or WebP. The tool samples horizontal bands from the image and turns them into three color stops so you get a palette-aligned gradient in one click. You can still edit hex values and positions afterward. Nothing is uploaded to a server; decoding uses a canvas in your browser.",
  },
  {
    question: "Will this CSS work in all browsers?",
    answer:
      "Modern evergreen browsers support linear-gradient and radial-gradient without prefixes. Very old browsers may need legacy vendor prefixes; for new projects, unprefixed syntax is standard. Test complex radial shapes (farthest-corner, ellipse sizing) if you support legacy Safari versions.",
  },
  {
    question: "How is this different from a multi-stop CSS gradient builder?",
    answer:
      "This page focuses on fast two- to five-stop gradients with linear and radial modes and image sampling. For up to twelve stops, CSS direction keywords, and repeating-linear or repeating-radial modes, use the CSS Gradient Generator at /design/css-gradient in the same design section—both output standards-based background-image CSS.",
  },
  {
    question: "Can I use the output in Tailwind CSS or component libraries?",
    answer:
      "Yes. Copy the gradient function (or full background-image line) into arbitrary properties such as arbitrary background-image in Tailwind, or pass the string into a style object in React and Vue. For design tokens, paste the hex stops into your theme file and keep the angle or radial position as variables.",
  },
];
