/**
 * HSL ↔ hex helpers and harmony palettes for the color palette generator.
 * Angles use degrees; S and L use 0–100.
 */

export type Hsl = { h: number; s: number; l: number };

export function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export function clampSl(sl: number): number {
  return Math.max(0, Math.min(100, sl));
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** CSS/MDN-style HSL to sRGB. */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hh = normalizeHue(h) / 360;
  const ss = clampSl(s) / 100;
  const ll = clampSl(l) / 100;
  let r: number;
  let g: number;
  let b: number;
  if (ss === 0) {
    r = g = b = ll;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const s = hex.trim().replace(/^#/, "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    if ([r, g, b].some((x) => Number.isNaN(x))) return null;
    return [r, g, b];
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if ([r, g, b].some((x) => Number.isNaN(x))) return null;
    return [r, g, b];
  }
  return null;
}

export function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  if (d === 0) {
    return { h: 0, s: 0, l: l * 100 };
  }
  const s =
    l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      break;
    case gn:
      h = ((bn - rn) / d + 2) / 6;
      break;
    default:
      h = ((rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hexToHsl(hex: string): Hsl | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

export type NamedSwatch = { label: string; hex: string; hsl: Hsl };

export type HarmonyPalettes = {
  complementary: NamedSwatch[];
  triadic: NamedSwatch[];
  analogous: NamedSwatch[];
  monochrome: NamedSwatch[];
};

export function buildHarmonyPalettes(base: Hsl): HarmonyPalettes {
  const h = normalizeHue(base.h);
  const s = clampSl(base.s);
  const l = clampSl(base.l);

  const complementary: NamedSwatch[] = [
    { label: "Base", hex: hslToHex(h, s, l), hsl: { h, s, l } },
    {
      label: "Complement",
      hex: hslToHex(normalizeHue(h + 180), s, l),
      hsl: { h: normalizeHue(h + 180), s, l },
    },
  ];

  const triadic: NamedSwatch[] = [
    { label: "Primary", hex: hslToHex(h, s, l), hsl: { h, s, l } },
    {
      label: "+120°",
      hex: hslToHex(normalizeHue(h + 120), s, l),
      hsl: { h: normalizeHue(h + 120), s, l },
    },
    {
      label: "+240°",
      hex: hslToHex(normalizeHue(h + 240), s, l),
      hsl: { h: normalizeHue(h + 240), s, l },
    },
  ];

  const analogousSteps = [-36, -18, 0, 18, 36];
  const analogous: NamedSwatch[] = analogousSteps.map((delta) => {
    const hh = normalizeHue(h + delta);
    const label =
      delta === 0
        ? "Center"
        : delta < 0
          ? `${delta}°`
          : `+${delta}°`;
    return {
      label,
      hex: hslToHex(hh, s, l),
      hsl: { h: hh, s, l },
    };
  });

  const monoLightness = [10, 26, 46, 66, 88];
  const monochrome: NamedSwatch[] = monoLightness.map((ll, i) => ({
    label: `Step ${i + 1}`,
    hex: hslToHex(h, s, ll),
    hsl: { h, s, l: ll },
  }));

  return { complementary, triadic, analogous, monochrome };
}

export function formatPaletteCssVars(
  name: string,
  swatches: NamedSwatch[],
): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return swatches
    .map((sw, i) => `  --${slug}-${i + 1}: ${sw.hex};`)
    .join("\n");
}
