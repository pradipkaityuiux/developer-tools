export const emailExtractorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is an email extractor and when do teams use it?",
    answer:
      "An email extractor scans pasted text or HTML and lists every address it can recognize, usually with duplicates removed. Sales and marketing teams use it to prep outreach lists from forwarded threads; recruiters pull contacts from exports; developers audit HTML templates for hard-coded addresses; support agents inventory recipients from ticket dumps. This page runs entirely in your browser so sensitive paste buffers stay local.",
  },
  {
    question: "Is my pasted text or uploaded file sent to your servers?",
    answer:
      "No. The extractor uses JavaScript in your tab. File upload reads bytes with the File API on your device; nothing is transmitted to our backend unless you navigate to another tool that explicitly performs network requests.",
  },
  {
    question: "How does deduplication work?",
    answer:
      "Addresses are compared case-insensitively (the part before and after @), matching how most mail systems treat casing. The first spelling you paste is kept in the output list; later copies of the same address are skipped so you get a clean unique set for CRM import or spreadsheet work.",
  },
  {
    question: "Does it understand mailto: links in HTML?",
    answer:
      "Yes. It scans for mailto: URLs and decodes percent-encoding in the address portion, then merges those results with addresses found in visible text after tags are stripped. Obfuscated formats like “name [at] domain dot com” are not expanded—paste decoded text or fix those manually.",
  },
  {
    question: "Are extracted addresses guaranteed to be deliverable?",
    answer:
      "No. Pattern matching finds strings that look like emails; it does not verify DNS, MX records, or mailbox existence. Always validate consent, suppression lists, and regional email laws before sending campaigns. For URL inventories from the same pages, pair this workflow with our URL extractor under Text and String Tools.",
  },
  {
    question: "Why might a real email be missing from the results?",
    answer:
      "Addresses split across lines, heavily encoded in images, or written with unusual Unicode homoglyphs may not match the parser. Content inside ignored regions could also differ from what you see rendered. When in doubt, paste plain text or simplify the HTML and run again.",
  },
  {
    question: "How should I export the list for spreadsheets or CRM tools?",
    answer:
      "Choose one address per line for pasting into Google Sheets or Excel columns, or switch to comma-separated or semicolon-separated output when a form expects a single field. Use the copy button to grab the formatted block instantly.",
  },
  {
    question: "Which related tools should I use with the email extractor?",
    answer:
      "Pull link targets from the same source with the URL extractor, dedupe pasted rows with the duplicate line remover, normalize spacing with the whitespace remover, convert newline lists to CSV-style lines with the comma separator tool, or run pattern-based cleanup with the find and replace tool—all listed in the Text and String Tools section on the home page. For structured tables, explore CSV utilities under File and Data Tools.",
  },
];
