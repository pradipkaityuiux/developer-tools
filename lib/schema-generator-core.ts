/**
 * Build Schema.org JSON-LD objects for common rich-result types.
 * Output is plain objects; stringify with JSON.stringify(_, null, 2) for display.
 */

export type SchemaKind =
  | "article"
  | "faq"
  | "product"
  | "review"
  | "organization"
  | "breadcrumb";

const CTX = "https://schema.org";

export interface ArticleFields {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  articleSection: string;
}

export interface FaqPair {
  question: string;
  answer: string;
}

export interface ProductFields {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand: string;
  url: string;
  price: string;
  priceCurrency: string;
  availability: string;
}

export interface ReviewFields {
  itemReviewedName: string;
  itemReviewedType: string;
  reviewBody: string;
  authorName: string;
  datePublished: string;
  ratingValue: string;
  bestRating: string;
  worstRating: string;
}

export interface OrganizationFields {
  name: string;
  url: string;
  logo: string;
  sameAs: string;
  description: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const DEFAULT_ARTICLE: ArticleFields = {
  headline: "How to implement JSON-LD for SEO",
  description:
    "A practical guide to structured data, rich results, and validating schema markup before publish.",
  url: "https://www.example.com/blog/json-ld-seo",
  image: "https://www.example.com/images/json-ld-guide.jpg",
  datePublished: "2026-01-15T09:00:00+00:00",
  dateModified: "2026-04-01T12:00:00+00:00",
  authorName: "Jane Developer",
  publisherName: "Example Media",
  articleSection: "SEO",
};

export const DEFAULT_FAQ_PAIRS: FaqPair[] = [
  {
    question: "What is JSON-LD?",
    answer:
      "JSON-LD is a Linked Data format using JSON. For SEO, it expresses Schema.org types so search engines can understand entities on your page.",
  },
  {
    question: "Where do I put JSON-LD?",
    answer:
      "Typically in a script tag with type application/ld+json in the head or body of the HTML document.",
  },
];

export const DEFAULT_PRODUCT: ProductFields = {
  name: "Wireless noise-cancelling headphones",
  description:
    "Over-ear headphones with 30-hour battery and USB-C fast charging.",
  image: "https://www.example.com/products/headphones.jpg",
  sku: "WH-1000",
  brand: "Example Audio",
  url: "https://www.example.com/products/wireless-headphones",
  price: "249.99",
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
};

export const DEFAULT_REVIEW: ReviewFields = {
  itemReviewedName: "Schema Markup Generator",
  itemReviewedType: "SoftwareApplication",
  reviewBody:
    "Clear forms and copy-ready JSON-LD. Useful for content and ecommerce teams before go-live.",
  authorName: "Alex Reviewer",
  datePublished: "2026-04-04",
  ratingValue: "5",
  bestRating: "5",
  worstRating: "1",
};

export const DEFAULT_ORGANIZATION: OrganizationFields = {
  name: "Example Company",
  url: "https://www.example.com",
  logo: "https://www.example.com/logo.png",
  sameAs: "https://twitter.com/example\nhttps://www.linkedin.com/company/example",
  description:
    "We build developer tools and documentation for technical SEO and web performance.",
};

export const DEFAULT_BREADCRUMB: BreadcrumbItem[] = [
  { name: "Home", url: "https://www.example.com/" },
  { name: "SEO Tools", url: "https://www.example.com/seo" },
  { name: "Schema generator", url: "https://www.example.com/seo/schema-generator" },
];

function trim(s: string): string {
  return s.trim();
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (v === "" || v === undefined || v === null) {
      delete out[k];
    }
  }
  return out;
}

export function buildArticleJsonLd(fields: ArticleFields): Record<string, unknown> {
  const author = trim(fields.authorName)
    ? {
        "@type": "Person",
        name: trim(fields.authorName),
      }
    : undefined;
  const publisher = trim(fields.publisherName)
    ? {
        "@type": "Organization",
        name: trim(fields.publisherName),
      }
    : undefined;

  return omitEmpty({
    "@context": CTX,
    "@type": "Article",
    headline: trim(fields.headline) || undefined,
    description: trim(fields.description) || undefined,
    url: trim(fields.url) || undefined,
    image: trim(fields.image) || undefined,
    datePublished: trim(fields.datePublished) || undefined,
    dateModified: trim(fields.dateModified) || undefined,
    articleSection: trim(fields.articleSection) || undefined,
    author,
    publisher,
  }) as Record<string, unknown>;
}

