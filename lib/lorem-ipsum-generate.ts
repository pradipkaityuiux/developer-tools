/** Escape text when embedding in HTML tags (uploaded words may contain special chars). */
export function escapeHtmlText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const DEFAULT_LOREM_WORD_POOL: string[] = (
  `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum
  curabitur pretium tincidunt lacus cras placerat convallis odio morbi dictum facilisis magna fusce dapibus tellus ut faucibus praesent bibendum sapien vehicula ullamcorper
  integer molestie augue sit amet ligula viverra volutpat donec sagittis dui vel ante pharetra sollicitudin maecenas metus urna interdum at porta nec dictum vitae diam
  vestibulum ante primis in faucibus orci luctus et ultrices posuere cubilia curae suspendisse potenti cras purus odio scelerisque nonummy`
)
  .split(/\s+/)
  .map((w) => w.trim())
  .filter(Boolean);

export const CLASSIC_FIRST_PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export const CLASSIC_FIRST_SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

function randomBelow(max: number): number {
  if (max <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! % max;
}

function pickWord(pool: string[]): string {
  return pool[randomBelow(pool.length)]!;
}

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word[0]!.toUpperCase() + word.slice(1);
}

function randomSentence(pool: string[]): string {
  const n = 6 + randomBelow(11);
  const words = Array.from({ length: n }, () => pickWord(pool));
  words[0] = capitalizeWord(words[0]!);
  let s = `${words.join(" ")}.`;
  s = s.replace(/\s+,/g, ",");
  return s;
}

function randomParagraph(pool: string[]): string {
  const n = 3 + randomBelow(4);
  return Array.from({ length: n }, () => randomSentence(pool)).join(" ");
}

function parseUploadedWords(text: string): string[] {
  return text
    .split(/[\s,.;:!?'"()[\]]+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0 && /[a-z0-9]/i.test(w));
}

export type LoremUnit = "words" | "sentences" | "paragraphs";
export type LoremHtmlMode = "none" | "p" | "br";

export type GenerateLoremOptions = {
  unit: LoremUnit;
  count: number;
  html: LoremHtmlMode;
  classicStart: boolean;
  wordPool: string[];
};

function wrapParagraphs(paragraphs: string[], html: LoremHtmlMode): string {
  if (html === "none") {
    return paragraphs.join("\n\n");
  }
  const escaped = paragraphs.map((p) => escapeHtmlText(p));
  if (html === "p") {
    return escaped.map((p) => `<p>${p}</p>`).join("\n");
  }
  return escaped.join("<br><br>");
}

function wrapBlock(text: string, html: LoremHtmlMode): string {
  if (html === "none") return text;
  const e = escapeHtmlText(text);
  if (html === "p") return `<p>${e}</p>`;
  return e.split("\n\n").join("<br><br>");
}

/** Split a sentence into words (keeps commas attached to tokens like the classic string). */
function classicSentenceWords(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

export function generateLorem(options: GenerateLoremOptions): string {
  const pool =
    options.wordPool.length > 0 ? options.wordPool : DEFAULT_LOREM_WORD_POOL;

  if (options.unit === "words") {
    const target = Math.max(1, options.count);
    const parts: string[] = [];
    if (options.classicStart) {
      const cw = classicSentenceWords(CLASSIC_FIRST_SENTENCE);
      for (let i = 0; i < Math.min(target, cw.length); i++) {
        parts.push(cw[i]!);
      }
      while (parts.length < target) {
        parts.push(pickWord(pool));
      }
    } else {
      for (let i = 0; i < target; i++) {
        parts.push(i === 0 ? capitalizeWord(pickWord(pool)) : pickWord(pool));
      }
    }
    const text = parts.join(" ");
    return wrapBlock(text, options.html);
  }

  if (options.unit === "sentences") {
    const n = Math.max(1, options.count);
    const sentences: string[] = [];
    let i = 0;
    if (options.classicStart && n > 0) {
      sentences.push(CLASSIC_FIRST_SENTENCE);
      i = 1;
    }
    for (; i < n; i++) {
      sentences.push(randomSentence(pool));
    }
    if (options.html === "none") {
      return sentences.join(" ");
    }
    const escaped = sentences.map((s) => escapeHtmlText(s));
    if (options.html === "p") {
      return `<p>${escaped.join(" ")}</p>`;
    }
    return escaped.join("<br><br>");
  }

  const nPara = Math.max(1, options.count);
  const paragraphs: string[] = [];
  let p = 0;
  if (options.classicStart && nPara > 0) {
    paragraphs.push(CLASSIC_FIRST_PARAGRAPH);
    p = 1;
  }
  for (; p < nPara; p++) {
    paragraphs.push(randomParagraph(pool));
  }
  return wrapParagraphs(paragraphs, options.html);
}

export { parseUploadedWords };
