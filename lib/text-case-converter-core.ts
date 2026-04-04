/** Split camelCase / PascalCase and delimiters into lowercase tokens. */
export function tokenizeForDelimitedCase(input: string): string[] {
  const expanded = input
    .trim()
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return expanded
    .split(/[\s\n\r\t\-_]+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}

export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "camel"
  | "snake"
  | "kebab";

/**
 * Convert text between uppercase, lowercase, title case, camelCase,
 * snake_case, and kebab-case. Identifier-style modes tokenize on whitespace
 * and delimiters and understand camelCase boundaries.
 */
export function convertTextCase(text: string, mode: CaseMode): string {
  if (!text) return "";

  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(/\p{L}[\p{L}'’]*/gu, (w) => {
        const first = w.charAt(0);
        const rest = w.slice(1);
        return first.toUpperCase() + rest.toLowerCase();
      });
    case "camel":
    case "snake":
    case "kebab": {
      const parts = tokenizeForDelimitedCase(text);
      if (parts.length === 0) return "";
      if (mode === "snake") return parts.join("_");
      if (mode === "kebab") return parts.join("-");
      return (
        parts[0] +
        parts
          .slice(1)
          .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ""))
          .join("")
      );
    }
    default:
      return text;
  }
}
