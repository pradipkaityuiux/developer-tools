/** Client-safe CSS beautify / minify with string & comment awareness. */

export type CssProcessOk = { ok: true; value: string };
export type CssProcessErr = { ok: false; error: string };

type Protected = {
  flat: string;
  strings: string[];
  comments: string[];
};

function protect(css: string): Protected | CssProcessErr {
  const strings: string[] = [];
  const comments: string[] = [];
  let out = "";
  let i = 0;
  const raw = css.replace(/^\uFEFF/, "");

  while (i < raw.length) {
    const c = raw[i];
    if (c === "/" && raw[i + 1] === "*") {
      const end = raw.indexOf("*/", i + 2);
      if (end === -1) return { ok: false, error: "Unclosed block comment (missing */)." };
      comments.push(raw.slice(i, end + 2));
      out += `__C${comments.length - 1}__`;
      i = end + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      let j = i + 1;
      let chunk = q;
      while (j < raw.length) {
        const ch = raw[j];
        if (ch === "\\") {
          chunk += ch + (raw[j + 1] ?? "");
          j += 2;
          continue;
        }
        chunk += ch;
        j++;
        if (ch === q) break;
      }
      if (chunk.length < 2 || chunk[chunk.length - 1] !== q) {
        return { ok: false, error: `Unclosed ${q === '"' ? "double" : "single"}-quoted string.` };
      }
      strings.push(chunk);
      out += `__S${strings.length - 1}__`;
      i = j;
      continue;
    }
    out += c;
    i++;
  }
  return { flat: out, strings, comments };
}

function balancedBraces(s: string): boolean {
  let depth = 0;
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

function restore(
  s: string,
  strings: string[],
  comments: string[],
  dropComments: boolean,
): string {
  let r = s;
  if (dropComments) {
    r = r.replace(/__C\d+__/g, "");
  } else {
    r = r.replace(/__C(\d+)__/g, (_, n) => comments[parseInt(n, 10)] ?? "");
  }
  r = r.replace(/__S(\d+)__/g, (_, n) => strings[parseInt(n, 10)] ?? "");
  return r;
}

function tightenSpacing(s: string): string {
  let t = s.replace(/\s+/g, " ").trim();
  t = t.replace(/\s*([{}:;,>+~])\s*/g, "$1");
  t = t.replace(/;}/g, "}");
  return t.trim();
}

function normalizeSelectors(s: string): string {
  return s
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s*~\s*/g, " ~ ");
}

function formatFlat(s: string, indentStr: string): string {
  const t = normalizeSelectors(s.replace(/\s+/g, " ").trim());
  let out = "";
  let depth = 0;
  let paren = 0;
  let i = 0;

  function writeIndent() {
    out += indentStr.repeat(Math.max(0, depth));
  }

  function skipWs() {
    while (i < t.length && t[i] === " ") i++;
  }

  while (i < t.length) {
    skipWs();
    if (i >= t.length) break;

    const ph = /^__([SC])(\d+)__/.exec(t.slice(i));
    if (ph) {
      const block = ph[0];
      if (!out.endsWith("\n")) out += "\n";
      writeIndent();
      out += block + "\n";
      i += block.length;
      continue;
    }

    const c = t[i];
    if (c === "(") {
      paren++;
      out += c;
      i++;
      continue;
    }
    if (c === ")") {
      paren--;
      out += c;
      i++;
      continue;
    }

    if (paren === 0) {
      if (c === "{") {
        if (
          out.length &&
          !/\s$/.test(out) &&
          !out.endsWith("{") &&
          !out.endsWith("(") &&
          !out.endsWith(",")
        ) {
          out += " ";
        }
        out += "{\n";
        depth++;
        writeIndent();
        i++;
        continue;
      }
      if (c === "}") {
        depth = Math.max(0, depth - 1);
        out = out.replace(/\s+$/, "");
        out += "\n";
        writeIndent();
        out += "}";
        i++;
        skipWs();
        if (i < t.length) out += "\n" + indentStr.repeat(Math.max(0, depth));
        continue;
      }
      if (c === ";") {
        out += ";";
        i++;
        skipWs();
        if (i < t.length && t[i] !== "}") {
          out += "\n";
          writeIndent();
        }
        continue;
      }
    }

    if (c === " ") {
      i++;
      continue;
    }
    out += c;
    i++;
  }

  return out.trim();
}

export function minifyCss(input: string): CssProcessOk | CssProcessErr {
  const trimmed = input.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { ok: true, value: "" };

  const p = protect(trimmed);
  if (!("flat" in p)) return p;

  if (!balancedBraces(p.flat)) {
    return { ok: false, error: "Unbalanced { } braces in stylesheet." };
  }

  let flat = p.flat.replace(/__C\d+__/g, "");
  flat = tightenSpacing(flat);
  const out = restore(flat, p.strings, p.comments, true);
  return { ok: true, value: out };
}

export function formatCss(input: string, indent = "  "): CssProcessOk | CssProcessErr {
  const trimmed = input.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { ok: true, value: "" };

  const p = protect(trimmed);
  if (!("flat" in p)) return p;

  if (!balancedBraces(p.flat)) {
    return { ok: false, error: "Unbalanced { } braces in stylesheet." };
  }

  const formatted = formatFlat(p.flat, indent);
  const out = restore(formatted, p.strings, p.comments, false);
  return { ok: true, value: out };
}
