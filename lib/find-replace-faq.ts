export const findReplaceFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is an online find and replace tool?",
    answer:
      "It is a browser-based editor that searches your pasted text for a phrase or pattern and substitutes another string everywhere (or for each regex match). You avoid installing VS Code or Notepad++ for quick bulk edits to exports, configs, or long documents. This page runs entirely on your device.",
  },
  {
    question: "Does find and replace run on my computer or on a server?",
    answer:
      "Processing happens locally in your browser with JavaScript. Pasted text and files you upload are read with the File API on your machine; nothing is sent to our servers for the search-and-replace step.",
  },
  {
    question: "What is the difference between plain text and regex mode?",
    answer:
      "Plain text treats your find field as literal characters (parentheses, dots, and stars are not special). Regex mode uses JavaScript regular expression syntax so you can match patterns like digits, word boundaries, or optional groups. Invalid regex patterns show an error instead of changing your text.",
  },
  {
    question: "How do I do a case-insensitive find and replace?",
    answer:
      "In plain text mode, turn off “Match case.” In regex mode, enable the “Ignore case (i)” flag or include i in your pattern flags. That way “Hello” and “hello” both match when you search for one of them.",
  },
  {
    question: "Can I use capture groups in the replacement string?",
    answer:
      "Yes in regex mode. JavaScript replacement rules apply: $1 is the first capturing group, $& is the whole match, and $$ is a literal dollar sign. Test tricky patterns in our Regex tester under Developer Tools if you want a dedicated regex workspace.",
  },
  {
    question: "Why does regex mode always use the global flag?",
    answer:
      "Without the global flag, String.replace in JavaScript only replaces the first match. This tool adds g so every match in the document is replaced, which matches how most bulk find-and-replace workflows behave.",
  },
  {
    question: "Will newlines and Windows line endings break my search?",
    answer:
      "Your text keeps its original line breaks in the editor. In regex mode you can enable multiline (m) so ^ and $ match line starts and ends, or use \\n in the pattern for explicit newlines. For normalizing endings first, use the whitespace remover or case converter workflows linked from the Text and String tools section.",
  },
  {
    question: "How is this different from the duplicate line remover?",
    answer:
      "Duplicate line remover collapses repeated whole lines while preserving order of first appearances. Find and replace rewrites substrings or pattern matches inside lines—ideal for renaming variables, fixing typos, or reformatting tokens. Use both in sequence when cleaning large paste dumps.",
  },
  {
    question: "What related tools should I use after find and replace?",
    answer:
      "Compare two versions with the text diff checker, count length changes with the word counter, dedupe lists with the duplicate line remover, and validate complex patterns with the regex tester. All live in the same Text and String or Developer sections on the home page.",
  },
];
