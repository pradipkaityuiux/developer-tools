/** Used to convert % ↔ px for preview and consistent slider behavior. */
export const BORDER_RADIUS_PREVIEW_BOX_PX = 320;

export type BorderRadiusUnit = "px" | "rem" | "%";

export type CornerRadii = { tl: number; tr: number; br: number; bl: number };

export function cornerValueToPx(value: number, unit: BorderRadiusUnit): number {
  if (unit === "px") return value;
  if (unit === "rem") return value * 16;
  return (value / 100) * BORDER_RADIUS_PREVIEW_BOX_PX;
}

export function pxToCornerValue(px: number, unit: BorderRadiusUnit): number {
  if (unit === "px") return px;
  if (unit === "rem") return px / 16;
  return (px / BORDER_RADIUS_PREVIEW_BOX_PX) * 100;
}

export function formatCornerToken(value: number, unit: BorderRadiusUnit): string {
  if (unit === "px") return `${Math.round(value)}px`;
  if (unit === "rem") {
    const s = value
      .toFixed(3)
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");
    return `${s}rem`;
  }
  const s = value
    .toFixed(2)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
  return `${s}%`;
}

function nearlySame(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.001;
}

export function buildBorderRadiusShorthand(
  c: CornerRadii,
  unit: BorderRadiusUnit,
): string {
  const { tl, tr, br, bl } = c;
  const f = (n: number) => formatCornerToken(n, unit);
  if (nearlySame(tl, tr) && nearlySame(tr, br) && nearlySame(br, bl)) return f(tl);
  if (nearlySame(tl, br) && nearlySame(tr, bl)) return `${f(tl)} ${f(tr)}`;
  if (nearlySame(tr, bl)) return `${f(tl)} ${f(tr)} ${f(br)}`;
  return `${f(tl)} ${f(tr)} ${f(br)} ${f(bl)}`;
}

export function buildBorderRadiusDeclaration(
  c: CornerRadii,
  unit: BorderRadiusUnit,
): string {
  return `border-radius: ${buildBorderRadiusShorthand(c, unit)};`;
}

export const PILL_CSS = "border-radius: 9999px;";
