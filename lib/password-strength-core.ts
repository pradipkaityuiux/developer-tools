/**
 * Client-side password strength analysis: charset union entropy,
 * heuristic penalties for common patterns, and crack-time estimates.
 * Does not contact any server; suitable for static pages.
 */

const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "abc123",
  "monkey",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "shadow",
  "superman",
  "qazwsx",
  "michael",
  "football",
  "welcome",
  "jesus",
  "ninja",
  "mustang",
  "password123",
  "admin",
  "root",
  "toor",
  "passw0rd",
  "p@ssw0rd",
  "guest",
  "default",
  "changeme",
]);

const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
];

function hasAsciiLower(s: string): boolean {
  return /[a-z]/.test(s);
}

function hasAsciiUpper(s: string): boolean {
  return /[A-Z]/.test(s);
}

function hasDigit(s: string): boolean {
  return /[0-9]/.test(s);
}

function hasAsciiSymbol(s: string): boolean {
  for (const c of s) {
    if (c.charCodeAt(0) < 128 && !/[a-zA-Z0-9]/.test(c)) return true;
  }
  return false;
}

function hasNonAscii(s: string): boolean {
  return /[^\x00-\x7F]/.test(s);
}

/** Union-of-pools charset size (ASCII classes + unicode bump). */
export function charsetPoolSize(password: string): number {
  if (password.length === 0) return 0;
  let n = 0;
  if (hasAsciiLower(password)) n += 26;
  if (hasAsciiUpper(password)) n += 26;
  if (hasDigit(password)) n += 10;
  if (hasAsciiSymbol(password)) n += 33;
  if (hasNonAscii(password)) n += 4096;
  if (n === 0) {
    for (const c of password) {
      const code = c.codePointAt(0) ?? 0;
      if (code > 127) n += 4096;
    }
    if (n === 0) n = 95;
  }
  return n;
}

export function entropyBits(password: string, pool: number): number {
  if (password.length === 0 || pool <= 1) return 0;
  return password.length * (Math.log(pool) / Math.LN2);
}

function longestKeyboardRun(password: string): number {
  const lower = password.toLowerCase();
  let best = 0;
  for (let i = 0; i < lower.length; i++) {
    for (const row of KEYBOARD_ROWS) {
      let run = 1;
      let j = i + 1;
      while (j < lower.length) {
        const a = row.indexOf(lower[j - 1]);
        const b = row.indexOf(lower[j]);
        if (a >= 0 && b >= 0 && Math.abs(b - a) === 1) {
          run++;
          j++;
        } else break;
      }
      if (run > best) best = run;
    }
  }
  return best;
}

function longestSequentialDigits(password: string): number {
  let best = 0;
  let run = 0;
  let prev = -1;
  for (const c of password) {
    const d = c.charCodeAt(0);
    if (d >= 48 && d <= 57) {
      if (prev >= 0 && d === prev + 1) run++;
      else run = 1;
      prev = d;
      if (run > best) best = run;
    } else {
      prev = -1;
    }
  }
  return best;
}

function repeatPenalty(password: string): number {
  if (/(.)\1{3,}/.test(password)) return 12;
  if (/(.)\1{2,}/.test(password)) return 6;
  return 0;
}

export type PasswordStrengthResult = {
  charsetSize: number;
  entropyBits: number;
  adjustedBits: number;
  score: number;
  label: "Very weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very strong";
  warnings: string[];
  isCommonPassword: boolean;
  crackSeconds: {
    /** ~1k guesses/s (online / throttled) */
    online: number;
    /** ~1e9 guesses/s (offline GPU) */
    offlineFast: number;
    /** ~1e12 guesses/s (large clusters) */
    offlineExtreme: number;
  };
};

function formatCrackSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "instantly";
  if (seconds < 1) return "under a second";
  if (seconds < 60) return `~${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `~${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `~${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 365) return `~${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365 * 1e6)
    return `~${(seconds / (86400 * 365)).toFixed(1)} years`;
  return "many human lifetimes";
}

