export const yamlToJsonFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this YAML to JSON converter do?",
    answer:
      "You paste YAML text (or load a snippet from a config file). The tool parses it in the browser and prints valid JSON with indentation. It supports multiple YAML documents in one file: each document becomes one JSON value, and if there is more than one document the result is a JSON array of those values.",
  },
  {
    question: "Is my YAML sent to your servers?",
    answer:
      "No. Parsing and conversion run entirely in your browser with js-yaml. Nothing is uploaded for this tool unless you explicitly use a different feature elsewhere on the site that calls an API.",
  },
  {
    question: "Why does conversion fail with a line and column in the error?",
    answer:
      "YAML is indentation-sensitive. A missing colon, inconsistent spaces versus tabs, or a bad anchor alias usually triggers a parse error. The message points to the approximate location in your input so you can fix the structure and try again.",
  },
  {
    question: "Can I convert JSON back to YAML?",
    answer:
      "Yes—use our JSON to YAML converter when you need the opposite direction for Kubernetes manifests, GitHub Actions, or other YAML-first workflows.",
  },
  {
    question: "Does YAML merge (<<) and custom tags work?",
    answer:
      "Standard YAML features supported by js-yaml—including merge keys and many tags—parse when the schema allows them. Exotic or application-specific tags may fail or stringify unexpectedly; for those files, validate in the same environment that consumes the YAML (for example kubectl or your CI runner).",
  },
  {
    question: "How do dates and nulls map to JSON?",
    answer:
      "YAML null becomes JSON null. YAML booleans and numbers become JSON booleans and numbers. Parsed YAML timestamps often become JavaScript Date objects, which this tool turns into ISO-8601 strings in the JSON output so the result stays valid JSON.",
  },
  {
    question: "Can I use this for secrets or production configs?",
    answer:
      "You can use it to debug structure, but avoid pasting live secrets into any online tool if your policy forbids it. Prefer local editors or sanctioned internal tools for credential-bearing files. The browser still holds the text in memory while the tab is open.",
  },
  {
    question: "Why is my JSON huge compared to the YAML?",
    answer:
      "JSON repeats keys and quotes on every line, while YAML relies on indentation and often omits quotes for simple scalars. The underlying data is the same; JSON is just more verbose on disk.",
  },
];
