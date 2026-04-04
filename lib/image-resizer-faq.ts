export const imageResizerFaqItems: { question: string; answer: string }[] = [
  {
    question: "Are my images uploaded to your server?",
    answer:
      "No. Files are read with the File API and decoded with an HTML canvas in your browser tab. Resized pixels never leave your device unless you explicitly download them or copy them to the clipboard yourself.",
  },
  {
    question: "What is the difference between pixel mode and percentage mode?",
    answer:
      "Percentage mode scales width and height together from the original dimensions—for example 50% halves both sides. Pixel mode sets exact output width and height; when aspect ratio lock is on, changing one dimension recalculates the other so the image is not stretched.",
  },
  {
    question: "Will resizing always keep my PNG transparency?",
    answer:
      "PNG and WebP outputs preserve alpha when the browser supports it. If you export to JPEG, transparent areas are typically filled with black or another matte color because JPEG has no alpha channel. Use PNG or WebP when you need transparency.",
  },
  {
    question: "Why did my animated GIF become a still image?",
    answer:
      "Canvas-based resizing draws a single frame. Animated GIFs are decoded as one raster snapshot, so motion and timing are lost. For animated assets, use dedicated GIF editors or server-side tooling; this page is aimed at static photos, screenshots, and UI graphics.",
  },
  {
    question: "Is there a maximum width or height?",
    answer:
      "Browsers impose memory limits on canvas dimensions. This tool warns when an edge exceeds 8,192 pixels or when width times height is extremely large. If you hit a limit, reduce percentage or pixel targets, or preprocess the file with desktop software.",
  },
  {
    question: "How do I get smaller file sizes after resizing?",
    answer:
      "Fewer pixels usually mean smaller files, but format and compression still matter. After resizing, try the image compressor for JPG and PNG, convert formats with the image format converter, or embed small assets with the image to Base64 converter when your stack expects data URIs.",
  },
  {
    question: "Why does copy image fail in some browsers?",
    answer:
      "Copying a bitmap uses the async Clipboard API with image/png blobs. Some browsers require a secure context (HTTPS or localhost), user permission, or disallow image clipboard writes entirely. If copy fails, use download instead and attach the file manually.",
  },
];
