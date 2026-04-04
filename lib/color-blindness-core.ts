/**
 * Color vision deficiency simulation using Machado (2010) precomputed matrices
 * (protanomaly, deuteranomaly, tritanomaly severity 0–1) applied in linear sRGB.
 * @see https://doi.org/10.1109/TVCG.2009.113
 */

export type CvdKind = "Protanomaly" | "Deuteranomaly" | "Tritanomaly";

export type SimulationMode =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

const MACHADO: Record<CvdKind, Record<number, number[][]>> = {
  Protanomaly: {
    0.0: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    0.1: [
      [0.856167, 0.182038, -0.038205],
      [0.029342, 0.955115, 0.015544],
      [-0.00288, -0.001563, 1.004443],
    ],
    0.2: [
      [0.734766, 0.334872, -0.069637],
      [0.05184, 0.919198, 0.028963],
      [-0.004928, -0.004209, 1.009137],
    ],
    0.3: [
      [0.630323, 0.465641, -0.095964],
      [0.069181, 0.890046, 0.040773],
      [-0.006308, -0.007724, 1.014032],
    ],
    0.4: [
      [0.539009, 0.579343, -0.118352],
      [0.082546, 0.866121, 0.051332],
      [-0.007136, -0.011959, 1.019095],
    ],
    0.5: [
      [0.458064, 0.679578, -0.137642],
      [0.092785, 0.846313, 0.060902],
      [-0.007494, -0.016807, 1.024301],
    ],
    0.6: [
      [0.38545, 0.769005, -0.154455],
      [0.100526, 0.829802, 0.069673],
      [-0.007442, -0.02219, 1.029632],
    ],
    0.7: [
      [0.319627, 0.849633, -0.169261],
      [0.106241, 0.815969, 0.07779],
      [-0.007025, -0.028051, 1.035076],
    ],
    0.8: [
      [0.259411, 0.923008, -0.18242],
      [0.110296, 0.80434, 0.085364],
      [-0.006276, -0.034346, 1.040622],
    ],
    0.9: [
      [0.203876, 0.990338, -0.194214],
      [0.112975, 0.794542, 0.092483],
      [-0.005222, -0.041043, 1.046265],
    ],
    1.0: [
      [0.152286, 1.052583, -0.204868],
      [0.114503, 0.786281, 0.099216],
      [-0.003882, -0.048116, 1.051998],
    ],
  },
  Deuteranomaly: {
    0.0: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    0.1: [
      [0.866435, 0.177704, -0.044139],
      [0.049567, 0.939063, 0.01137],
      [-0.003453, 0.007233, 0.99622],
    ],
    0.2: [
      [0.760729, 0.319078, -0.079807],
      [0.090568, 0.889315, 0.020117],
      [-0.006027, 0.013325, 0.992702],
    ],
    0.3: [
      [0.675425, 0.43385, -0.109275],
      [0.125303, 0.847755, 0.026942],
      [-0.00795, 0.018572, 0.989378],
    ],
    0.4: [
      [0.605511, 0.52856, -0.134071],
      [0.155318, 0.812366, 0.032316],
      [-0.009376, 0.023176, 0.9862],
    ],
    0.5: [
      [0.547494, 0.607765, -0.155259],
      [0.181692, 0.781742, 0.036566],
      [-0.01041, 0.027275, 0.983136],
    ],
    0.6: [
      [0.498864, 0.674741, -0.173604],
      [0.205199, 0.754872, 0.039929],
      [-0.011131, 0.030969, 0.980162],
    ],
    0.7: [
      [0.457771, 0.731899, -0.18967],
      [0.226409, 0.731012, 0.042579],
      [-0.011595, 0.034333, 0.977261],
    ],
    0.8: [
      [0.422823, 0.781057, -0.203881],
      [0.245752, 0.709602, 0.044646],
      [-0.011843, 0.037423, 0.974421],
    ],
    0.9: [
      [0.392952, 0.82361, -0.216562],
      [0.263559, 0.69021, 0.046232],
      [-0.01191, 0.040281, 0.97163],
    ],
    1.0: [
      [0.367322, 0.860646, -0.227968],
      [0.280085, 0.672501, 0.047413],
      [-0.01182, 0.04294, 0.968881],
    ],
  },
  Tritanomaly: {
    0.0: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    0.1: [
      [0.92667, 0.092514, -0.019184],
      [0.021191, 0.964503, 0.014306],
      [0.008437, 0.054813, 0.93675],
    ],
    0.2: [
      [0.89572, 0.13333, -0.02905],
      [0.029997, 0.9454, 0.024603],
      [0.013027, 0.104707, 0.882266],
    ],
    0.3: [
      [0.905871, 0.127791, -0.033662],
      [0.026856, 0.941251, 0.031893],
      [0.01341, 0.148296, 0.838294],
    ],
    0.4: [
      [0.948035, 0.08949, -0.037526],
      [0.014364, 0.946792, 0.038844],
      [0.010853, 0.193991, 0.795156],
    ],
    0.5: [
      [1.017277, 0.027029, -0.044306],
      [-0.006113, 0.958479, 0.047634],
      [0.006379, 0.248708, 0.744913],
    ],
    0.6: [
      [1.104996, -0.046633, -0.058363],
      [-0.032137, 0.971635, 0.060503],
      [0.001336, 0.317922, 0.680742],
    ],
    0.7: [
      [1.193214, -0.109812, -0.083402],
      [-0.058496, 0.97941, 0.079086],
      [-0.002346, 0.403492, 0.598854],
    ],
    0.8: [
      [1.257728, -0.139648, -0.118081],
      [-0.078003, 0.975409, 0.102594],
      [-0.003316, 0.501214, 0.502102],
    ],
    0.9: [
      [1.278864, -0.125333, -0.153531],
      [-0.084748, 0.957674, 0.127074],
      [-0.000989, 0.601151, 0.399838],
    ],
    1.0: [
      [1.255528, -0.076749, -0.178779],
      [-0.078411, 0.930809, 0.147602],
      [0.004733, 0.691367, 0.3039],
    ],
  },
};