export function buildFaqJsonLd(pairs: FaqPair[]): Record<string, unknown> {
  const mainEntity = pairs
    .filter((p) => trim(p.question) && trim(p.answer))
    .map((p) => ({
      "@type": "Question",
      name: trim(p.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: trim(p.answer),
      },
    }));

  return {
    "@context": CTX,
    "@type": "FAQPage",
    mainEntity,
  };
}

export function buildProductJsonLd(fields: ProductFields): Record<string, unknown> {
  const offer = omitEmpty({
    "@type": "Offer",
    url: trim(fields.url) || undefined,
    priceCurrency: trim(fields.priceCurrency) || undefined,
    price: trim(fields.price) || undefined,
    availability: trim(fields.availability) || undefined,
  }) as Record<string, unknown>;
  const offerKeys = Object.keys(offer).filter((k) => k !== "@type");

  return omitEmpty({
    "@context": CTX,
    "@type": "Product",
    name: trim(fields.name) || undefined,
    description: trim(fields.description) || undefined,
    image: trim(fields.image) || undefined,
    sku: trim(fields.sku) || undefined,
    brand: trim(fields.brand)
      ? { "@type": "Brand", name: trim(fields.brand) }
      : undefined,
    offers: offerKeys.length > 0 ? offer : undefined,
  }) as Record<string, unknown>;
}

export function buildReviewJsonLd(fields: ReviewFields): Record<string, unknown> {
  const itemType = trim(fields.itemReviewedType) || "Thing";
  const rating = omitEmpty({
    "@type": "Rating",
    ratingValue: trim(fields.ratingValue) || undefined,
    bestRating: trim(fields.bestRating) || undefined,
    worstRating: trim(fields.worstRating) || undefined,
  }) as Record<string, unknown>;
  const ratingKeys = Object.keys(rating).filter((k) => k !== "@type");

  return omitEmpty({
    "@context": CTX,
    "@type": "Review",
    itemReviewed: {
      "@type": itemType,
      name: trim(fields.itemReviewedName) || undefined,
    },
    reviewBody: trim(fields.reviewBody) || undefined,
    author: trim(fields.authorName)
      ? { "@type": "Person", name: trim(fields.authorName) }
      : undefined,
    datePublished: trim(fields.datePublished) || undefined,
    reviewRating: ratingKeys.length > 0 ? rating : undefined,
  }) as Record<string, unknown>;
}

export function buildOrganizationJsonLd(
  fields: OrganizationFields,
): Record<string, unknown> {
  const sameAsLines = fields.sameAs
    .split(/\r?\n/)
    .map((s) => trim(s))
    .filter(Boolean);
  const sameAs = sameAsLines.length ? sameAsLines : undefined;

  return omitEmpty({
    "@context": CTX,
    "@type": "Organization",
    name: trim(fields.name) || undefined,
    url: trim(fields.url) || undefined,
    logo: trim(fields.logo) || undefined,
    description: trim(fields.description) || undefined,
    sameAs,
  }) as Record<string, unknown>;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  const list = items
    .filter((i) => trim(i.name) && trim(i.url))
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: trim(item.name),
      item: trim(item.url),
    }));

  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
}

export function buildJsonLdForKind(
  kind: SchemaKind,
  article: ArticleFields,
  faqPairs: FaqPair[],
  product: ProductFields,
  review: ReviewFields,
  organization: OrganizationFields,
  breadcrumb: BreadcrumbItem[],
): Record<string, unknown> {
  switch (kind) {
    case "article":
      return buildArticleJsonLd(article);
    case "faq":
      return buildFaqJsonLd(faqPairs);
    case "product":
      return buildProductJsonLd(product);
    case "review":
      return buildReviewJsonLd(review);
    case "organization":
      return buildOrganizationJsonLd(organization);
    case "breadcrumb":
      return buildBreadcrumbJsonLd(breadcrumb);
    default:
      return { "@context": CTX, "@type": "Thing" };
  }
}

/** Best-effort: map parsed JSON-LD to our forms and kind. Returns null if unsupported. */
export function detectKindFromJson(
  parsed: unknown,
): { kind: SchemaKind } | null {
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  const t = o["@type"];
  const typeStr = Array.isArray(t) ? String(t[0]) : String(t ?? "");
  switch (typeStr) {
    case "Article":
    case "NewsArticle":
    case "BlogPosting":
      return { kind: "article" };
    case "FAQPage":
      return { kind: "faq" };
    case "Product":
      return { kind: "product" };
    case "Review":
      return { kind: "review" };
    case "Organization":
      return { kind: "organization" };
    case "BreadcrumbList":
      return { kind: "breadcrumb" };
    default:
      return null;
  }
}
