/** Shared RGB ↔ HEX ↔ HSL ↔ CMYK helpers for the color picker tool (browser-safe). */

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };
export type Cmyk = { c: number; m: number; y: number; k: number };

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function clampPercent(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    clampByte(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function parseHex(hex: string): Rgb | null {
  const s = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$/.test(s) && !/^[0-9a-fA-F]{6}$/.test(s)) {
    return null;
  }
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return { r, g, b };
  }
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  if ([r, g, b].some((x) => Number.isNaN(x))) return null;
  return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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
  }
  return {
    h: Math.round(h * 360 * 1000) / 1000,
    s: Math.round(s * 10000) / 100,
    l: Math.round(l * 10000) / 100,
  };
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  let hh = h % 360;
  if (hh < 0) hh += 360;
  const sn = clampPercent(s) / 100;
  const ln = clampPercent(l) / 100;
  if (sn === 0) {
    const v = clampByte(ln * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hr = hh / 360;
  const r = hue2rgb(p, q, hr + 1 / 3);
  const g = hue2rgb(p, q, hr);
  const b = hue2rgb(p, q, hr - 1 / 3);
  return {
    r: clampByte(r * 255),
    g: clampByte(g * 255),
    b: clampByte(b * 255),
  };
}

export function rgbToCmyk(r: number, g: number, b: number): Cmyk {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const inv = 1 - k;
  const c = (1 - rn - k) / inv;
  const m = (1 - gn - k) / inv;
  const y = (1 - bn - k) / inv;
  return {
    c: Math.round(c * 10000) / 100,
    m: Math.round(m * 10000) / 100,
    y: Math.round(y * 10000) / 100,
    k: Math.round(k * 10000) / 100,
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): Rgb {
  const cn = clampPercent(c) / 100;
  const mn = clampPercent(m) / 100;
  const yn = clampPercent(y) / 100;
  const kn = clampPercent(k) / 100;
  const r = 255 * (1 - cn) * (1 - kn);
  const g = 255 * (1 - mn) * (1 - kn);
  const b = 255 * (1 - yn) * (1 - kn);
  return { r: clampByte(r), g: clampByte(g), b: clampByte(b) };
}

export function formatRgbCss(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHslCss(hsl: Hsl): string {
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

export function formatCmykPercent(cmyk: Cmyk): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}
