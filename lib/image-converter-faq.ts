export const imageConverterFaqItems: { question: string; answer: string }[] = [
  {
    question: "Can I convert JPG to PNG or PNG to WebP in the browser?",
    answer:
      "Yes. This tool decodes your image with the browser’s built-in codecs, draws it to a canvas, and exports a new file in PNG, JPEG, or WebP. Conversion runs locally in your tab—no upload to a server.",
  },
  {
    question: "Will transparency be preserved when I convert PNG to JPG?",
    answer:
      "No. JPEG does not support an alpha channel. The tool composites transparent areas on a white background before exporting as JPEG, which matches what most CMS and email tools expect when they ask for a .jpg.",
  },
  {
    question: "Is WebP supported everywhere I need to ship images?",
    answer:
      "Modern browsers and many CDNs support WebP well for the web. Some older email clients still prefer JPEG or PNG. If a stakeholder requires a specific format, pick PNG for lossless graphics, JPEG for photos, and WebP when you want smaller files for responsive sites.",
  },
  {
    question: "Are my photos uploaded to your servers?",
    answer:
      "No. FileReader and the Canvas API process the image only inside your browser. The download and optional clipboard copy use blobs generated on your device.",
  },
  {
    question: "Why does my WebP or JPEG file size change when I adjust quality?",
    answer:
      "JPEG and WebP are lossy at most quality settings: lowering the slider removes more detail to shrink bytes. PNG is lossless for each export, so size depends on image complexity more than a simple quality dial.",
  },
  {
    question: "What is the difference between this and the image compressor or resizer?",
    answer:
      "This page changes the file format (for example PNG to WebP). The image compressor focuses on shrinking bytes within a format, and the image resizer changes pixel dimensions. You can chain workflows: resize or compress first, then convert format if your CMS or email template requires it.",
  },
  {
    question: "Can I copy the converted image instead of downloading?",
    answer:
      "Yes. After conversion, use Copy image to place the result on the clipboard (where the browser allows), for example to paste into design tools or chat. If clipboard image copy is blocked, use Download instead.",
  },
];
