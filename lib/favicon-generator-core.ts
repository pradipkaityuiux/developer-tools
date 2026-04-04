/**
 * Build a Windows ICO that embeds PNG images (Vista+ format).
 * Each PNG must be a valid full PNG file (signature + chunks).
 */
export function buildIcoFromPngs(
  images: { width: number; height: number; png: Uint8Array }[],
): Uint8Array {
  const count = images.length;
  if (count === 0) {
    throw new Error("ICO requires at least one PNG.");
  }
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const totalSize =
    headerSize + images.reduce((s, im) => s + im.png.byteLength, 0);
  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  const out = new Uint8Array(buf);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);

  let dirOffset = 6;
  for (const im of images) {
    const w = im.width >= 256 ? 0 : im.width;
    const h = im.height >= 256 ? 0 : im.height;
    out[dirOffset] = w;
    out[dirOffset + 1] = h;
    out[dirOffset + 2] = 0;
    out[dirOffset + 3] = 0;
    view.setUint16(dirOffset + 4, 1, true);
    view.setUint16(dirOffset + 6, 32, true);
    view.setUint32(dirOffset + 8, im.png.byteLength, true);
    view.setUint32(dirOffset + 12, offset, true);
    dirOffset += 16;
    out.set(im.png, offset);
    offset += im.png.byteLength;
  }

  return out;
}

export function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return blob.arrayBuffer().then((ab) => new Uint8Array(ab));
}

export type ImageFit = "cover" | "contain";

export function drawRasterToSquare(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sw: number,
  sh: number,
  size: number,
  fit: ImageFit,
  background: string,
) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;

  if (fit === "cover") {
    const scale = Math.max(size / sw, size / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = (size - dw) / 2;
    dy = (size - dh) / 2;
  } else {
    const scale = Math.min(size / sw, size / sh);
    dw = sw * scale;
    dh = sh * scale;
    dx = (size - dw) / 2;
    dy = (size - dh) / 2;
  }

  ctx.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);
}

export function drawTextToSquare(
  ctx: CanvasRenderingContext2D,
  size: number,
  text: string,
  options: {
    fontFamily: string;
    fontWeight: string;
    background: string;
    color: string;
  },
) {
  const trimmed = text.trim().slice(0, 8);
  const display = trimmed || "?";

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = options.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let fontSize = Math.floor(size * 0.62);
  const minSize = Math.max(6, Math.floor(size * 0.18));
  while (fontSize >= minSize) {
    ctx.font = `${options.fontWeight} ${fontSize}px ${options.fontFamily}`;
    const w = ctx.measureText(display).width;
    if (w <= size * 0.82) break;
    fontSize -= 1;
  }

  ctx.fillText(display, size / 2, size / 2);
}

export async function canvasToPngBytes(
  canvas: HTMLCanvasElement,
): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
  if (!blob) throw new Error("Could not encode PNG.");
  return blobToUint8Array(blob);
}
