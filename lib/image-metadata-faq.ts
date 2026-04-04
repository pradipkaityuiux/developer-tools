export const imageMetadataFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is EXIF metadata in a photo?",
    answer:
      "EXIF (Exchangeable Image File Format) embeds technical and descriptive data inside many JPEG, TIFF, HEIC-with-EXIF, WebP, and PNG files—camera make and model, lens, exposure settings, timestamps, orientation, and sometimes GPS coordinates. This viewer reads those tags in your browser so you can audit what a file reveals before sharing or publishing.",
  },
  {
    question: "Are my images uploaded to your server?",
    answer:
      "No. Files stay in your tab: we use the File API and the exifr library to parse bytes locally, similar to our other file tools (for example the image to Base64 converter on this site). Disconnect from the network and the tool still works for supported formats your browser can decode.",
  },
  {
    question: "Why do some images show dimensions but almost no EXIF?",
    answer:
      "Many social networks, messengers, and export pipelines strip EXIF for privacy or size. Screenshots and exported graphics often lack camera tags. SVG and some Web assets may only expose dimensions. RAW files may not decode in-browser; use desktop software for proprietary RAW containers.",
  },
  {
    question: "How accurate is GPS data from EXIF?",
    answer:
      "GPS IFD values come from the device that recorded the photo. Accuracy depends on the camera or phone GNSS fix at capture time. Treat coordinates as sensitive personal data: remove or scrub location before posting publicly. This page displays values for analysis; it does not send them anywhere.",
  },
  {
    question: "What is the difference between EXIF orientation and pixel dimensions?",
    answer:
      "Orientation (tag 274) tells viewers how to rotate or mirror pixels for display. Displayed width and height in this tool follow the decoded bitmap your browser draws, which usually applies orientation. EXIF ImageWidth and ImageHeight may reflect sensor dimensions before rotation—compare both when debugging layout or CMS imports.",
  },
  {
    question: "Can I copy metadata for tickets, CMS fields, or reports?",
    answer:
      "Yes. Use Copy summary for a readable plain-text report or Copy JSON for structured data. For checksums of the original file bytes, use the file hash checker elsewhere in the file tools section. For embedding the image as a data URI after review, use the image to Base64 converter.",
  },
  {
    question: "Does viewing EXIF prove a photo is unedited?",
    answer:
      "No. EXIF can be rewritten or removed by editing software. Maker notes and some fields are useful for workflow clues but are not legal proof of authenticity on their own. Combine metadata review with file hashes, provenance systems, and chain-of-custody practices when that matters.",
  },
  {
    question: "Which formats work best for EXIF inspection here?",
    answer:
      "JPEG from cameras and phones usually has the richest tags. PNG and WebP may carry EXIF in newer exports. TIFF and similar TIFF-based containers are supported when parsed as image files. If the tool reports no EXIF, the data may be absent or stored in sidecar files not loaded with the image.",
  },
];
