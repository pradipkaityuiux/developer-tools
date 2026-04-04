export const jsonToCsvFaqItems: { question: string; answer: string }[] = [
  {
    question: "What JSON shape does this JSON to CSV converter expect?",
    answer:
      "The tool works best with a JSON array of objects, where each object becomes one spreadsheet row and keys become column headers—for example [{\"id\":1,\"name\":\"Ada\"},{\"id\":2,\"name\":\"Bob\"}]. You can also paste an object that wraps an array under common property names such as data, items, results, records, or rows. Primitive arrays are converted into a single column named value.",
  },
  {
    question: "How does automatic column detection work?",
    answer:
      "We scan every object in order and build a header list from every key we see, preserving the order keys first appear. If later rows introduce new keys, those columns are appended. Missing keys in a row are left empty in the CSV so columns stay aligned.",
  },
  {
    question: "Are nested objects and arrays supported in cells?",
    answer:
      "Yes. Nested objects and arrays are serialized to a JSON string inside the cell so you do not lose information. For deeply nested analytics exports, consider flattening upstream or post-processing in Excel, Google Sheets, or a notebook if you need separate columns per nested field.",
  },
  {
    question: "Is my JSON uploaded to a server?",
    answer:
      "No. Parsing and CSV generation run entirely in your browser. Nothing is sent to our backend for this converter, which makes it suitable for sample production payloads as long as you still follow your own security and data-handling policies.",
  },
  {
    question: "Why add a UTF-8 BOM when I download?",
    answer:
      "Microsoft Excel on Windows often mis-detects UTF-8 CSV files without a byte order mark, which can garble accents and symbols. The optional BOM helps Excel open the file as UTF-8. You can turn it off if your toolchain prefers raw UTF-8.",
  },
  {
    question: "Comma or semicolon delimiter—which should I use?",
    answer:
      "Comma is standard RFC 4180 CSV and works well in most US/UK tools and code. Semicolon is common in European locales where Excel expects list separators that are not the decimal separator. Pick the delimiter that matches your spreadsheet locale.",
  },
  {
    question: "How is this different from your CSV to JSON tool?",
    answer:
      "JSON to CSV flattens structured JSON into a tabular file for spreadsheets and BI tools. CSV to JSON goes the other way: it parses delimiter-separated text into JSON structures. Many teams use both when moving data between APIs, logs, and Excel.",
  },
  {
    question: "Can I convert huge JSON files?",
    answer:
      "Very large pastes can slow down or freeze the tab because everything runs in the browser. For multi-gigabyte exports, prefer a streaming CLI tool or ETL pipeline. This page is ideal for configs, API samples, and moderate-sized extracts.",
  },
];