export function crackTimeLabel(seconds: number): string {
  return formatCrackSeconds(seconds);
}

export function analyzePassword(password: string): PasswordStrengthResult {
  const warnings: string[] = [];
  const pool = charsetPoolSize(password);
  const raw = entropyBits(password, pool);

  const lower = password.toLowerCase();
  let isCommonPassword = COMMON_PASSWORDS.has(lower);
  if (password.length > 0 && password.length < 8) {
    warnings.push("Short passwords are easy to guess—aim for at least 12–16 characters for accounts you care about.");
  }
  if (isCommonPassword) {
    warnings.push("This matches a widely used password that appears in breach dictionaries.");
  }
  if (longestKeyboardRun(password) >= 4) {
    warnings.push("Keyboard walks (like “qwerty” or “1234”) are trivial for attackers to try.");
  }
  if (longestSequentialDigits(password) >= 4) {
    warnings.push("Long runs of sequential digits shrink the search space for numeric-heavy secrets.");
  }

  const rPen = repeatPenalty(password);
  let adjusted = raw - rPen;
  if (isCommonPassword) adjusted = Math.min(adjusted, 12);
  if (longestKeyboardRun(password) >= 4) adjusted -= 8;
  if (longestSequentialDigits(password) >= 4) adjusted -= 6;
  adjusted = Math.max(0, adjusted);

  const hasClasses =
    (hasAsciiLower(password) ? 1 : 0) +
      (hasAsciiUpper(password) ? 1 : 0) +
      (hasDigit(password) ? 1 : 0) +
      (hasAsciiSymbol(password) || hasNonAscii(password) ? 1 : 0) >=
    3;
  if (password.length >= 8 && !hasClasses) {
    warnings.push("Mix uppercase, lowercase, digits, and symbols when policies allow—variety increases entropy.");
  }

  let score = Math.min(100, Math.round((adjusted / 128) * 100));
  if (password.length === 0) score = 0;
  if (score < 20 && password.length > 0) score = Math.max(score, 5);

  let label: PasswordStrengthResult["label"] = "Very weak";
  if (score >= 85) label = "Very strong";
  else if (score >= 70) label = "Strong";
  else if (score >= 50) label = "Good";
  else if (score >= 30) label = "Fair";
  else if (score >= 15) label = "Weak";

  const guesses = Math.pow(2, adjusted);
  const crackSeconds = {
    online: guesses / 1e3,
    offlineFast: guesses / 1e9,
    offlineExtreme: guesses / 1e12,
  };

  return {
    charsetSize: pool,
    entropyBits: raw,
    adjustedBits: adjusted,
    score,
    label,
    warnings,
    isCommonPassword,
    crackSeconds,
  };
}

export function buildStrengthReport(password: string, analysis: PasswordStrengthResult): string {
  const lines = [
    "Password strength report",
    "========================",
    `Length: ${password.length} characters`,
    `Charset size (approx.): ${analysis.charsetSize}`,
    `Entropy (raw): ${analysis.entropyBits.toFixed(1)} bits`,
    `Entropy (adjusted): ${analysis.adjustedBits.toFixed(1)} bits`,
    `Score: ${analysis.score}/100 — ${analysis.label}`,
    "",
    "Time to crack (very rough, brute-force model):",
    `- Throttled online (~1k guesses/s): ${crackTimeLabel(analysis.crackSeconds.online)}`,
    `- Fast offline (~1e9 guesses/s): ${crackTimeLabel(analysis.crackSeconds.offlineFast)}`,
    `- Extreme (~1e12 guesses/s): ${crackTimeLabel(analysis.crackSeconds.offlineExtreme)}`,
    "",
  ];
  if (analysis.warnings.length) {
    lines.push("Notes:");
    for (const w of analysis.warnings) lines.push(`- ${w}`);
  }
  lines.push("");
  lines.push("Generated locally in your browser — no password was sent to a server.");
  return lines.join("\n");
}
