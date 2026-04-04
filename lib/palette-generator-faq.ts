export const paletteGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question:
        "What is a complementary color palette and when should I use it?",
      answer:
        "A complementary palette pairs your base hue with another roughly 180° away on the color wheel (for example blue and orange). It creates strong contrast—ideal for call-to-action buttons on neutral backgrounds, sports branding, or anywhere you want two hues to pop against each other. After picking colors here, validate text contrast with our WCAG contrast checker before shipping UI.",
    },
    {
      question: "How does a triadic palette differ from complementary?",
      answer:
        "Triadic schemes use three hues spaced about 120° apart (for example red, yellow, and blue). They stay vibrant but feel more balanced than pure complementary pairs because no single opposition dominates. Use one color as primary and the other two as accents. Our generator keeps your saturation and lightness so you can tune mood with the HSL sliders.",
    },
    {
      question: "What are analogous colors good for?",
      answer:
        "Analogous palettes cluster neighboring hues (here, ±18° and ±36° around your base). They read as harmonious and calm—common for dashboards, editorial sites, and nature-inspired brands. If contrast feels low for text, pair these fills with a neutral gray or increase lightness separation, then test with the contrast checker.",
    },
    {
      question: "Why does monochrome only change lightness?",
      answer:
        "Monochrome (or monochromatic) palettes hold hue and saturation fixed and step lightness. That mimics how designers build tints and shades for one brand color—buttons, borders, and backgrounds that feel cohesive. For a full lightness scale with named steps, you can also use the tint and shade generator after locking a brand hex.",
    },
    {
      question: "How does uploading an image set the base color?",
      answer:
        "We draw the image to an off-screen canvas and average the sRGB values of all pixels (alpha is blended on white). The result is converted to HSL so you can nudge hue, saturation, and lightness afterward. Busy photos may skew brown or gray—crop to a representative region in an editor first, or use the native color picker for a precise brand swatch.",
    },
    {
      question: "Is this color palette generator free and private?",
      answer:
        "Yes. Harmony math and image sampling run entirely in your browser. Nothing is uploaded to our servers. You can disconnect from the network after the page loads if you prefer an extra air gap for client work.",
    },
    {
      question: "Can I copy palettes into Figma, CSS, or design tokens?",
      answer:
        "Each swatch has a copy button for its HEX value. Use “Copy CSS vars” to paste a block of custom properties you can drop into stylesheets or token files. For RGB/HSL strings or CMYK handoff, open the color picker and converter tool and paste the same hex there.",
    },
    {
      question: "How do I check accessibility for color-blind users?",
      answer:
        "Harmony rules do not guarantee readable text. Always check contrast ratios for foreground and background pairs. After exporting hex codes, use our color blindness simulator to preview UI or graphics under common vision deficiencies and adjust hues if critical states become indistinguishable.",
    },
  ];
