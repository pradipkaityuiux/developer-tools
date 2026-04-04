export const imageCompressorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "Is this image compressor free and private?",
      answer:
        "Yes. Compression uses the Canvas API inside your browser tab. Files are not uploaded to our servers, and you can disconnect from the network after the page loads if you want an extra air gap for sensitive screenshots.",
    },
    {
      question: "Why does JPEG compression have a quality slider but PNG does not?",
      answer:
        "JPEG is a lossy format: lowering quality removes detail to shrink file size. Standard HTML5 canvas PNG export is lossless—there is no quality dial in the browser API. Choosing PNG re-encodes the image without adding JPEG-style artifacts, which can still change size slightly (for example by stripping metadata) but will not match the dramatic savings you get from lowering JPEG quality.",
    },
    {
      question: "Will my transparent PNG stay transparent after compression?",
      answer:
        "If you export as PNG, transparency is preserved when the browser composites onto the canvas. If you export as JPEG, transparency is not supported—semi-transparent areas are typically blended against a white background before encoding, which is how most client-side JPEG workflows behave.",
    },
    {
      question: "How much smaller will my files get?",
      answer:
        "It depends on the source. Photos and noisy screenshots usually shrink a lot as JPEG at 70–85% quality. Already-optimized JPEGs may change only slightly. PNG screenshots of UIs sometimes grow when re-saved as PNG; for maximum byte reduction on photographic content, compare JPEG output sizes.",
    },
    {
      question: "Does this replace ImageOptim, Squoosh, or a CDN image optimizer?",
      answer:
        "This tool is ideal for quick, local checks and one-off exports without installing software. Dedicated desktop apps and WASM codecs (for example WebP/AVIF with advanced settings) can squeeze out more bytes. For production sites, also use responsive images, caching, and a CDN—see our website tools for headers and redirects.",
    },
    {
      question: "What is the maximum file size?",
      answer:
        "Very large images may hit browser memory limits. The tool applies a soft cap with a clear error message so the tab stays responsive. For huge assets, resize first using an image resizer, then compress.",
    },
    {
      question: "Can I compress WebP or GIF inputs?",
      answer:
        "You can open many raster types the browser decodes (including WebP). Output is JPEG or PNG as you choose—convert WebP to JPEG for smaller photos, or to PNG when you need lossless edges. Animated GIFs are not preserved; only the first frame would be used if the browser decodes the file as a static bitmap.",
    },
    {
      question: "How is this different from the image resizer or Base64 converter?",
      answer:
        "The resizer changes pixel dimensions; this page changes encoder settings and format to reduce bytes at the same dimensions. The image-to-Base64 tool encodes bytes as text for HTML or APIs—it does not optimize file size. Use compress → then Base64 if you need both smaller binaries and inline strings.",
    },
  ];
