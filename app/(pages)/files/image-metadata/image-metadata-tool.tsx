"use client";

import exifr from "exifr";
import { Check, Copy, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const MAX_BYTES = 40 * 1024 * 1024;

const CAMERA_KEYS = [
  "Make",
  "Model",
  "LensMake",
  "LensModel",
  "LensSerialNumber",
  "SerialNumber",
  "BodySerialNumber",
  "UniqueCameraModel",
  "LocalizedCameraModel",
  "Artist",
];

const EXPOSURE_KEYS = [
  "ExposureTime",
  "FNumber",
  "ISO",
  "ExposureProgram",
  "ShutterSpeedValue",
  "ApertureValue",
  "BrightnessValue",
  "ExposureCompensation",
  "MeteringMode",
  "Flash",
  "FocalLength",
  "FocalLengthIn35mmFormat",
  "WhiteBalance",
  "ExposureMode",
  "SceneCaptureType",
  "SensitivityType",
];

const DATE_KEYS = [
  "DateTimeOriginal",
  "CreateDate",
  "ModifyDate",
  "OffsetTime",
  "OffsetTimeOriginal",
  "OffsetTimeDigitized",
  "SubSecTimeOriginal",
  "SubSecTimeDigitized",
];

const GPS_KEYS = [
  "latitude",
  "longitude",
  "GPSLatitude",
  "GPSLongitude",
  "GPSLatitudeRef",
  "GPSLongitudeRef",
  "GPSAltitude",
  "GPSAltitudeRef",
  "GPSDateStamp",
  "GPSTimeStamp",
  "GPSImgDirection",
  "GPSImgDirectionRef",
  "GPSHPositioningError",
];

const SOFTWARE_KEYS = [
  "Software",
  "HostComputer",
  "ProcessingSoftware",
  "Orientation",
  "ImageWidth",
  "ImageHeight",
  "ExifImageWidth",
  "ExifImageHeight",
];

function formatExifValue(key: string, value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) {
    return value.byteLength <= 64
      ? `[${value.byteLength} bytes]`
      : `[binary: ${value.byteLength} bytes]`;
  }
  if (typeof value === "number") {
    if (key === "ExposureTime" && value > 0 && value < 0.5) {
      const inv = Math.round(1 / value);
      return `${value.toFixed(6).replace(/\.?0+$/, "")} s (≈ 1/${inv})`;
    }
    if (Number.isFinite(value) && Math.abs(value) >= 1000)
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return String(value);
  }
  if (typeof value === "object") {
    if (Array.isArray(value))
      return value.map((v) => formatExifValue(key, v)).join(", ");
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function jsonReplacer(_key: string, value: unknown) {
  if (value instanceof Uint8Array)
    return `[Uint8Array ${value.byteLength} bytes]`;
  if (typeof value === "bigint") return value.toString();
  return value;
}

type ExifRecord = Record<string, unknown>;

function pickSection(
  data: ExifRecord | null,
  keys: string[],
): { key: string; value: string }[] {
  if (!data) return [];
  const out: { key: string; value: string }[] = [];
  for (const key of keys) {
    if (!(key in data)) continue;
    const raw = data[key];
    if (raw === undefined || raw === null) continue;
    out.push({ key, value: formatExifValue(key, raw) });
  }
  return out;
}

function allEntriesSorted(
  data: ExifRecord | null,
  used: Set<string>,
): { key: string; value: string }[] {
  if (!data) return [];
  return Object.keys(data)
    .filter((k) => !used.has(k) && k !== "errors")
    .sort((a, b) => a.localeCompare(b))
    .map((key) => ({
      key,
      value: formatExifValue(key, data[key]),
    }));
}

function MetaTable({
  title,
  rows,
}: {
  title: string;
  rows: { key: string; value: string }[];
}) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <dl className="mt-2 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-700 dark:border-zinc-700">
        {rows.map(({ key, value }) => (
          <div
            key={key}
            className="grid gap-1 px-3 py-2 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4"
          >
            <dt className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {key}
            </dt>
            <dd className="break-words text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ImageMetadataTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<number | null>(null);
  const [mime, setMime] = useState<string | null>(null);
  const [pixelW, setPixelW] = useState<number | null>(null);
  const [pixelH, setPixelH] = useState<number | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [exif, setExif] = useState<ExifRecord | null>(null);
  const [exifNote, setExifNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyWhich, setCopyWhich] = useState<"summary" | "json" | null>(null);

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  const revokePreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => () => revokePreview(), [revokePreview]);

  const loadFile = useCallback(
    async (file: File) => {
      setError(null);
      setExifNote(null);
      setPreviewError(null);
      if (!file.type.startsWith("image/")) {
        setError(
          "Please choose an image file (PNG, JPEG, WebP, GIF, TIFF, etc.).",
        );
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(
          `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try a smaller file or strip previews first.`,
        );
        return;
      }

      revokePreview();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      setFileLabel(file.name);
      setFileBytes(file.size);
      setMime(file.type || null);
      setPixelW(null);
      setPixelH(null);
      setExif(null);
      setLoading(true);

      try {
        const parsed = await exifr.parse(file, {
          mergeOutput: true,
          reviveValues: true,
          translateKeys: true,
          translateValues: true,
          jfif: true,
          ihdr: true,
        });
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const rec = parsed as ExifRecord;
          setExif(rec);
          const keys = Object.keys(rec).filter((k) => k !== "errors");
          if (keys.length === 0)
            setExifNote(
              "No EXIF or embedded TIFF metadata found. The file may have been stripped, or metadata lives in a sidecar.",
            );
        } else {
          setExif(null);
          setExifNote(
            "No structured EXIF object returned for this file. Dimensions and preview may still be available.",
          );
        }
      } catch {
        setExif(null);
        setExifNote("Metadata parse failed for this file; preview may still load.");
      } finally {
        setLoading(false);
      }
    },
    [revokePreview],
  );

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void loadFile(file);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) void loadFile(file);
    },
    [loadFile],
  );

  function clearAll() {
    revokePreview();
    setPreviewUrl(null);
    setFileLabel(null);
    setFileBytes(null);
    setMime(null);
    setPixelW(null);
    setPixelH(null);
    setPreviewError(null);
    setExif(null);
    setExifNote(null);
    setError(null);
    setLoading(false);
    setCopyWhich(null);
  }

  const usedKeys = new Set<string>();
  const cameraRows = pickSection(exif, CAMERA_KEYS);
  const exposureRows = pickSection(exif, EXPOSURE_KEYS);
  const dateRows = pickSection(exif, DATE_KEYS);
  const gpsRows = pickSection(exif, GPS_KEYS);
  const softwareRows = pickSection(exif, SOFTWARE_KEYS);
  for (const row of [
    ...cameraRows,
    ...exposureRows,
    ...dateRows,
    ...gpsRows,
    ...softwareRows,
  ]) {
    usedKeys.add(row.key);
  }
  const otherRows = allEntriesSorted(exif, usedKeys);

  function buildSummary(): string {
    const lines: string[] = [];
    lines.push(`File: ${fileLabel ?? "unknown"}`);
    if (fileBytes != null)
      lines.push(`Size: ${fileBytes} bytes (${(fileBytes / 1024).toFixed(1)} KB)`);
    if (mime) lines.push(`MIME: ${mime}`);
    if (pixelW != null && pixelH != null)
      lines.push(`Decoded dimensions: ${pixelW} × ${pixelH} px`);

    const append = (title: string, rows: { key: string; value: string }[]) => {
      if (rows.length === 0) return;
      lines.push("");
      lines.push(`[${title}]`);
      for (const { key, value } of rows) lines.push(`${key}: ${value}`);
    };

    append("Camera & lens", cameraRows);
    append("Exposure", exposureRows);
    append("Dates", dateRows);
    append("GPS", gpsRows);
    append("Software & image", softwareRows);
    append("Other tags", otherRows);
    return lines.join("\n");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setCopyWhich("summary");
      setError(null);
    } catch {
      setError("Clipboard blocked—select text and copy manually.");
    }
  }

  async function copyJson() {
    if (!exif) return;
    try {
      const text = JSON.stringify(exif, jsonReplacer, 2);
      await navigator.clipboard.writeText(text);
      setCopyWhich("json");
      setError(null);
    } catch {
      setError("Clipboard blocked—select text and copy manually.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={fileId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload image
          </button>
          {previewUrl ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copySummary()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "summary" ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-3.5 shrink-0" aria-hidden />
                )}
                Copy summary
              </button>
              <button
                type="button"
                onClick={() => void copyJson()}
                disabled={!exif || Object.keys(exif).length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "json" ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-3.5 shrink-0" aria-hidden />
                )}
                Copy JSON
              </button>
            </div>
          ) : null}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={onDrop}
          className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-600 dark:bg-zinc-900/40 sm:p-6"
        >
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Drag and drop an image here, or use{" "}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Upload image
            </button>
            .
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Reading metadata…
          </p>
        ) : null}

        {previewUrl ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Preview</p>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={fileLabel ? `Preview of ${fileLabel}` : "Uploaded image"}
                  className="mx-auto max-h-72 w-auto max-w-full object-contain p-2"
                  onLoad={(e) => {
                    const el = e.currentTarget;
                    setPixelW(el.naturalWidth);
                    setPixelH(el.naturalHeight);
                    setPreviewError(null);
                  }}
                  onError={() => {
                    setPreviewError(
                      "Preview could not be decoded in this browser. EXIF below may still be partial.",
                    );
                    setPixelW(null);
                    setPixelH(null);
                  }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {fileLabel ? (
                  <>
                    <span className="font-medium text-foreground">{fileLabel}</span>
                    {fileBytes != null ? (
                      <>
                        {" "}
                        · {(fileBytes / 1024).toFixed(1)} KB
                      </>
                    ) : null}
                    {mime ? (
                      <>
                        {" "}
                        · <code className="font-mono">{mime}</code>
                      </>
                    ) : null}
                  </>
                ) : null}
              </p>
              {pixelW != null && pixelH != null ? (
                <p className="text-sm text-foreground">
                  <strong className="font-medium">Decoded size:</strong>{" "}
                  {pixelW} × {pixelH} px
                </p>
              ) : null}
              {previewError ? (
                <p
                  className="text-sm text-amber-800 dark:text-amber-200"
                  role="alert"
                >
                  {previewError}
                </p>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              {exifNote ? (
                <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  {exifNote}
                </p>
              ) : null}
              <MetaTable title="Camera & lens" rows={cameraRows} />
              <MetaTable title="Exposure" rows={exposureRows} />
              <MetaTable title="Dates & time" rows={dateRows} />
              <MetaTable title="GPS (when present)" rows={gpsRows} />
              <MetaTable title="Software & dimensions (EXIF)" rows={softwareRows} />
              {otherRows.length > 0 ? (
                <MetaTable title="All other tags" rows={otherRows} />
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            No image loaded. Upload a photo to inspect EXIF: camera model, lens,
            exposure, timestamps, and optional GPS—processed locally in your
            browser.
          </p>
        )}

        {previewUrl ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        ) : null}

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          EXIF can include location and device identifiers. Scrub metadata
          before publishing if privacy matters. Parsing uses exifr in your tab;
          files are not sent to our servers.
        </p>
      </div>
    </div>
  );
}
