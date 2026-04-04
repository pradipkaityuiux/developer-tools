export const colorBlindnessFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a color blindness simulator used for in UI design?",
    answer:
      "A color blindness simulator shows how images or palettes may look to people with common color vision deficiencies (CVD). Product and design teams use it to check whether status colors, charts, and brand accents remain distinguishable—not to replace medical diagnosis or user testing with real participants. Pair simulation with the WCAG color contrast checker on this site for text legibility.",
  },
  {
    question: "Which types of color blindness does this tool simulate?",
    answer:
      "You can preview protanopia-style (red–green, L-cone), deuteranopia-style (red–green, M-cone), and tritanopia-style (blue–yellow, S-cone) transformations using Machado-style matrices, plus optional achromatopsia (grayscale) for complete absence of chromatic cues. Severity sliders interpolate between normal vision and strong deficiency for the first three modes.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. Images load in your browser tab with the File API and are drawn to a canvas for pixel processing—nothing is sent to our servers. You can disconnect from the network and still use the tool, similar to our other client-side design utilities.",
  },
  {
    question: "How accurate is online CVD simulation compared to real vision?",
    answer:
      "Screen simulations are approximations based on display primaries and published models. Real color perception varies by individual, lighting, display calibration, and the exact type of deficiency. Use this tool to catch obvious collisions between reds and greens in charts or legends, then validate with real users and accessible patterns (icons, labels, patterns in fills).",
  },
  {
    question: "How do I test a brand palette for accessibility?",
    answer:
      "Paste HEX codes in the palette tab, pick a deficiency mode, and compare original swatches to simulated swatches. If two semantic states (success vs. warning) look too similar under deuteranopia, adjust hues or add non-color cues. For typography on colored backgrounds, follow up with the color contrast checker and document ratios in your design system.",
  },
  {
    question: "What is the difference between protanopia and deuteranopia?",
    answer:
      "Both affect red–green discrimination, but they correspond to different cone pathways in the model: protanopia relates to long-wavelength (L) sensitivity, deuteranopia to medium-wavelength (M). Many interfaces fail for both groups when they rely only on red vs. green without labels; simulation helps you see when pairs collapse together on screen.",
  },
  {
    question: "Can I copy simulated HEX values for handoff?",
    answer:
      "Yes. Use the copy buttons next to the palette output to copy a list of simulated HEX codes or a short CSS comment block for tickets or documentation. Icons use the standard copy control from Lucide for consistency with other tools on this site.",
  },
  {
    question: "Does simulating color blindness replace WCAG contrast testing?",
    answer:
      "No. Contrast ratios measure luminance difference for text and UI components; CVD simulation checks hue discrimination for charts, icons, and decorative color coding. For body copy and buttons, still test contrast ratios. For heatmaps and dashboards, combine both—plus pattern, position, and text labels.",
  },
];
