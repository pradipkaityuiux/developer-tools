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
  type ArticleFields,
  type BreadcrumbItem,
  type FaqPair,
  type OrganizationFields,
  type ProductFields,
  type ReviewFields,
  type SchemaKind,
  DEFAULT_ARTICLE,
  DEFAULT_BREADCRUMB,
  DEFAULT_FAQ_PAIRS,
  DEFAULT_ORGANIZATION,
  DEFAULT_PRODUCT,
  DEFAULT_REVIEW,
  buildJsonLdForKind,
  detectKindFromJson,
} from "@/lib/schema-generator-core";

const KIND_TABS: { id: SchemaKind; label: string; hint: string }[] = [
  { id: "article", label: "Article", hint: "BlogPosting-style article fields" },
  { id: "faq", label: "FAQ", hint: "FAQPage with Q&A entities" },
  { id: "product", label: "Product", hint: "Product + Offer" },
  { id: "review", label: "Review", hint: "Review + Rating" },
  { id: "organization", label: "Organization", hint: "Org logo & sameAs" },
  { id: "breadcrumb", label: "Breadcrumb", hint: "BreadcrumbList trail" },
];

function parseLdJsonInput(raw: string): unknown | null {
  const t = raw.trim();
  try {
    return JSON.parse(t);
  } catch {
    const m = t.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (m) {
      try {
        return JSON.parse(m[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}

function wrapInScriptTag(json: string): string {
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

export function SchemaGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<SchemaKind>("article");
  const [article, setArticle] = useState<ArticleFields>(DEFAULT_ARTICLE);
  const [faqPairs, setFaqPairs] = useState<FaqPair[]>(DEFAULT_FAQ_PAIRS);
  const [product, setProduct] = useState<ProductFields>(DEFAULT_PRODUCT);
  const [review, setReview] = useState<ReviewFields>(DEFAULT_REVIEW);
  const [organization, setOrganization] =
    useState<OrganizationFields>(DEFAULT_ORGANIZATION);
  const [breadcrumb, setBreadcrumb] =
    useState<BreadcrumbItem[]>(DEFAULT_BREADCRUMB);

  const [wrapScript, setWrapScript] = useState(false);
  const [edited, setEdited] = useState(false);
  const [overrideText, setOverrideText] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 5000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const jsonObject = useMemo(
    () =>
      buildJsonLdForKind(
        kind,
        article,
        faqPairs,
        product,
        review,
        organization,
        breadcrumb,
      ),
    [kind, article, faqPairs, product, review, organization, breadcrumb],
  );

  const generatedJson = useMemo(
    () => JSON.stringify(jsonObject, null, 2),
    [jsonObject],
  );

  const computedOutput = useMemo(
    () =>
      wrapScript ? wrapInScriptTag(generatedJson) : generatedJson,
    [generatedJson, wrapScript],
  );

  const displayText =
    edited && overrideText !== null ? overrideText : computedOutput;

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
      const parsed = parseLdJsonInput(raw);
      setOverrideText(raw.trim() ? raw : "");
      setEdited(true);
      if (parsed) {
        const det = detectKindFromJson(parsed);
        if (det) {
          setKind(det.kind);
          setFileHint(
            `Loaded “${file.name}”. Switched to ${det.kind} tab—review fields or edit JSON.`,
          );
        } else {
          setFileHint(
            `Loaded “${file.name}”. Could not detect @type—edit JSON or pick a tab.`,
          );
        }
      } else {
        setFileHint(
          `Loaded “${file.name}”. Fix JSON syntax or wrap in a script tag.`,
        );
      }
    };
    reader.onerror = () => {
      setFileHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const download = useCallback(() => {
    if (!displayText.trim()) return;
    const blob = new Blob([displayText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = wrapScript && !edited ? "schema-ld.html-snippet.txt" : "schema.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [displayText, edited, wrapScript]);

  const copy = useCallback(async () => {
    if (!displayText.trim()) return;
    try {
      await navigator.clipboard.writeText(displayText);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileHint("Clipboard not available—select the text and copy manually.");
    }
  }, [displayText]);

  const fillArticleExample = useCallback(() => {
    setArticle(DEFAULT_ARTICLE);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const fillFaqExample = useCallback(() => {
    setFaqPairs([...DEFAULT_FAQ_PAIRS]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addFaqRow = useCallback(() => {
    setFaqPairs((rows) => [...rows, { question: "", answer: "" }]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const updateFaq = useCallback((index: number, field: keyof FaqPair, value: string) => {
    setFaqPairs((rows) => {
      const next = [...rows];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeFaq = useCallback((index: number) => {
    setFaqPairs((rows) => rows.filter((_, i) => i !== index));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addCrumb = useCallback(() => {
    setBreadcrumb((rows) => [...rows, { name: "", url: "" }]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const updateCrumb = useCallback(
    (index: number, field: keyof BreadcrumbItem, value: string) => {
      setBreadcrumb((rows) => {
        const next = [...rows];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
      setEdited(false);
      setOverrideText(null);
    },
    [],
  );

  const removeCrumb = useCallback((index: number) => {
    setBreadcrumb((rows) => rows.filter((_, i) => i !== index));
    setEdited(false);
    setOverrideText(null);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 shrink-0 space-y-6 lg:w-[min(100%,28rem)]">
          <div>
            <p className="text-sm font-medium text-foreground">Schema type</p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="tablist"
              aria-label="JSON-LD schema type"
            >
              {KIND_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={kind === tab.id}
                  title={tab.hint}
                  onClick={() => {
                    setKind(tab.id);
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    kind === tab.id
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {kind === "article" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">
                Article / BlogPosting
              </legend>
              <div>
                <label htmlFor="art-headline" className="text-sm font-medium text-foreground">
                  Headline
                </label>
                <input
                  id="art-headline"
                  value={article.headline}
                  onChange={(e) => {
                    setArticle((a) => ({ ...a, headline: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="art-desc" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="art-desc"
                  value={article.description}
                  onChange={(e) => {
                    setArticle((a) => ({ ...a, description: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  rows={3}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="art-url" className="text-sm font-medium text-foreground">
                  URL (canonical)
                </label>
                <input
                  id="art-url"
                  type="url"
                  value={article.url}
                  onChange={(e) => {
                    setArticle((a) => ({ ...a, url: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="art-img" className="text-sm font-medium text-foreground">
                  Image URL
                </label>
                <input
                  id="art-img"
                  type="url"
                  value={article.image}
                  onChange={(e) => {
                    setArticle((a) => ({ ...a, image: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="art-pub" className="text-sm font-medium text-foreground">
                    datePublished (ISO)
                  </label>
                  <input
                    id="art-pub"
                    value={article.datePublished}
                    onChange={(e) => {
                      setArticle((a) => ({ ...a, datePublished: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="art-mod" className="text-sm font-medium text-foreground">
                    dateModified (ISO)
                  </label>
                  <input
                    id="art-mod"
                    value={article.dateModified}
                    onChange={(e) => {
                      setArticle((a) => ({ ...a, dateModified: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="art-author" className="text-sm font-medium text-foreground">
                    Author name
                  </label>
                  <input
                    id="art-author"
                    value={article.authorName}
                    onChange={(e) => {
                      setArticle((a) => ({ ...a, authorName: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="art-pubname" className="text-sm font-medium text-foreground">
                    Publisher name
                  </label>
                  <input
                    id="art-pubname"
                    value={article.publisherName}
                    onChange={(e) => {
                      setArticle((a) => ({ ...a, publisherName: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="art-section" className="text-sm font-medium text-foreground">
                  Article section (optional)
                </label>
                <input
                  id="art-section"
                  value={article.articleSection}
                  onChange={(e) => {
                    setArticle((a) => ({ ...a, articleSection: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={fillArticleExample}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Reset article example
              </button>
            </fieldset>
          ) : null}

          {kind === "faq" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">FAQPage</legend>
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Each pair becomes a Question with an accepted Answer. Only non-empty rows are emitted.
              </p>
              <ul className="space-y-4">
                {faqPairs.map((row, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Q{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFaq(i)}
                        className="shrink-0 rounded border border-zinc-300 px-2 py-0.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                      >
                        Remove
                      </button>
                    </div>
                    <label className="mt-2 block text-xs font-medium text-foreground">
                      Question
                      <input
                        value={row.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </label>
                    <label className="mt-2 block text-xs font-medium text-foreground">
                      Answer
                      <textarea
                        value={row.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        rows={3}
                        className="mt-1 w-full resize-y rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addFaqRow}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Add question
                </button>
                <button
                  type="button"
                  onClick={fillFaqExample}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Reset FAQ example
                </button>
              </div>
            </fieldset>
          ) : null}

          {kind === "product" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Product + Offer</legend>
              {(
                [
                  ["name", "Name", product.name],
                  ["description", "Description", product.description],
                  ["image", "Image URL", product.image],
                  ["sku", "SKU", product.sku],
                  ["brand", "Brand", product.brand],
                  ["url", "Offer / product URL", product.url],
                  ["price", "Price", product.price],
                  ["priceCurrency", "Currency (ISO)", product.priceCurrency],
                  ["availability", "Availability URL", product.availability],
                ] as const
              ).map(([key, label, val]) => (
                <div key={key}>
                  <label htmlFor={`pr-${key}`} className="text-sm font-medium text-foreground">
                    {label}
                  </label>
                  {key === "description" ? (
                    <textarea
                      id={`pr-${key}`}
                      value={val}
                      onChange={(e) => {
                        setProduct((p) => ({ ...p, [key]: e.target.value }));
                        setEdited(false);
                        setOverrideText(null);
                      }}
                      rows={3}
                      className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                    />
                  ) : (
                    <input
                      id={`pr-${key}`}
                      value={val}
                      onChange={(e) => {
                        setProduct((p) => ({ ...p, [key]: e.target.value }));
                        setEdited(false);
                        setOverrideText(null);
                      }}
                      className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setProduct(DEFAULT_PRODUCT);
                  setEdited(false);
                  setOverrideText(null);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Reset product example
              </button>
            </fieldset>
          ) : null}

          {kind === "review" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Review</legend>
              <div>
                <label htmlFor="rev-item-name" className="text-sm font-medium text-foreground">
                  Item reviewed — name
                </label>
                <input
                  id="rev-item-name"
                  value={review.itemReviewedName}
                  onChange={(e) => {
                    setReview((r) => ({ ...r, itemReviewedName: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="rev-item-type" className="text-sm font-medium text-foreground">
                  Item @type (e.g. Product, SoftwareApplication)
                </label>
                <input
                  id="rev-item-type"
                  value={review.itemReviewedType}
                  onChange={(e) => {
                    setReview((r) => ({ ...r, itemReviewedType: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="rev-body" className="text-sm font-medium text-foreground">
                  reviewBody
                </label>
                <textarea
                  id="rev-body"
                  value={review.reviewBody}
                  onChange={(e) => {
                    setReview((r) => ({ ...r, reviewBody: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  rows={4}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="rev-author" className="text-sm font-medium text-foreground">
                    Author name
                  </label>
                  <input
                    id="rev-author"
                    value={review.authorName}
                    onChange={(e) => {
                      setReview((r) => ({ ...r, authorName: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="rev-date" className="text-sm font-medium text-foreground">
                    datePublished
                  </label>
                  <input
                    id="rev-date"
                    value={review.datePublished}
                    onChange={(e) => {
                      setReview((r) => ({ ...r, datePublished: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="rev-rv" className="text-xs font-medium text-foreground">
                    ratingValue
                  </label>
                  <input
                    id="rev-rv"
                    value={review.ratingValue}
                    onChange={(e) => {
                      setReview((r) => ({ ...r, ratingValue: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label htmlFor="rev-best" className="text-xs font-medium text-foreground">
                    bestRating
                  </label>
                  <input
                    id="rev-best"
                    value={review.bestRating}
                    onChange={(e) => {
                      setReview((r) => ({ ...r, bestRating: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <label htmlFor="rev-worst" className="text-xs font-medium text-foreground">
                    worstRating
                  </label>
                  <input
                    id="rev-worst"
                    value={review.worstRating}
                    onChange={(e) => {
                      setReview((r) => ({ ...r, worstRating: e.target.value }));
                      setEdited(false);
                      setOverrideText(null);
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReview(DEFAULT_REVIEW);
                  setEdited(false);
                  setOverrideText(null);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Reset review example
              </button>
            </fieldset>
          ) : null}

          {kind === "organization" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Organization</legend>
              <div>
                <label htmlFor="org-name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="org-name"
                  value={organization.name}
                  onChange={(e) => {
                    setOrganization((o) => ({ ...o, name: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="org-url" className="text-sm font-medium text-foreground">
                  URL
                </label>
                <input
                  id="org-url"
                  type="url"
                  value={organization.url}
                  onChange={(e) => {
                    setOrganization((o) => ({ ...o, url: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="org-logo" className="text-sm font-medium text-foreground">
                  Logo URL
                </label>
                <input
                  id="org-logo"
                  type="url"
                  value={organization.logo}
                  onChange={(e) => {
                    setOrganization((o) => ({ ...o, logo: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="org-desc" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="org-desc"
                  value={organization.description}
                  onChange={(e) => {
                    setOrganization((o) => ({ ...o, description: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  rows={3}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="org-same" className="text-sm font-medium text-foreground">
                  sameAs (one URL per line)
                </label>
                <textarea
                  id="org-same"
                  value={organization.sameAs}
                  onChange={(e) => {
                    setOrganization((o) => ({ ...o, sameAs: e.target.value }));
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  rows={3}
                  placeholder="https://twitter.com/..."
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrganization(DEFAULT_ORGANIZATION);
                  setEdited(false);
                  setOverrideText(null);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Reset organization example
              </button>
            </fieldset>
          ) : null}

          {kind === "breadcrumb" ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">BreadcrumbList</legend>
              <ul className="space-y-3">
                {breadcrumb.map((row, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-700"
                  >
                    <label className="min-w-[8rem] flex-1 text-xs font-medium text-foreground">
                      Name
                      <input
                        value={row.name}
                        onChange={(e) => updateCrumb(i, "name", e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </label>
                    <label className="min-w-[12rem] flex-[2] text-xs font-medium text-foreground">
                      URL
                      <input
                        value={row.url}
                        onChange={(e) => updateCrumb(i, "url", e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-900"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeCrumb(i)}
                      className="shrink-0 rounded border border-zinc-300 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addCrumb}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Add crumb
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBreadcrumb([...DEFAULT_BREADCRUMB]);
                    setEdited(false);
                    setOverrideText(null);
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                  Reset breadcrumb example
                </button>
              </div>
            </fieldset>
          ) : null}

          <label className="flex cursor-pointer gap-2 text-sm leading-snug">
            <input
              type="checkbox"
              checked={wrapScript}
              onChange={(e) => {
                setWrapScript(e.target.checked);
              }}
              className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
            />
            <span>
              <span className="font-medium text-foreground">Wrap in script tag</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                Outputs <code className="font-mono text-xs">&lt;script type=&quot;application/ld+json&quot;&gt;</code>{" "}
                for paste-ready HTML.
              </span>
            </span>
          </label>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="schema-json-out" className="text-sm font-medium text-foreground">
              JSON-LD output
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                accept="application/json,.json,text/plain"
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
                disabled={!displayText.trim()}
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
              id="schema-json-out"
              value={displayText}
              onChange={(e) => onTextChange(e.target.value)}
              spellCheck={false}
              rows={32}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder='Pick a schema type or upload JSON-LD…'
            />
            <button
              type="button"
              onClick={() => void copy()}
              disabled={!displayText.trim()}
              title={copyDone ? "Copied" : "Copy JSON-LD"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy JSON-LD"}
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
              ? "You edited the output. Use Reset to form to replace it with values from the fields."
              : "Output updates when you change the schema type or fields. Toggle “Wrap in script tag” for HTML paste."}
          </p>
        </div>
      </div>
    </div>
  );
}
