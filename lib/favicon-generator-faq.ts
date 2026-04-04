export const faviconGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is a favicon and why does my site need one?",
      answer:
        "A favicon is the small icon browsers show on tabs, bookmarks, and sometimes in search results. It reinforces brand recognition, makes multitasking easier when many tabs are open, and looks more trustworthy than the default document icon. This generator outputs favicon.ico plus PNG sizes you can reference from HTML or a web app manifest.",
    },
    {
      question: "What sizes should I use for favicon.ico versus PNG icons?",
      answer:
        "Classic favicon.ico files often bundle 16×16, 32×32, and 48×48 so Windows and older browsers pick the best match. Modern sites also ship PNGs for apple-touch-icon (commonly 180×180) and for PWA manifest icons (192×192 and 512×512). Our tool builds a multi-resolution ICO from 16, 32, and 48 PNGs and lets you download the larger PNGs separately.",
    },
    {
      question: "How do I add these files to my Next.js or static site?",
      answer:
        "Place favicon.ico in your public root (for example public/favicon.ico) so it is served at /favicon.ico. Put PNGs next to it with clear names, then add link tags in your layout or head. Use the Copy HTML snippet button on this page for a starter block, then adjust paths if you use a subdirectory or CDN. For Next.js App Router, you can also use the file-based app/icon.png convention—export a square PNG and Next can generate variants.",
    },
    {
      question: "Can I create a favicon from text instead of a logo?",
      answer:
        "Yes. Switch to Text mode, enter one or two characters (initials or a glyph), pick background and text colors, and choose a system font stack. Text favicons stay sharp because we render each output size on its own canvas. Very long strings are clipped for readability—short monograms work best at 16×16.",
    },
    {
      question: "Does this tool upload my images to your servers?",
      answer:
        "No. Image decoding, canvas drawing, PNG encoding, and ICO packaging run entirely in your browser. After the page loads you can work offline. Nothing is sent to our infrastructure.",
    },
    {
      question: "Why does my photo look cropped in favicon previews?",
      answer:
        "Image mode defaults to Cover so the square is filled like most social avatars—edges may be cropped. Switch to Contain if you need the whole graphic visible (with letterboxing using your chosen background color). For logos with transparency, prefer PNG uploads and a background that matches your site header.",
    },
    {
      question: "Will every browser accept PNG data inside favicon.ico?",
      answer:
        "PNG-in-ICO is supported by all major current browsers and Windows. If you must support very old environments, test once in your target browsers; most production sites today rely on this format. You still receive standalone PNGs if you prefer linking only type=\"image/png\" icons.",
    },
  ];
