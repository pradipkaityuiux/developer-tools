export const numberConverterFaqItems: { question: string; answer: string }[] =
  [
    {
      question:
        "What is a number system converter and who uses binary, octal, decimal, and hex?",
      answer:
        "A number system converter translates the same integer value between radices—most often base 2 (binary), base 8 (octal), base 10 (decimal), and base 16 (hexadecimal). Firmware engineers, OS students, reverse engineers, web developers (colors and pointers), and anyone reading datasheets or memory dumps use these bases daily. This page focuses on whole integers using JavaScript BigInt so large bit patterns stay exact.",
    },
    {
      question: "Are my numbers sent to your servers?",
      answer:
        "No. Parsing and formatting run entirely in your browser. Pasting values, loading a local text file, and copying outputs never upload content to our backend unless you use another tool on the site that explicitly calls an API.",
    },
    {
      question:
        "Can I paste C-style prefixes like 0x for hex, 0b for binary, or 0o for octal?",
      answer:
        "Yes. After you pick the input base, you can include optional prefixes (0x/0X, 0b/0B, 0o/0O). Underscores and spaces in the middle of the digit string are stripped for readability. Leading zeros are allowed.",
    },
    {
      question: "Does this tool support fractions or floating-point values?",
      answer:
        "No. It converts integers only (including negative integers). For fractional bases you would need fixed-point or floating-point rules that vary by language; use your compiler or language-specific docs for those cases.",
    },
    {
      question: "Why does very large binary take a long line in the output?",
      answer:
        "Binary expands quickly: each decimal digit needs about log2(10) ≈ 3.32 bits on average. Enable “Group binary by 4 bits” to insert spaces between nibbles for easier reading next to hex dumps. Copy still uses the grouped text when that option is on.",
    },
    {
      question: "How is this different from a Base64 encoder?",
      answer:
        "Base64 encodes raw bytes as text using a 64-character alphabet; it is not a change of radix for a single integer. Use our Base64 tool when you need MIME-style encoding of strings or files; use this converter when you need binary, octal, decimal, or hex representations of numeric values.",
    },
    {
      question: "Which related tools pair with a radix converter?",
      answer:
        "Use the hash generator for digests of byte strings, the Unix timestamp converter when epoch values cross decimal and hex in logs, the JWT decoder when segments look like Base64URL, and the regex tester when you validate digit patterns in parsers.",
    },
  ];
