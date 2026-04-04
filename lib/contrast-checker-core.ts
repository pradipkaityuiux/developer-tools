/**
 * WCAG 2.x relative luminance and contrast ratio (sRGB).
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

export type Rgb = { r: number; g: number; b: number };

/** Parse #RGB, #RRGGBB, or #RRGGBBAA (alpha ignored for luminance). */
export function parseHexColor(input: string): Rgb | null {
  const s = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/.test(s))
    return null;
  if (s.length === 3) {
    return {
      r: parseInt(s[0] + s[0], 16),
      g: parseInt(s[1] + s[1], 16),
      b: parseInt(s[2] + s[2], 16),
    };
  }
  if (s.length === 6 || s.length === 8) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
    };
  }
  return null;
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const R = linear(r);
  const G = linear(g);
  const B = linear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const L1 = relativeLuminance(fg.r, fg.g, fg.b);
  const L2 = relativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = {
  label: string;
  minRatio: number;
  passes: boolean;
};

export function wcagLevels(ratio: number): {
  aaNormal: WcagLevel;
  aaaNormal: WcagLevel;
  aaLarge: WcagLevel;
  aaaLarge: WcagLevel;
} {
  return {
    aaNormal: {
      label: "AA (normal text)",
      minRatio: 4.5,
      passes: ratio >= 4.5,
    },
    aaaNormal: {
      label: "AAA (normal text)",
      minRatio: 7,
      passes: ratio >= 7,
    },
    aaLarge: {
      label: "AA (large text)",
      minRatio: 3,
      passes: ratio >= 3,
    },
    aaaLarge: {
      label: "AAA (large text)",
      minRatio: 4.5,
      passes: ratio >= 4.5,
    },
  };
}