const SAMPLES = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] as const;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function srgbByteToLinear(u8: number): number {
  const x = u8 / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgbByte(lin: number): number {
  const x = lin <= 0 ? 0 : lin >= 1 ? 1 : lin;
  const c =
    x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, c * 255)));
}

function matVec(
  m: number[][],
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  return [
    m[0][0] * x + m[0][1] * y + m[0][2] * z,
    m[1][0] * x + m[1][1] * y + m[1][2] * z,
    m[2][0] * x + m[2][1] * y + m[2][2] * z,
  ];
}

function lerpMat(a: number[][], b: number[][], t: number): number[][] {
  return [
    [
      a[0][0] + (b[0][0] - a[0][0]) * t,
      a[0][1] + (b[0][1] - a[0][1]) * t,
      a[0][2] + (b[0][2] - a[0][2]) * t,
    ],
    [
      a[1][0] + (b[1][0] - a[1][0]) * t,
      a[1][1] + (b[1][1] - a[1][1]) * t,
      a[1][2] + (b[1][2] - a[1][2]) * t,
    ],
    [
      a[2][0] + (b[2][0] - a[2][0]) * t,
      a[2][1] + (b[2][1] - a[2][1]) * t,
      a[2][2] + (b[2][2] - a[2][2]) * t,
    ],
  ];
}

/** Interpolated Machado matrix for the given CVD kind and severity ∈ [0, 1]. */
export function machadoMatrix(kind: CvdKind, severity: number): number[][] {
  const s = clamp01(severity);
  const table = MACHADO[kind];
  let i = 0;
  while (i < SAMPLES.length - 1 && SAMPLES[i + 1] < s) i++;
  const a = SAMPLES[i];
  const b = SAMPLES[Math.min(i + 1, SAMPLES.length - 1)];
  const mA = table[a]!;
  const mB = table[b]!;
  if (a === b) return mA.map((row) => [...row]);
  const t = (s - a) / (b - a);
  return lerpMat(mA, mB, t);
}

function modeToKind(mode: SimulationMode): CvdKind | null {
  if (mode === "protanopia") return "Protanomaly";
  if (mode === "deuteranopia") return "Deuteranomaly";
  if (mode === "tritanopia") return "Tritanomaly";
  return null;
}

/** Linear sRGB [0,1]³ → simulated linear sRGB. */
export function simulateLinearRgb(
  r: number,
  g: number,
  b: number,
  mode: SimulationMode,
  severity: number,
): [number, number, number] {
  if (mode === "normal") return [r, g, b];
  if (mode === "achromatopsia") {
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return [y, y, y];
  }
  const kind = modeToKind(mode);
  if (!kind) return [r, g, b];
  const m = machadoMatrix(kind, severity);
  return matVec(m, r, g, b);
}

/** sRGB bytes 0–255 → simulated sRGB bytes (clamped). */
export function simulateSrgbBytes(
  r: number,
  g: number,
  b: number,
  mode: SimulationMode,
  severity: number,
): { r: number; g: number; b: number } {
  const lr = srgbByteToLinear(r);
  const lg = srgbByteToLinear(g);
  const lb = srgbByteToLinear(b);
  const [oR, oG, oB] = simulateLinearRgb(lr, lg, lb, mode, severity);
  return {
    r: linearToSrgbByte(oR),
    g: linearToSrgbByte(oG),
    b: linearToSrgbByte(oB),
  };
}

export const DEFAULT_PALETTE_LINES = `#2563eb
#f97316
#22c55e
#eab308
#ec4899`;
