export const boxShadowGeneratorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is the CSS box-shadow property used for?",
    answer:
      "The box-shadow property draws one or more shadows around an element’s frame. You control horizontal and vertical offset, blur radius, spread distance, color (often with transparency), and whether the shadow is drawn outside the box or as an inset shadow inside it. It is widely used for cards, buttons, modals, and elevation in design systems.",
  },
  {
    question: "What is the difference between blur and spread in box-shadow?",
    answer:
      "Blur softens the shadow edge: higher values produce a fuzzier, larger-looking halo. Spread grows or shrinks the shadow before blur is applied: positive spread makes the shadow bigger and more solid at the edges; negative spread pulls the shadow inward, which can produce a tighter, sharper ring. Together they let you mimic soft ambient light or crisp drop shadows.",
  },
  {
    question: "When should I use an inset box shadow?",
    answer:
      "Inset shadows appear inside the element border box. They are useful for pressed buttons, recessed panels, inner wells, and subtle highlights along the top edge of inputs. Combine inset with a low-opacity dark color for depth, or pair with a normal outer shadow for layered chrome effects.",
  },
  {
    question: "Does box-shadow affect layout or accessibility?",
    answer:
      "Box-shadow does not change box model dimensions or reflow surrounding content, but a large shadow can visually overlap nearby text or controls—leave enough padding and test zoom and dark mode. For WCAG contrast, shadows do not replace text or icon contrast against backgrounds; use the Color Contrast Checker when typography sits on colored surfaces.",
  },
  {
    question: "Should I copy WebKit-prefixed box-shadow?",
    answer:
      "Modern browsers support unprefixed box-shadow. Legacy Safari sometimes needed -webkit-box-shadow, but for new projects a single box-shadow declaration is usually enough. If you must support very old clients, add the prefixed line above the standard property in your stylesheet.",
  },
  {
    question: "How do I stack multiple box shadows?",
    answer:
      "Separate each shadow with commas in one box-shadow declaration: outer shadows first, then inset layers as needed. This generator outputs one shadow; you can paste the result into your CSS and duplicate the line with different offsets or colors to build layered elevation. Pair with gradients from a CSS gradient generator for richer backgrounds.",
  },
  {
    question: "Is this box shadow generator free and private?",
    answer:
      "Yes. All calculations run in your browser. Optional background images for the preview stay in memory via object URLs and are not uploaded to any server. You can disconnect from the network after the page loads if you prefer.",
  },
];
