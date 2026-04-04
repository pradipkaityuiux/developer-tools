export const borderRadiusFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does the CSS border-radius property do?",
    answer:
      "The border-radius property rounds the corners of an element’s border box. You can set one value for all corners, two to four values using shorthand rules (matching top-left, top-right, bottom-right, and bottom-left in order), or slash-separated horizontal and vertical radii for elliptical corners. This generator focuses on the common four-corner radii you need for cards, buttons, and modals.",
  },
  {
    question: "How do I read border-radius shorthand with four values?",
    answer:
      "With four lengths, the order is top-left, top-right, bottom-right, bottom-left—like going clockwise from the top-left corner. With three values, the middle number sets both top-right and bottom-left. With two values, the first sets top-left and bottom-right, and the second sets top-right and bottom-left. This tool picks the shortest valid shorthand for your numbers.",
  },
  {
    question: "Should I use px, rem, or % for border-radius?",
    answer:
      "Use px when you want fixed rounding that does not scale with root font size. Use rem when radii should scale with accessibility or typography settings (common in design systems). Percentages are relative to the element’s own width and height, so they work well for circular avatars or fluid shapes but can look uneven on wide rectangles. Pair rounded UI with the color picker for fills and the contrast checker when text sits on colored surfaces.",
  },
  {
    question: "What is the 9999px pill trick?",
    answer:
      "Setting a very large pixel radius (often 9999px) guarantees fully rounded ends on buttons and chips of any width, because each corner arc caps at half the side length. The Pill preset on this page outputs border-radius: 9999px, which is a common production pattern alongside spacing and shadow from the box shadow generator.",
  },
  {
    question: "Does border-radius clip background images and overflow?",
    answer:
      "Yes. Border-radius affects painting: backgrounds, background images, and nested content can be clipped to the rounded shape when overflow is hidden or when the browser paints the rounded background. For images inside a card, apply border-radius to the image or the wrapper and test with your real assets—use Upload preview here to sanity-check a photo behind the curve.",
  },
  {
    question: "How do I match this tool’s output with Tailwind CSS?",
    answer:
      "Copy the border-radius declaration into arbitrary properties (for example arbitrary rounded-[…] in Tailwind v3+) or map the values to your theme’s radius scale in rem. For gradients and fills that sit behind rounded shells, build backgrounds with the gradient generator or CSS gradient tool, then apply the radius you export here.",
  },
  {
    question: "Are my uploaded preview images sent to your servers?",
    answer:
      "No. Preview images load with a file URL in your browser tab only. Nothing is uploaded to a backend; the tool is suitable for UI mockups and screenshots you do not want to share externally.",
  },
  {
    question: "How is this related to layout tools like Flexbox or Grid?",
    answer:
      "Border-radius styles the box after layout. Use the flexbox playground or CSS grid playground to structure rows and columns, then paste border-radius from this generator on cards, panels, and media wrappers for a polished component shell.",
  },
];
