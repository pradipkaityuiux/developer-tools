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
import { Check, Copy, Download, Upload } from "lucide-react";
import {
  buildRobotsTxtContent,
  DEFAULT_ROBOTS_STATE,
  presetAllowAll,
  presetBlockAll,
  presetStagingAllowGoogle,
  presetWordPress,
  type RobotsDirective,
  type RobotsGeneratorState,
  type RobotsRuleRow,
  type RobotsUserAgentBlock,
} from "@/lib/robots-txt-generator-core";

function stateEqual(a: RobotsGeneratorState, b: RobotsGeneratorState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function RobotsTxtGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<RobotsGeneratorState>(DEFAULT_ROBOTS_STATE);
  const merged = useMemo(() => buildRobotsTxtContent(state), [state]);
  const [edited, setEdited] = useState(false);
  const [overrideText, setOverrideText] = useState<string | null>(null);
  const text = edited && overrideText !== null ? overrideText : merged;
  const [copyDone, setCopyDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);
  const [siteBase, setSiteBase] = useState("");

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 4000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const resetToGenerated = useCallback(() => {
    setEdited(false);
    setOverrideText(null);
  }, []);

  const onTextChange = useCallback((value: string) => {
    setOverrideText(value);
    setEdited(true);
  }, []);

  const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      setOverrideText(raw);
      setEdited(true);
      setFileHint(`Loaded “${file.name}”. Edit freely, or use Reset to sync from the form.`);
    };
    reader.onerror = () => {
      setFileHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const download = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const copy = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileHint("Clipboard not available—select the text and copy manually.");
    }
  }, [text]);

  const isDefaultState = useMemo(
    () => stateEqual(state, DEFAULT_ROBOTS_STATE),
    [state],
  );

  const patchState = useCallback((next: RobotsGeneratorState) => {
    setState(next);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const updateBlock = useCallback(
    (index: number, patch: Partial<RobotsUserAgentBlock>) => {
      setState((s) => {
        const blocks = [...s.blocks];
        blocks[index] = { ...blocks[index], ...patch };
        return { ...s, blocks };
      });
      setEdited(false);
      setOverrideText(null);
    },
    [],
  );

  const updateRule = useCallback(
    (blockIndex: number, ruleIndex: number, patch: Partial<RobotsRuleRow>) => {
      setState((s) => {
        const blocks = [...s.blocks];
        const rules = [...blocks[blockIndex].rules];
        rules[ruleIndex] = { ...rules[ruleIndex], ...patch };
        blocks[blockIndex] = { ...blocks[blockIndex], rules };
        return { ...s, blocks };
      });
      setEdited(false);
      setOverrideText(null);
    },
    [],
  );

  const addRule = useCallback((blockIndex: number) => {
    setState((s) => {
      const blocks = [...s.blocks];
      const rules = [
        ...blocks[blockIndex].rules,
        { directive: "Disallow" as const, path: "" },
      ];
      blocks[blockIndex] = { ...blocks[blockIndex], rules };
      return { ...s, blocks };
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeRule = useCallback((blockIndex: number, ruleIndex: number) => {
    setState((s) => {
      const blocks = [...s.blocks];
      const rules = blocks[blockIndex].rules.filter((_, i) => i !== ruleIndex);
      blocks[blockIndex] = {
        ...blocks[blockIndex],
        rules: rules.length > 0 ? rules : [{ directive: "Disallow", path: "" }],
      };
      return { ...s, blocks };
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addBlock = useCallback(() => {
    setState((s) => ({
      ...s,
      blocks: [
        ...s.blocks,
        {
          userAgent: "Googlebot",
          rules: [{ directive: "Allow", path: "/" }],
          crawlDelay: "",
        },
      ],
    }));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      blocks: s.blocks.length > 1 ? s.blocks.filter((_, i) => i !== index) : s.blocks,
    }));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addSitemapRow = useCallback(() => {
    setState((s) => ({ ...s, sitemaps: [...s.sitemaps, ""] }));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const updateSitemap = useCallback((i: number, value: string) => {
    setState((s) => {
      const sitemaps = [...s.sitemaps];
      sitemaps[i] = value;
      return { ...s, sitemaps };
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeSitemap = useCallback((i: number) => {
    setState((s) => ({
      ...s,
      sitemaps: s.sitemaps.filter((_, j) => j !== i),
    }));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const applySitemapFromBase = useCallback(() => {
    const raw = siteBase.trim().replace(/\/$/, "");
    if (!raw) {
      setFileHint("Enter a site URL or origin first (e.g. https://example.com).");
      return;
    }
    let url: URL;
    try {
      url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    } catch {
      setFileHint("Could not parse that URL—include https://example.com");
      return;
    }
    const sm = `${url.origin}/sitemap.xml`;
    setState((s) => ({
      ...s,
      sitemaps: s.sitemaps.includes(sm) ? s.sitemaps : [...s.sitemaps, sm],
    }));
    setEdited(false);
    setOverrideText(null);
    setFileHint(`Added ${sm}`);
  }, [siteBase]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 shrink-0 space-y-6 lg:w-[min(100%,28rem)]">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              Optional header comment
            </legend>
            <textarea
              value={state.commentBlock}
              onChange={(e) => {
                const v = e.target.value;
                setState((s) => ({ ...s, commentBlock: v }));
                setEdited(false);
                setOverrideText(null);
              }}
              rows={3}
              spellCheck={false}
              placeholder="# Lines become comments (# prefix added if needed)"
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
          </fieldset>

          {state.blocks.map((block, bi) => (
            <fieldset
              key={bi}
              className="space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <legend className="text-sm font-medium text-foreground">
                  User-agent group {bi + 1}
                </legend>
                {state.blocks.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeBlock(bi)}
                    className="text-xs font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground dark:text-zinc-400"
                  >
                    Remove group
                  </button>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor={`ua-${bi}`}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  User-agent
                </label>
                <input
                  id={`ua-${bi}`}
                  type="text"
                  value={block.userAgent}
                  onChange={(e) => updateBlock(bi, { userAgent: e.target.value })}
                  placeholder="*"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <ul className="space-y-2">
                {block.rules.map((rule, ri) => (
                  <li
                    key={`${bi}-${ri}`}
                    className="flex flex-wrap items-end gap-2 sm:flex-nowrap"
                  >
                    <div className="min-w-0 shrink-0 sm:w-28">
                      <label
                        className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                        htmlFor={`dir-${bi}-${ri}`}
                      >
                        Rule
                      </label>
                      <select
                        id={`dir-${bi}-${ri}`}
                        value={rule.directive}
                        onChange={(e) =>
                          updateRule(bi, ri, {
                            directive: e.target.value as RobotsDirective,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                      >
                        <option value="Disallow">Disallow</option>
                        <option value="Allow">Allow</option>
                      </select>
                    </div>
                    <div className="min-w-0 flex-1">
                      <label
                        className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                        htmlFor={`path-${bi}-${ri}`}
                      >
                        Path prefix
                      </label>
                      <input
                        id={`path-${bi}-${ri}`}
                        type="text"
                        value={rule.path}
                        onChange={(e) =>
                          updateRule(bi, ri, { path: e.target.value })
                        }
                        placeholder="/ or empty"
                        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(bi, ri)}
                      className="shrink-0 rounded border border-zinc-300 px-2 py-2 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => addRule(bi)}
                className="text-xs font-medium text-foreground underline decoration-zinc-400 underline-offset-2"
              >
                + Add Allow / Disallow line
              </button>
              <div>
                <label
                  htmlFor={`cd-${bi}`}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Crawl-delay (optional)
                </label>
                <input
                  id={`cd-${bi}`}
                  type="text"
                  inputMode="decimal"
                  value={block.crawlDelay}
                  onChange={(e) => updateBlock(bi, { crawlDelay: e.target.value })}
                  placeholder="e.g. 1 (Google ignores this)"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
            </fieldset>
          ))}

          <button
            type="button"
            onClick={addBlock}
            className="rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            + Add User-agent group
          </button>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              Sitemap URLs
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="site-base"
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Site base (quick add)
                </label>
                <input
                  id="site-base"
                  type="url"
                  value={siteBase}
                  onChange={(e) => setSiteBase(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={applySitemapFromBase}
                className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Append /sitemap.xml
              </button>
            </div>
            {state.sitemaps.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No sitemaps yet—add URLs below or use the quick add control.
              </p>
            ) : null}
            <ul className="space-y-2">
              {state.sitemaps.map((sm, i) => (
                <li key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={sm}
                    onChange={(e) => updateSitemap(i, e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    aria-label={`Sitemap URL ${i + 1}`}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeSitemap(i)}
                    className="shrink-0 rounded border border-zinc-300 px-2 py-2 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addSitemapRow}
              className="text-xs font-medium text-foreground underline decoration-zinc-400 underline-offset-2"
            >
              + Add Sitemap line
            </button>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => patchState(presetAllowAll())}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Allow all
            </button>
            <button
              type="button"
              onClick={() => patchState(presetBlockAll())}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Block all
            </button>
            <button
              type="button"
              onClick={() => patchState(presetWordPress())}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              WordPress starter
            </button>
            <button
              type="button"
              onClick={() => patchState(presetStagingAllowGoogle())}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Staging: Google only
            </button>
            <button
              type="button"
              onClick={() => patchState(DEFAULT_ROBOTS_STATE)}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Reset all
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="robots-output"
              className="text-sm font-medium text-foreground"
            >
              Preview (robots.txt)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                accept=".txt,text/plain,*/*"
                className="sr-only"
                onChange={onUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Download className="size-4 shrink-0" aria-hidden />
                Download
              </button>
              {edited ? (
                <button
                  type="button"
                  onClick={resetToGenerated}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Reset to form
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="robots-output"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              spellCheck={false}
              rows={32}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="# Configure the form or upload an existing robots.txt…"
            />
            <button
              type="button"
              onClick={() => void copy()}
              disabled={!text.trim()}
              title={copyDone ? "Copied" : "Copy robots.txt"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy robots.txt"}
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

          {fileHint ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              {fileHint}
            </p>
          ) : null}

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {edited
              ? "You edited the preview. Use Reset to form to replace it with output from the controls."
              : isDefaultState
                ? "Default: single * group with empty Disallow (allow all). Add Sitemap lines when your XML sitemap is live."
                : "Preview updates when you change the form."}
          </p>
        </div>
      </div>
    </div>
  );
}
