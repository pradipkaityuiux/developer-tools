"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { Check, Copy, Upload } from "lucide-react";
import {
  buildOgMetaSnippet,
  DEFAULT_OG_TAG_STATE,
  parseOgFromHtml,
  previewHostname,
  type OgTagGeneratorState,
} from "@/lib/og-tag-generator-core";

export function OgTagGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<OgTagGeneratorState>(DEFAULT_OG_TAG_STATE);
  const [copyDone, setCopyDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 5000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const snippet = useMemo(() => buildOgMetaSnippet(state), [state]);

  const patch = useCallback((partial: Partial<OgTagGeneratorState>) => {
    setState((s) => ({ ...s, ...partial }));
  }, []);

  const copy = useCallback(async () => {
    if (!snippet.trim()) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileHint("Clipboard not available—select the snippet and copy manually.");
    }
  }, [snippet]);

  const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseOgFromHtml(raw);
      setState((prev) => ({
        ...prev,
        ...parsed,
        ogType: parsed.ogType ?? prev.ogType,
        ogLocale: parsed.ogLocale ?? prev.ogLocale,
        twitterCard: parsed.twitterCard ?? prev.twitterCard,
      }));
      setImgBroken(false);
      setFileHint(`Imported meta tags from “${file.name}”. Adjust fields and copy the snippet.`);
    };
    reader.onerror = () => {
      setFileHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const host = previewHostname(state.ogUrl);
  const previewTitle = state.ogTitle.trim() || "Your page title";
  const previewDesc =
    state.ogDescription.trim() ||
    "Add a compelling description—this text appears under the title in many link previews.";
  const showImage = state.ogImage.trim() && !imgBroken;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Open Graph
            </legend>
            <label className="block">
              <span className="text-sm font-medium text-foreground">og:title</span>
              <input
                type="text"
                value={state.ogTitle}
                onChange={(e) => patch({ ogTitle: e.target.value })}
                placeholder="Launch checklist: ship faster with confidence"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                og:description
              </span>
              <textarea
                value={state.ogDescription}
                onChange={(e) => patch({ ogDescription: e.target.value })}
                placeholder="One or two sentences that sell the click when this link is shared."
                rows={3}
                className="mt-1 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">og:image</span>
              <input
                type="url"
                value={state.ogImage}
                onChange={(e) => {
                  patch({ ogImage: e.target.value });
                  setImgBroken(false);
                }}
                placeholder="https://example.com/og/cover-1200x630.jpg"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                og:image:alt (optional)
              </span>
              <input
                type="text"
                value={state.ogImageAlt}
                onChange={(e) => patch({ ogImageAlt: e.target.value })}
                placeholder="Describe the hero image for accessibility"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">og:url</span>
              <input
                type="url"
                value={state.ogUrl}
                onChange={(e) => patch({ ogUrl: e.target.value })}
                placeholder="https://example.com/blog/post-slug"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">og:type</span>
                <input
                  type="text"
                  value={state.ogType}
                  onChange={(e) => patch({ ogType: e.target.value })}
                  placeholder="website"
                  list="og-type-suggestions"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                />
                <datalist id="og-type-suggestions">
                  <option value="website" />
                  <option value="article" />
                  <option value="product" />
                  <option value="profile" />
                  <option value="video" />
                </datalist>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  og:locale
                </span>
                <input
                  type="text"
                  value={state.ogLocale}
                  onChange={(e) => patch({ ogLocale: e.target.value })}
                  placeholder="en_US"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                og:site_name (optional)
              </span>
              <input
                type="text"
                value={state.ogSiteName}
                onChange={(e) => patch({ ogSiteName: e.target.value })}
                placeholder="Your product name"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Article metadata (optional)
            </legend>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={state.includeArticle}
                onChange={(e) => patch({ includeArticle: e.target.checked })}
                className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
              />
              <span>
                Emit <code className="font-mono text-xs">article:*</code> tags
                when you publish blog or news URLs (also implied when{" "}
                <code className="font-mono text-xs">og:type</code> is{" "}
                <code className="font-mono text-xs">article</code>).
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                article:published_time (ISO 8601)
              </span>
              <input
                type="text"
                value={state.articlePublishedTime}
                onChange={(e) => patch({ articlePublishedTime: e.target.value })}
                placeholder="2026-04-04T12:00:00Z"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                article:modified_time (ISO 8601)
              </span>
              <input
                type="text"
                value={state.articleModifiedTime}
                onChange={(e) => patch({ articleModifiedTime: e.target.value })}
                placeholder="2026-04-04T15:30:00Z"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                article:author (URL or name)
              </span>
              <input
                type="text"
                value={state.articleAuthor}
                onChange={(e) => patch({ articleAuthor: e.target.value })}
                placeholder="https://example.com/authors/jane"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Twitter / X Cards
            </legend>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={state.includeTwitter}
                onChange={(e) => patch({ includeTwitter: e.target.checked })}
                className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600"
              />
              <span>
                Include <code className="font-mono text-xs">twitter:*</code>{" "}
                tags (empty Twitter title/description/image mirror Open Graph).
              </span>
            </label>
            {state.includeTwitter ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    twitter:card
                  </span>
                  <select
                    value={state.twitterCard}
                    onChange={(e) => patch({ twitterCard: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  >
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                    <option value="app">app</option>
                    <option value="player">player</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    twitter:title (optional override)
                  </span>
                  <input
                    type="text"
                    value={state.twitterTitle}
                    onChange={(e) => patch({ twitterTitle: e.target.value })}
                    placeholder="Leave blank to reuse og:title"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    twitter:description (optional override)
                  </span>
                  <textarea
                    value={state.twitterDescription}
                    onChange={(e) =>
                      patch({ twitterDescription: e.target.value })
                    }
                    placeholder="Leave blank to reuse og:description"
                    rows={2}
                    className="mt-1 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    twitter:image (optional override)
                  </span>
                  <input
                    type="url"
                    value={state.twitterImage}
                    onChange={(e) => patch({ twitterImage: e.target.value })}
                    placeholder="Leave blank to reuse og:image"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    twitter:site (optional @handle)
                  </span>
                  <input
                    type="text"
                    value={state.twitterSite}
                    onChange={(e) => patch({ twitterSite: e.target.value })}
                    placeholder="@yourbrand"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  />
                </label>
              </>
            ) : null}
          </fieldset>

          <div className="flex flex-wrap items-center gap-2">
            <input
              id={fileInputId}
              ref={fileRef}
              type="file"
              accept=".html,.htm,text/html"
              className="sr-only"
              onChange={onUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload HTML
            </button>
            <button
              type="button"
              onClick={() => {
                setState(DEFAULT_OG_TAG_STATE);
                setImgBroken(false);
                setFileHint("Reset to empty fields.");
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear all
            </button>
          </div>
          {fileHint ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              {fileHint}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 space-y-6 lg:max-w-md">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Share card preview
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Approximate layout—each network crops images and applies its own styles.
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              {showImage ? (
                <div className="relative aspect-[1200/630] w-full bg-zinc-200 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.ogImage.trim()}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setImgBroken(true)}
                  />
                </div>
              ) : (
                <div className="flex aspect-[1200/630] w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 text-sm text-zinc-500 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-400">
                  {state.ogImage.trim()
                    ? "Image failed to load—check URL and HTTPS."
                    : "Add an og:image URL to preview the cover."}
                </div>
              )}
              <div className="space-y-1.5 p-3">
                <p className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
                  {host}
                </p>
                <p className="line-clamp-2 text-base font-semibold text-foreground">
                  {previewTitle}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {previewDesc}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-foreground">
                Meta tags for <code className="font-mono text-xs">&lt;head&gt;</code>
              </h2>
            </div>
            <div className="relative mt-2">
              <textarea
                readOnly
                value={snippet || "<!-- Fill at least one field above —→ -->"}
                spellCheck={false}
                rows={14}
                aria-label="Generated Open Graph meta tags"
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-xs leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => void copy()}
                disabled={!snippet.trim()}
                title={copyDone ? "Copied" : "Copy meta tags"}
                aria-label={copyDone ? "Copied to clipboard" : "Copy meta tags"}
                className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
              >
                {copyDone ? (
                  <Check
                    className="size-[1.125rem] text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-[1.125rem]" aria-hidden />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Paste into your layout, CMS custom head, or framework metadata API.
              Validate a live URL afterward with our{" "}
              <Link
                href="/website/open-graph-preview"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                Open Graph preview
              </Link>{" "}
              tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
