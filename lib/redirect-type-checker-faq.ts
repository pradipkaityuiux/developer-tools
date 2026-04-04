export const redirectTypeCheckerFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is the difference between a 301 and 302 redirect for SEO?",
      answer:
        "A 301 Moved Permanently tells clients and search engines that a URL has permanently moved; link equity and indexing signals are generally consolidated toward the destination over time. A 302 Found (and many temporary implementations) signals that the original URL may return—search engines may keep both URLs in play and may not pass full equity to the target. Use 301 for durable URL changes and 302 when the move is genuinely temporary (campaigns, maintenance, short tests).",
    },
    {
      question: "Why does this tool show timing for each hop?",
      answer:
        "During migrations and CDN cutovers, extra redirect hops add round trips and latency. Per-hop milliseconds help you spot slow edges, geographic variance, or accidental chains before you freeze redirect maps. Timings are measured server-side from request start until response headers arrive, before downloading the full body.",
    },
    {
      question: "Is this the same as the redirect chain checker?",
      answer:
        "Both follow public HTTP(S) URLs safely and list each step. This SEO-focused tool emphasizes redirect class names (301 vs 302 vs 308), migration-friendly reporting, and per-hop duration. The redirect chain checker highlights hop counts and chain health for technical SEO. Use whichever matches your checklist, or cross-check both during a launch.",
    },
    {
      question: "Can I check multiple URLs at once?",
      answer:
        "Yes. Paste one URL per line in the migration list field, or upload a plain text file. We analyze up to eight addresses per batch sequentially so results stay easy to read. For very large inventories, export a sample of critical URLs first, then expand.",
    },
    {
      question: "Do you store the URLs I submit?",
      answer:
        "No. Checks run on the server only to reach public URLs you specify—nothing is logged for marketing or training in this tool. Avoid submitting credentials or internal-only hosts; private IP ranges and disallowed hosts are rejected.",
    },
    {
      question: "What about 307 and 308 redirects?",
      answer:
        "307 Temporary Redirect preserves the original HTTP method (unlike many 302 implementations). 308 Permanent Redirect is the permanent counterpart and also preserves method. They are appropriate for APIs and strict method-sensitive flows; for classic HTML page moves, 301 remains the most common permanent choice.",
    },
    {
      question: "How should I pair this with other SEO tools on this site?",
      answer:
        "After redirects look correct, validate snippets with the meta title and description checker, generate hreflang or schema where needed, and build campaign links with the UTM link builder. For full hop-by-hop debugging, the redirect chain checker and HTTP status code checker are natural companions.",
    },
  ];
