export const gitignoreGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does this .gitignore generator do?",
      answer:
        "You pick languages, frameworks, operating systems, and editors from a checklist. The tool merges curated ignore rules into one file you can copy or download. Everything runs in your browser—no upload of your repository is required unless you choose to load an existing .gitignore from disk to edit it locally.",
    },
    {
      question: "Is my project sent to your servers?",
      answer:
        "No. Templates are bundled with the page and merging happens in JavaScript inside your tab. If you use Upload, the file is read with the File API in the browser only. Download uses a blob URL; nothing is posted to an API for generation.",
    },
    {
      question: "Should I commit .gitignore to Git?",
      answer:
        "Yes, for almost all projects. A tracked .gitignore helps every clone ignore the same build outputs, dependencies, and OS junk. Pair it with good secrets hygiene: never commit API keys or .env files with real credentials—many templates ignore .env but you still must not push secrets.",
    },
    {
      question: "Why are some rules duplicated after I select Node and Next.js?",
      answer:
        "Next.js builds on Node; some patterns overlap (for example .next/ may appear conceptually under both). The generator uses separate sections with headers. If you see duplicate lines, you can delete one in the editor before download. Use Reset to presets to snap back to a clean merge from your current selections.",
    },
    {
      question: "Does this replace GitHub’s official gitignore templates?",
      answer:
        "It is a fast, opinionated subset for common stacks. For edge cases or rare tools, copy extra lines from GitHub’s gitignore repository or your framework docs. This page is meant for bootstrapping repos and teaching which categories belong in a .gitignore.",
    },
    {
      question: "How do negation rules work (! pattern)?",
      answer:
        "Lines starting with ! re-include a path that a broader rule excluded. Some templates use !.env.example so you can commit a sample env file while ignoring real .env files. Order matters: the last matching rule wins for a given path.",
    },
    {
      question: "Can I ignore a file that is already tracked?",
      answer:
        "Adding it to .gitignore only affects untracked files. If Git already tracks a file, run git rm --cached <file> (or the folder) and commit, then keep the pattern in .gitignore. Otherwise the file stays in history until you rewrite history.",
    },
    {
      question: "What related tools should I use with this?",
      answer:
        "Use the password generator for local test credentials, the UUID generator for IDs in fixtures, and the JSON or YAML formatters when you edit config samples you do commit. For deployment URLs and headers, the redirect chain checker and SSL certificate checker help validate production endpoints.",
    },
  ];
