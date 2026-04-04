export const textReverserFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is the difference between reverse full text, reverse words per line, and reverse each line?",
    answer:
      "Reverse full text flips every character in the entire paste, including newlines, so the last character of the document becomes first. Reverse words per line keeps line breaks but swaps the order of words on every line—ideal for mirrored sentences or puzzle copy. Reverse each line flips the characters inside each line only, so line order and count stay the same while every row reads backward.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. Reversal runs with JavaScript in your browser. Paste, type, or load a local file with the FileReader API; nothing is uploaded unless you navigate to another tool that explicitly performs network requests.",
  },
  {
    question: "Does word reversal preserve extra spaces between words?",
    answer:
      "Words mode trims each line for splitting, then joins reversed words with a single space. Multiple spaces, tabs, or leading and trailing spaces on a line are normalized in the output. If you must keep exact whitespace, use reverse full text or reverse each line, or normalize first with a dedicated whitespace tool from the Text and String Tools section.",
  },
  {
    question: "How are Windows and Mac line endings handled?",
    answer:
      "The tool splits on carriage return, line feed, or CRLF pairs, then writes the result with newline characters. Most editors accept that; if you need strict CRLF for a Windows-only pipeline, convert line endings in your IDE after copying.",
  },
  {
    question: "Will emoji and accented letters reverse correctly?",
    answer:
      "Reversal uses JavaScript string iteration, which works well for many Unicode characters including most emoji and combining marks in common text. Very complex sequences (certain flags or rare joiners) can still look odd when mirrored—that is a browser limitation, not encryption or security.",
  },
  {
    question: "Is reversed text a good way to hide passwords or secrets?",
    answer:
      "No. Reversal is trivial to undo and offers no confidentiality. Use a password manager and proper encryption for secrets. This page is for puzzles, UI demos, teaching, and quick string experiments only.",
  },
  {
    question: "Which other tools pair with a text reverser?",
    answer:
      "Use the text case converter for casing experiments, the word counter to compare lengths before and after reversal, the text diff checker when comparing original and transformed drafts, and the ROT13 or Caesar cipher tools if you want classic obfuscation demos—all listed under Text and String Tools on the home page.",
  },
];
