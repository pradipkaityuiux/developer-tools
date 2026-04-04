export const regexTesterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a regex tester and debugger?",
    answer:
      "A regex tester runs your pattern against sample text in the browser so you can see every match, its index, and captured groups without deploying code. This debugger highlights matches in the subject string, surfaces JavaScript RegExp syntax errors immediately, and helps you tune flags like case-insensitive (i) or multiline (m) before you paste the pattern into production.",
  },
  {
    question: "Which regex flavor does this tool use?",
    answer:
      "It uses JavaScript's built-in RegExp engine—the same rules as modern browsers and Node.js. That means features like named capture groups (?<name>…), Unicode property escapes (with the u flag), and dotAll (s flag) work when your runtime supports them. It is not PCRE, Python, or Ruby regex; those dialects differ in edge cases and advanced features.",
  },
  {
    question: "Why do I need the global (g) flag?",
    answer:
      "Without g, a JavaScript regex stops after the first match. That is correct when you only want to test anchoring or a single replacement. With g, match iteration continues through the whole subject, which is what you usually want when validating find-all style rules. This page's match table follows that behavior: one row per match when g is enabled, otherwise a single match row when the pattern succeeds.",
  },
  {
    question: "What is the difference between capturing and non-capturing groups?",
    answer:
      "Parentheses ( ) create capturing groups, numbered from left to right; they fill columns in the match table and backreferences like \\1. (?: … ) is a non-capturing group—it groups logic without saving a slice of the match. Use non-capturing groups when you need precedence or alternation but do not want extra capture indices.",
  },
  {
    question: 'Why does my pattern throw "Invalid regular expression"?',
    answer:
      "The engine rejected the pattern at compile time—often an unclosed bracket, a bad escape, or a flag incompatible with your syntax (for example, lookbehind in very old engines). Fix the source, escape literal braces and backslashes when needed, and confirm you are not mixing regex delimiters from another language (slashes are not typed here—only the raw pattern body).",
  },
  {
    question: "Can this tool validate email, URL, or HTML with 100% accuracy?",
    answer:
      "Regular expressions can approximate formats, but email and HTML are surprisingly subtle in the real world. Use this tester to explore a pattern and its false positives on your own samples, then prefer dedicated parsers or platform validators for critical paths. Pair complex text work with our find-and-replace and code-diff tools when you are editing configs or migrations in bulk.",
  },
  {
    question: "Does my pattern or test text leave this page?",
    answer:
      "No. Matching runs entirely in your browser with the native RegExp API—nothing is sent to a server. You can safely prototype patterns on internal sample strings, though you should still avoid pasting secrets into any web form out of habit.",
  },
  {
    question: "How do multiline (^ $) and dotAll (.) interact?",
    answer:
      "By default, ^ and $ anchor to the start and end of the whole string. The m flag makes them match line boundaries inside the subject. Without the s flag, . does not match newline characters; with s (dotAll), . spans across lines. Combining m and s is common for log or config snippets—test both on representative multiline samples here.",
  },
  {
    question: "What are catastrophic backtracking risks?",
    answer:
      "Some nested quantifiers (for example (a+)+ on certain inputs) can make the engine try an enormous number of paths and appear to hang. Online testers—including this one—cannot fully sandbox CPU time. If the page stutters, simplify the pattern, use possessive-style workarounds where supported, or break validation into smaller steps.",
  },
];
