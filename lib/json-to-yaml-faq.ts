export const jsonToYamlFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this JSON to YAML converter do?",
    answer:
      "You paste or type JSON (objects, arrays, strings, numbers, booleans, and null). The tool parses it in your browser and prints equivalent YAML—handy for Kubernetes manifests, Docker Compose, Ansible, GitHub Actions snippets, and any config that reads YAML while your source of truth is still JSON.",
  },
  {
    question: "Is my JSON sent to a server?",
    answer:
      "No. Parsing and YAML generation run entirely in your browser with JavaScript. Nothing is uploaded for conversion, which keeps API payloads, secrets in test fixtures, and internal configs off the wire—always double-check before pasting real production secrets anywhere.",
  },
  {
    question: "How is JSON different from YAML?",
    answer:
      "JSON is a strict, minimal data format with mandatory quotes and braces. YAML is a superset-style, indentation-based format that often reads like an outline. Many tools accept both; some (older CLIs, certain CI parsers) prefer YAML for multiline strings and comments—this converter helps you bridge from JSON to that style.",
  },
  {
    question: "Can I use this for Kubernetes or Helm?",
    answer:
      "Yes, when your starting point is JSON—such as exported API objects or generated config—you can convert to YAML for readability or to match examples in the Kubernetes docs. After converting, validate with kubectl dry-run or your cluster’s admission rules, and prefer the reverse path (YAML to JSON) with our YAML to JSON converter when APIs expect JSON.",
  },
  {
    question: "Why does my conversion fail with a parse error?",
    answer:
      "The input must be valid JSON: double-quoted keys and strings, no trailing commas, no comments, and no single-quoted strings. If you have JSON with comments or trailing commas, use our JSON formatter and validator first to clean the payload, or remove comments manually—JSON does not allow them.",
  },
  {
    question: "Does YAML support comments if I convert from JSON?",
    answer:
      "JSON has no comments, so the converter cannot invent them. The output is pure structure. Add your own # comments in the YAML editor after conversion if your pipeline allows them.",
  },
  {
    question: "What does “sort keys” change in the output?",
    answer:
      "Alphabetical sorting makes diffs more stable when you compare files in Git—useful for generated configs. Turn it off when you want key order to match the original JSON object insertion order (as far as the engine preserves it).",
  },
  {
    question: "How do I get back from YAML to JSON?",
    answer:
      "Use our dedicated YAML to JSON converter on this site for the opposite direction, with parse errors surfaced in plain language for broken indentation or tabs.",
  },
  {
    question: "Can I download the YAML file?",
    answer:
      "Yes. After a successful conversion, use Download to save a .yaml file, or Copy to place the text on the clipboard for editors and tickets.",
  },
];
