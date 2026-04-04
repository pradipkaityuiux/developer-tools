"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";
import {
  buildIcoFromPngs,
  canvasToPngBytes,
  drawRasterToSquare,
  drawTextToSquare,
  type ImageFit,
} from "@/lib/favicon-generator-core";
import { preventFocusScrollOnMouseDown } from "@/lib/prevent-focus-scroll";

const MAX_BYTES = 12 * 1024 * 1024;
const ICO_SIZES = [16, 32, 48] as const;
const PNG_SIZES = [16, 32, 48, 180, 192, 512] as const;

const FONT_PRESETS = [
  { label: "System UI", value: "system-ui, Segoe UI, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "ui-monospace, Consolas, monospace" },
  { label: "Rounded", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
] as const;

function revokeMap(urls: Map<number, string>) {
  for (const u of urls.values()) URL.revokeObjectURL(u);
  urls.clear();
}

function defaultHtmlSnippet(): string {
  return `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />`;
}

export function FaviconGeneratorTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [mode, setMode] = useState<"image" | "text">("image");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [imgReady, setImgReady] = useState(false);
  const [fit, setFit] = useState<ImageFit>("cover");
  const [letterbox, setLetterbox] = useState("#ffffff");

  const [text, setText] = useState("A");
  const [fontPreset, setFontPreset] = useState<(typeof FONT_PRESETS)[number]["value"]>(
    FONT_PRESETS[0].value,
  );
  const [fontWeight, setFontWeight] = useState("700");
  const [textBg, setTextBg] = useState("#0f172a");
  const [textFg, setTextFg] = useState("#f8fafc");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [previewUrls, setPreviewUrls] = useState<Map<number, string>>(new Map());
  const [icoUrl, setIcoUrl] = useState<string | null>(null);
  const [pngBlobs, setPngBlobs] = useState<Map<number, Blob>>(new Map());

  const previewUrlsRef = useRef(previewUrls);
  previewUrlsRef.current = previewUrls;
  const icoUrlRef = useRef(icoUrl);
  icoUrlRef.current = icoUrl;

  const copyText = useCallback(async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      setError("Clipboard blocked—copy manually.");
    }
  }, []);

  const loadFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Choose a raster image (PNG, JPEG, WebP, GIF). SVG is not supported here.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `Image is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB.`,
      );
      return;
    }
    setImgReady(false);
    setDataUrl(null);
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r !== "string") {
        setError("Could not read that file.");
        return;
      }
      setDataUrl(r);
      setFileLabel(file.name);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsDataURL(file);
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) loadFile(f);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files?.[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  function onHiddenImgLoad() {
    setImgReady(true);
    setError(null);
  }

  function onHiddenImgError() {
    setImgReady(false);
    setError("Could not decode that image. Try PNG or JPEG.");
  }

  useEffect(() => {
    let cancelled = false;
    const prevPreviews = new Map(previewUrls);
    setPreviewUrls(new Map());
    revokeMap(prevPreviews);
    if (icoUrl) {
      URL.revokeObjectURL(icoUrl);
      setIcoUrl(null);
    }
    setPngBlobs(new Map());

    async function generate() {
      if (mode === "image" && (!dataUrl || !imgReady)) {
        setError(null);
        return;
      }
      if (mode === "text" && !text.trim()) {
        setError("Enter at least one character for text mode.");
        return;
      }
      setError(null);
      setBusy(true);
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not available.");

        const img = imgRef.current;
        const iw = img?.naturalWidth ?? 0;
        const ih = img?.naturalHeight ?? 0;

        const pngMap = new Map<number, Uint8Array>();
        const nextUrls = new Map<number, string>();
        const blobs = new Map<number, Blob>();

        for (const size of PNG_SIZES) {
          canvas.width = size;
          canvas.height = size;
          if (mode === "image" && img && iw > 0 && ih > 0) {
            drawRasterToSquare(ctx, img, iw, ih, size, fit, letterbox);
          } else {
            drawTextToSquare(ctx, size, text, {
              fontFamily: fontPreset,
              fontWeight,
              background: textBg,
              color: textFg,
            });
          }
          const bytes = await canvasToPngBytes(canvas);
          const blob = new Blob([new Uint8Array(bytes)], { type: "image/png" });
          blobs.set(size, blob);
          pngMap.set(size, bytes);
          nextUrls.set(size, URL.createObjectURL(blob));
        }

        if (cancelled) {
          for (const u of nextUrls.values()) URL.revokeObjectURL(u);
          return;
        }

        const icoImages = ICO_SIZES.map((s) => {
          const png = pngMap.get(s);
          if (!png) throw new Error(`Missing ${s}px PNG.`);
          return { width: s, height: s, png };
        });
        const icoBytes = buildIcoFromPngs(icoImages);
        const icoBlob = new Blob([new Uint8Array(icoBytes)], {
          type: "image/x-icon",
        });
        const nextIcoUrl = URL.createObjectURL(icoBlob);

        if (cancelled) {
          for (const u of nextUrls.values()) URL.revokeObjectURL(u);
          URL.revokeObjectURL(nextIcoUrl);
          return;
        }

        setPngBlobs(blobs);
        setPreviewUrls(nextUrls);
        setIcoUrl(nextIcoUrl);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not build favicons.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void generate();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- previewUrls/icoUrl intentionally excluded; reset inside effect
  }, [
    mode,
    dataUrl,
    imgReady,
    fit,
    letterbox,
    text,
    fontPreset,
    fontWeight,
    textBg,
    textFg,
  ]);

  useEffect(() => {
    return () => {
      revokeMap(previewUrlsRef.current);
      const u = icoUrlRef.current;
      if (u) URL.revokeObjectURL(u);
    };
  }, []);

  const triggerUpload = () => fileRef.current?.click();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      {dataUrl ? (
        <img
          ref={imgRef}
          src={dataUrl}
          alt=""
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          width={0}
          height={0}
          onLoad={onHiddenImgLoad}
          onError={onHiddenImgError}
        />
      ) : null}

      <div className="flex flex-col gap-6">
        <div
          className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/50"
          role="tablist"
          aria-label="Favicon source"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "image"}
            onMouseDown={preventFocusScrollOnMouseDown}
            onClick={() => setMode("image")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "image"
                ? "bg-white text-foreground shadow-sm dark:bg-zinc-800"
                : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
            }`}
          >
            From image
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "text"}
            onMouseDown={preventFocusScrollOnMouseDown}
            onClick={() => setMode("text")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "text"
                ? "bg-white text-foreground shadow-sm dark:bg-zinc-800"
                : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
            }`}
          >
            From text
          </button>
        </div>

        {mode === "image" ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={onDrop}
              className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-600 dark:bg-zinc-900/20"
            >
              <input
                ref={fileRef}
                id={`${uploadId}-file`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
              />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Drop an image here or upload a logo or photo.
              </p>
              <button
                type="button"
                onMouseDown={preventFocusScrollOnMouseDown}
                onClick={triggerUpload}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload image
              </button>
              {fileLabel ? (
                <p className="mt-2 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {fileLabel}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-sm font-medium text-foreground">
                  Fit in square
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["cover", "Cover (fill, may crop)"],
                      ["contain", "Contain (full image)"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onMouseDown={preventFocusScrollOnMouseDown}
                      onClick={() => setFit(value)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                        fit === value
                          ? "border-foreground bg-zinc-100 dark:bg-zinc-800"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor={`${uploadId}-letterbox`}
                  className="block text-sm font-medium text-foreground"
                >
                  Letterbox / pad color
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id={`${uploadId}-letterbox`}
                    type="color"
                    value={letterbox}
                    onChange={(e) => setLetterbox(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-zinc-300 dark:border-zinc-600"
                  />
                  <input
                    type="text"
                    value={letterbox}
                    onChange={(e) => setLetterbox(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`${uploadId}-text`}
                className="block text-sm font-medium text-foreground"
              >
                Text (1–8 characters)
              </label>
              <input
                id={`${uploadId}-text`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={8}
                className="mt-1.5 w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                placeholder="A"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor={`${uploadId}-font`}
                className="block text-sm font-medium text-foreground"
              >
                Font stack
              </label>
              <select
                id={`${uploadId}-font`}
                value={fontPreset}
                onChange={(e) =>
                  setFontPreset(e.target.value as (typeof FONT_PRESETS)[number]["value"])
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              >
                {FONT_PRESETS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground">Weight</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["400", "600", "700", "800"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onMouseDown={preventFocusScrollOnMouseDown}
                    onClick={() => setFontWeight(w)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                      fontWeight === w
                        ? "border-foreground bg-zinc-100 dark:bg-zinc-800"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor={`${uploadId}-tbg`}
                className="block text-sm font-medium text-foreground"
              >
                Background
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id={`${uploadId}-tbg`}
                  type="color"
                  value={textBg}
                  onChange={(e) => setTextBg(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-zinc-300 dark:border-zinc-600"
                />
                <input
                  type="text"
                  value={textBg}
                  onChange={(e) => setTextBg(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor={`${uploadId}-tfg`}
                className="block text-sm font-medium text-foreground"
              >
                Text color
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id={`${uploadId}-tfg`}
                  type="color"
                  value={textFg}
                  onChange={(e) => setTextFg(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-zinc-300 dark:border-zinc-600"
                />
                <input
                  type="text"
                  value={textFg}
                  onChange={(e) => setTextFg(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>
        )}

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        {busy ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Generating sizes…</p>
        ) : null}

        {previewUrls.size > 0 ? (
          <section aria-labelledby={`${uploadId}-out`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3
                id={`${uploadId}-out`}
                className="text-base font-semibold text-foreground"
              >
                Output
              </h3>
              <div className="flex flex-wrap gap-2">
                {icoUrl ? (
                  <a
                    href={icoUrl}
                    download="favicon.ico"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <Download className="size-3.5 shrink-0" aria-hidden />
                    favicon.ico
                  </a>
                ) : null}
                <button
                  type="button"
                  onMouseDown={preventFocusScrollOnMouseDown}
                  onClick={() => void copyText(defaultHtmlSnippet(), "html")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copiedKey === "html" ? (
                    <Check
                      className="size-3.5 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                  ) : (
                    <Copy className="size-3.5 shrink-0" aria-hidden />
                  )}
                  Copy HTML snippet
                </button>
              </div>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PNG_SIZES.map((size) => {
                const url = previewUrls.get(size);
                const blob = pngBlobs.get(size);
                if (!url || !blob) return null;
                const name =
                  size === 180
                    ? "apple-touch-icon.png"
                    : size === 192
                      ? "android-chrome-192x192.png"
                      : size === 512
                        ? "android-chrome-512x512.png"
                        : `favicon-${size}x${size}.png`;
                return (
                  <li
                    key={size}
                    className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-700 dark:bg-zinc-900/30"
                  >
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-600 dark:bg-zinc-950"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview only */}
                      <img
                        src={url}
                        alt={`${size} by ${size} favicon preview`}
                        className="max-h-12 max-w-12 object-contain"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {size}×{size}px PNG
                      </p>
                      <a
                        href={url}
                        download={name}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                      >
                        <Download className="size-3 shrink-0" aria-hidden />
                        Download
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {mode === "image"
              ? "Upload an image to generate favicon.ico and PNG sizes."
              : "Adjust text and colors—output appears automatically."}
          </p>
        )}
      </div>
    </div>
  );
}
