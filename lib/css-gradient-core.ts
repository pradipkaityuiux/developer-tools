export type CssGradientMode = "linear" | "radial";

export type LinearDirectionMode = "angle" | "keyword";

export type LinearKeyword =
  | "to-top"
  | "to-top-right"
  | "to-right"
  | "to-bottom-right"
  | "to-bottom"
  | "to-bottom-left"
  | "to-left"
  | "to-top-left";

const KEYWORD_TO_CSS: Record<LinearKeyword, string> = {
  "to-top": "to top",
  "to-top-right": "to top right",
  "to-right": "to right",
  "to-bottom-right": "to bottom right",
  "to-bottom": "to bottom",
  "to-bottom-left": "to bottom left",
  "to-left": "to left",
  "to-top-left": "to top left",
};

export type CssColorStop = { color: string; position: number };

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function sortedStops(stops: CssColorStop[]): CssColorStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

function formatStop(s: CssColorStop): string {
  const p = clamp(s.position, 0, 100);
  const pct = p.toFixed(1).replace(/\.0$/, "");
  return `${s.color} ${pct}%`;
}

function linearDirection(
  dirMode: LinearDirectionMode,
  angleDeg: number,
  keyword: LinearKeyword,
): string {
  if (dirMode === "keyword") {
    return KEYWORD_TO_CSS[keyword];
  }
  const a = ((angleDeg % 360) + 360) % 360;
  return `${a}deg`;
}

export function buildGradientFunction(
  mode: CssGradientMode,
  repeating: boolean,
  linear: {
    dirMode: LinearDirectionMode;
    angleDeg: number;
    keyword: LinearKeyword;
  },
  radial: { shape: "circle" | "ellipse"; x: number; y: number },
  stops: CssColorStop[],
): string {
  const parts = sortedStops(stops).map(formatStop);
  const linearFn = repeating ? "repeating-linear-gradient" : "linear-gradient";
  const radialFn = repeating ? "repeating-radial-gradient" : "radial-gradient";

  if (mode === "linear") {
    const dir = linearDirection(
      linear.dirMode,
      linear.angleDeg,
      linear.keyword,
    );
    return `${linearFn}(${dir}, ${parts.join(", ")})`;
  }

  const { shape, x, y } = radial;
  return `${radialFn}(${shape} at ${clamp(x, 0, 100)}% ${clamp(y, 0, 100)}%, ${parts.join(", ")})`;
}

export function buildBackgroundImageCss(gradientValue: string): string {
  return `background-image: ${gradientValue};`;
}
