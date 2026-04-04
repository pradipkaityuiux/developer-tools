export type HttpStatusCategory =
  | "informational"
  | "success"
  | "redirection"
  | "client-error"
  | "server-error";

export type HttpStatusEntry = {
  code: number;
  phrase: string;
  category: HttpStatusCategory;
  /** Plain-English meaning for developers and SEO readers */
  summary: string;
  /** Typical triggers (logs, misconfig, client mistakes) */
  typicalCauses: string;
  /** Practical remediation or next debugging step */
  whatToDo: string;
};

/** Comprehensive HTTP status reference aligned with IANA / RFC semantics (commonly used codes). */
export const httpStatusCodes: HttpStatusEntry[] = [
  {
    code: 100,
    phrase: "Continue",
    category: "informational",
    summary:
      "The server received the request headers and is ready for the client to send the request body.",
    typicalCauses:
      "Expect: 100-continue handshakes on large uploads; some proxies or APIs require an initial header round-trip.",
    whatToDo:
      "If you did not intend chunked or expect-continue behavior, remove Expect headers or align with your API contract. Most browser page loads never surface 100 in DevTools as a final status.",
  },
  {
    code: 101,
    phrase: "Switching Protocols",
    category: "informational",
    summary:
      "The server agrees to change protocols—most often HTTP to WebSocket after a valid upgrade request.",
    typicalCauses:
      "WebSocket upgrade, HTTP/2 upgrade negotiation, or custom protocol switches on the same connection.",
    whatToDo:
      "Verify Sec-WebSocket-* headers and TLS termination. If upgrades fail intermittently, inspect reverse proxies and load balancers for idle timeouts or missing upgrade passthrough.",
  },
  {
    code: 102,
    phrase: "Processing",
    category: "informational",
    summary:
      "A provisional response meaning the server is still working on a long-running request (WebDAV-related usage; rare in general APIs).",
    typicalCauses:
      "Legacy WebDAV or custom servers that stream interim progress before a final 2xx/4xx/5xx.",
    whatToDo:
      "Wait for the final response. If your client hangs, confirm server-side job completion paths and proxy read timeouts.",
  },
  {
    code: 103,
    phrase: "Early Hints",
    category: "informational",
    summary:
      "The server may send resource hints (for example Link preload/prefetch) before the full response is ready.",
    typicalCauses:
      "Optimizing critical path loading with HTTP/2 or HTTP/3 early hints from CDNs and modern frameworks.",
    whatToDo:
      "Validate that hinted URLs are correct and cacheable. Combine with strong cache headers on static assets.",
  },
  {
    code: 200,
    phrase: "OK",
    category: "success",
    summary:
      "The request succeeded. For GET, the representation is returned; for HEAD, headers only—this is the baseline success code for most pages and APIs.",
    typicalCauses:
      "Healthy origin, correct route, authorized access, and matching HTTP method—normal production behavior.",
    whatToDo:
      "Pair 200 with correct caching (Cache-Control), canonical tags for HTML, and consistent Content-Type for APIs. Use our HTTP header checker when headers matter as much as the body.",
  },
  {
    code: 201,
    phrase: "Created",
    category: "success",
    summary:
      "A new resource was created as a result of the request—common for POST that inserts rows or objects.",
    typicalCauses:
      "REST POST to /users, /orders, or similar collection endpoints that persist data and return a Location.",
    whatToDo:
      "Return a Location header or stable id in the body; ensure idempotency keys for safe retries on flaky networks.",
  },
  {
    code: 202,
    phrase: "Accepted",
    category: "success",
    summary:
      "The request was accepted for processing but processing is not finished—typical for async jobs and queues.",
    typicalCauses:
      "Background workers, batch imports, or webhook receivers that enqueue work instead of completing inline.",
    whatToDo:
      "Expose job ids and polling or callback URLs; document SLA and failure modes so clients do not treat 202 as guaranteed completion.",
  },
  {
    code: 204,
    phrase: "No Content",
    category: "success",
    summary:
      "Success with no response body—often used for DELETE or PUT where the client already knows the outcome.",
    typicalCauses:
      "Idempotent deletes, toggle endpoints, or cache invalidations that do not need a payload back.",
    whatToDo:
      "Confirm clients handle empty bodies. Avoid returning 204 where clients expect JSON error details on failure.",
  },
  {
    code: 203,
    phrase: "Non-Authoritative Information",
    category: "success",
    summary:
      "Success response assembled from a secondary source—often seen with transforming proxies or cached third-party content.",
    typicalCauses:
      "Intermediaries returning a copy while noting it may not be the authoritative origin response.",
    whatToDo:
      "Treat payload as potentially stale; bypass or disable transformation when strict consistency matters.",
  },
  {
    code: 205,
    phrase: "Reset Content",
    category: "success",
    summary:
      "Tells the client to reset the document view—rare on the modern web; more common in legacy form UIs.",
    typicalCauses:
      "Custom servers clearing client-side form state after successful submission.",
    whatToDo:
      "If you see 205 unexpectedly, verify framework middleware and proxy rules are not mislabeling responses.",
  },
  {
    code: 206,
    phrase: "Partial Content",
    category: "success",
    summary:
      "The server fulfilled a range request—used for video/audio streaming and resumable downloads.",
    typicalCauses:
      "Range: bytes=... on large files; CDN edge slicing; download managers requesting chunks.",
    whatToDo:
      "Ensure Accept-Ranges and correct Content-Range. Misconfigured ranges cause players to stutter or corrupt data.",
  },
  {
    code: 207,
    phrase: "Multi-Status",
    category: "success",
    summary:
      "WebDAV-style mixed outcome: sub-requests succeeded or failed independently inside one response body.",
    typicalCauses:
      "Batch PROPFIND or COPY operations reporting per-resource status in XML/JSON payloads.",
    whatToDo:
      "Parse the multistatus body; do not assume overall success from the top-level 207 alone.",
  },
  {
    code: 300,
    phrase: "Multiple Choices",
    category: "redirection",
    summary:
      "More than one representation exists—client should choose (for example language or format variants).",
    typicalCauses:
      "Content negotiation endpoints, duplicate filenames, or legacy mirrors exposing multiple URLs.",
    whatToDo:
      "Prefer canonical URLs and explicit redirects (301/308) for SEO; avoid ambiguous 300 chains.",
  },
  {
    code: 301,
    phrase: "Moved Permanently",
    category: "redirection",
    summary:
      "The resource has a new permanent URI; future requests should use the target in the Location header.",
    typicalCauses:
      "Domain migrations, slug changes, HTTP→HTTPS at the edge, or consolidating duplicate URLs for SEO.",
    whatToDo:
      "Update internal links and sitemaps to the final URL; monitor Search Console and redirect chains. Compare with our redirect checker and response code checker for live URLs.",
  },
  {
    code: 302,
    phrase: "Found",
    category: "redirection",
    summary:
      "Temporary redirect—HTTP/1.0 semantics historically blurred with 303/307; many stacks treat it as temporary.",
    typicalCauses:
      "Legacy apps, framework defaults, or short campaigns where the original URL may return later.",
    whatToDo:
      "Prefer 307/308 when you need method-preserving or permanent semantics explicitly. Fix long 302 chains that slow crawlers.",
  },
  {
    code: 303,
    phrase: "See Other",
    category: "redirection",
    summary:
      "Redirect the client to a different URI with GET—common after POST to avoid duplicate form submissions.",
    typicalCauses:
      "Post/Redirect/Get pattern for web forms and checkout flows.",
    whatToDo:
      "Ensure the follow-up GET URL is cache-safe and does not re-trigger destructive actions.",
  },
  {
    code: 304,
    phrase: "Not Modified",
    category: "redirection",
    summary:
      "Conditional GET: the cached copy is still valid; no body is sent when If-None-Match/If-Modified-Since match.",
    typicalCauses:
      "ETag validators, last-modified checks, and CDN revalidation saving bandwidth.",
    whatToDo:
      "Verify ETag generation changes when content changes; broken validators cause stale or excessive 200s.",
  },
  {
    code: 305,
    phrase: "Use Proxy",
    category: "redirection",
    summary:
      "Deprecated in HTTP/1.1—historically meant “repeat via the proxy named in Location.” Modern stacks should not emit it.",
    typicalCauses:
      "Legacy corporate proxies or ancient middleware still in rare environments.",
    whatToDo:
      "Migrate clients to explicit HTTPS CONNECT or transparent proxies; treat unexpected 305 as a configuration smell.",
  },
  {
    code: 307,
    phrase: "Temporary Redirect",
    category: "redirection",
    summary:
      "Temporary redirect that preserves the original HTTP method and body—clearer than historic 302 behavior.",
    typicalCauses:
      "Maintenance pages, canary routing, or short-lived alternate hosts.",
    whatToDo:
      "Confirm clients resend POST bodies as required. Move to 301/308 when the move is permanent.",
  },
  {
    code: 308,
    phrase: "Permanent Redirect",
    category: "redirection",
    summary:
      "Permanent redirect with method and body preserved—strong signal for SEO and API clients alike.",
    typicalCauses:
      "HTTPS everywhere, canonical host enforcement, and API base URL migrations.",
    whatToDo:
      "Update bookmarks, SDKs, and SDK default base URLs; audit for redirect loops at the load balancer.",
  },
  {
    code: 400,
    phrase: "Bad Request",
    category: "client-error",
    summary:
      "The server cannot process the request due to malformed syntax, invalid JSON, or inconsistent parameters.",
    typicalCauses:
      "Broken JSON bodies, wrong query encoding, invalid UTF-8, or missing required fields in APIs.",
    whatToDo:
      "Validate payloads with our JSON formatter; log request ids. Return structured errors so clients can fix input.",
  },
  {
    code: 401,
    phrase: "Unauthorized",
    category: "client-error",
    summary:
      "Authentication is required or failed—often paired with WWW-Authenticate for bearer or basic flows.",
    typicalCauses:
      "Missing Authorization header, expired JWT, wrong API key, or clock skew on token validation.",
    whatToDo:
      "Refresh tokens, sync system time, and confirm audience/issuer claims. Distinguish from 403 after auth succeeds.",
  },
  {
    code: 402,
    phrase: "Payment Required",
    category: "client-error",
    summary:
      "Reserved for future digital payment schemes; not standardized for general billing flows today.",
    typicalCauses:
      "Rare experimental APIs; some platforms repurpose it informally for paid tiers—non-interoperable.",
    whatToDo:
      "Prefer 402 only if your contract documents it; otherwise use 403 and explicit subscription errors in the body.",
  },
  {
    code: 403,
    phrase: "Forbidden",
    category: "client-error",
    summary:
      "The server understood the request but refuses it—authorization or policy blocks even if credentials were supplied.",
    typicalCauses:
      "RBAC denials, IP allowlists, WAF rules, missing scopes, or directory listing blocked.",
    whatToDo:
      "Check IAM, CDN firewall events, and application logs. Align automated probes with what legitimate users experience.",
  },
  {
    code: 404,
    phrase: "Not Found",
    category: "client-error",
    summary:
      "No resource matches the URI—classic broken link, typo, or removed content.",
    typicalCauses:
      "Stale bookmarks, bad deploys, renamed routes, or CMS slug changes without redirects.",
    whatToDo:
      "Restore content, add 301/308 to the successor page, or return 410 when intentionally retired. Fix inbound links and sitemap entries.",
  },
  {
    code: 405,
    phrase: "Method Not Allowed",
    category: "client-error",
    summary:
      "The resource exists but does not support the HTTP verb used—Allow header lists valid methods.",
    typicalCauses:
      "DELETE on a read-only route, POST to a static file path, or misconfigured API gateway verbs.",
    whatToDo:
      "Correct the client method or expand route handlers. Document allowed verbs in OpenAPI specs.",
  },
  {
    code: 406,
    phrase: "Not Acceptable",
    category: "client-error",
    summary:
      "The server cannot produce a representation matching the Accept headers (language, encoding, or format).",
    typicalCauses:
      "Accept: application/xml only while the API returns JSON, or overly strict content negotiation.",
    whatToDo:
      "Widen Accept headers on the client or implement proper content-type negotiation on the server.",
  },
  {
    code: 407,
    phrase: "Proxy Authentication Required",
    category: "client-error",
    summary:
      "The client must authenticate with a proxy before the request can reach the origin.",
    typicalCauses:
      "Corporate HTTP proxies, captive portals, or misconfigured forward proxies in CI.",
    whatToDo:
      "Supply proxy credentials or route traffic through an approved network path; never embed secrets in logs.",
  },
  {
    code: 408,
    phrase: "Request Timeout",
    category: "client-error",
    summary:
      "The server gave up waiting for the full request—often idle connections or slow uploads.",
    typicalCauses:
      "Huge payloads without chunked transfer, client stalls, or aggressive server idle timeouts.",
    whatToDo:
      "Retry with backoff, tune keep-alive, or increase upload limits/timeouts at reverse proxies.",
  },
  {
    code: 409,
    phrase: "Conflict",
    category: "client-error",
    summary:
      "The request conflicts with the current state—version collisions, duplicate unique keys, or optimistic locking failures.",
    typicalCauses:
      "Concurrent edits, duplicate email signups, or workflow states that reject the transition.",
    whatToDo:
      "Return details on the conflict; consider ETags or sequence numbers for concurrency control.",
  },
  {
    code: 410,
    phrase: "Gone",
    category: "client-error",
    summary:
      "The resource existed but was permanently removed and will not return—stronger than 404 for intentional retirement.",
    typicalCauses:
      "Delisted products, deprecated API versions, or legal takedowns with no replacement.",
    whatToDo:
      "Remove links from navigation and sitemaps; communicate migrations to users and search engines clearly.",
  },
  {
    code: 412,
    phrase: "Precondition Failed",
    category: "client-error",
    summary:
      "A precondition header (such as If-Match) evaluated to false—common in versioning and WebDAV.",
    typicalCauses:
      "Stale ETag on PATCH, or conditional writes when state changed underneath the client.",
    whatToDo:
      "Refetch the latest representation, merge changes, and retry with updated validators.",
  },
  {
    code: 413,
    phrase: "Payload Too Large",
    category: "client-error",
    summary:
      "The request body exceeds limits configured on the server, gateway, or WAF.",
    typicalCauses:
      "Oversized uploads, uncompressed images, or default nginx/client_max_body_size ceilings.",
    whatToDo:
      "Chunk uploads, raise limits deliberately, or use direct-to-object-storage signed URLs.",
  },
  {
    code: 414,
    phrase: "URI Too Long",
    category: "client-error",
    summary:
      "The request-target exceeds server or proxy limits—often from huge query strings or misplaced POST data.",
    typicalCauses:
      "GET with thousands of filter params, or accidental serialization of blobs into the URL.",
    whatToDo:
      "Move data to POST bodies, shorten keys, or use server-side session storage for complex filters.",
  },
  {
    code: 415,
    phrase: "Unsupported Media Type",
    category: "client-error",
    summary:
      "The Content-Type or encoding is not supported for this endpoint.",
    typicalCauses:
      "Sending text/plain where application/json is required, or missing charset boundaries.",
    whatToDo:
      "Set Content-Type explicitly; verify multipart boundaries for file uploads.",
  },
  {
    code: 416,
    phrase: "Range Not Satisfiable",
    category: "client-error",
    summary:
      "The requested byte range is invalid or outside the file size—often after file length changes.",
    typicalCauses:
      "Outdated range metadata in download managers or streaming clients after content updates.",
    whatToDo:
      "Issue a new range request after HEAD or 200 to learn current Content-Length.",
  },
  {
    code: 417,
    phrase: "Expectation Failed",
    category: "client-error",
    summary:
      "The Expect header could not be satisfied by the server—often with Expect: 100-continue edge cases.",
    typicalCauses:
      "Proxies stripping or mishandling Expect, or servers rejecting large body preconditions.",
    whatToDo:
      "Remove Expect when possible or align proxy buffering with upload requirements.",
  },
  {
    code: 418,
    phrase: "I'm a teapot",
    category: "client-error",
    summary:
      "Easter egg from RFC 2324 (Hyper Text Coffee Pot Control Protocol); sometimes used humorously in tests.",
    typicalCauses:
      "Framework demos, integration tests, or misconfigured routes returning jokes.",
    whatToDo:
      "Do not rely on 418 in production APIs; use meaningful 4xx codes for real errors.",
  },
  {
    code: 421,
    phrase: "Misdirected Request",
    category: "client-error",
    summary:
      "The request was directed at a server that cannot produce a response for this scheme and authority.",
    typicalCauses:
      "HTTP/2 connection reuse across hosts with TLS SNI mismatches or misrouted multiplexed streams.",
    whatToDo:
      "Fix connection coalescing settings and ensure clients connect to the correct host for each authority.",
  },
  {
    code: 423,
    phrase: "Locked",
    category: "client-error",
    summary:
      "The resource is locked—WebDAV semantics preventing concurrent edits until unlocked.",
    typicalCauses:
      "Checked-out documents, admin locks, or migration holds on resources.",
    whatToDo:
      "Use UNLOCK where appropriate or surface lock ownership to users.",
  },
  {
    code: 424,
    phrase: "Failed Dependency",
    category: "client-error",
    summary:
      "A WebDAV method failed because a prior dependent action failed.",
    typicalCauses:
      "Chained operations such as MOVE depending on COPY success.",
    whatToDo:
      "Inspect earlier error bodies in the multistatus response to fix root causes.",
  },
  {
    code: 426,
    phrase: "Upgrade Required",
    category: "client-error",
    summary:
      "The server refuses the request until the client upgrades to a different protocol—often TLS or WebSocket.",
    typicalCauses:
      "HSTS-like upgrades, mandatory HTTP/2, or insecure plain HTTP blocked on sensitive routes.",
    whatToDo:
      "Switch client libraries to HTTPS or HTTP/2 as required; update Upgrade headers.",
  },
  {
    code: 428,
    phrase: "Precondition Required",
    category: "client-error",
    summary:
      "The origin requires conditional requests to prevent lost updates—often paired with replay protection.",
    typicalCauses:
      "High-contention resources where If-Match headers are mandatory for write safety.",
    whatToDo:
      "Send validators from GET responses before mutating writes.",
  },
  {
    code: 431,
    phrase: "Request Header Fields Too Large",
    category: "client-error",
    summary:
      "Headers exceed server limits—often cookie bloat or oversized bearer tokens.",
    typicalCauses:
      "Thousands of cookies, duplicated headers, or debug headers accidentally shipped to prod.",
    whatToDo:
      "Trim cookies, split state server-side, and raise limits only after profiling abuse risk.",
  },
  {
    code: 422,
    phrase: "Unprocessable Entity",
    category: "client-error",
    summary:
      "Well-formed JSON/XML but semantically invalid—validation errors on business rules or schema.",
    typicalCauses:
      "Schema passes syntax but fails rules: out-of-range numbers, unknown enums, or cross-field constraints.",
    whatToDo:
      "Return field-level errors; pair with OpenAPI examples so clients correct payloads quickly.",
  },
  {
    code: 429,
    phrase: "Too Many Requests",
    category: "client-error",
    summary:
      "Rate limiting—protecting APIs from abuse or fairness across tenants.",
    typicalCauses:
      "Bursty retries without backoff, scraping, or shared egress IPs hitting shared quotas.",
    whatToDo:
      "Honor Retry-After, exponential backoff, and jitter. Request higher quotas with justified traffic patterns.",
  },
  {
    code: 451,
    phrase: "Unavailable For Legal Reasons",
    category: "client-error",
    summary:
      "Access is denied because of a legal demand—often geographic blocking or court-ordered removal.",
    typicalCauses:
      "GDPR-related blocking, copyright takedowns, or government censorship lists enforced at CDN edge.",
    whatToDo:
      "Consult legal and compliance teams; do not bypass geo rules without counsel. Document alternate lawful access paths.",
  },
  {
    code: 500,
    phrase: "Internal Server Error",
    category: "server-error",
    summary:
      "An unexpected error occurred on the server—generic catch-all for uncaught exceptions.",
    typicalCauses:
      "Null pointers, misconfigured env vars, deadlocks, or dependency outages surfaced as 500.",
    whatToDo:
      "Check application and infrastructure logs, error tracking (Sentry, etc.), and recent deploys. Add health checks upstream.",
  },
  {
    code: 501,
    phrase: "Not Implemented",
    category: "server-error",
    summary:
      "The server does not support the functionality required to fulfill the request.",
    typicalCauses:
      "Exotic HTTP methods, unimplemented protocol features, or placeholder handlers.",
    whatToDo:
      "Implement the feature or block the method at the gateway with a clear 405/404 instead.",
  },
  {
    code: 502,
    phrase: "Bad Gateway",
    category: "server-error",
    summary:
      "A proxy or gateway received an invalid response from an upstream server.",
    typicalCauses:
      "Origin crash, TLS handshake failure to upstream, or DNS flapping behind the load balancer.",
    whatToDo:
      "Trace upstream health, connection pools, and keep-alive settings between gateway and app servers.",
  },
  {
    code: 503,
    phrase: "Service Unavailable",
    category: "server-error",
    summary:
      "The server is temporarily unable to handle traffic—maintenance, overload, or dependency outage.",
    typicalCauses:
      "Deploy freezes, database failover, or intentional circuit breaking during incidents.",
    whatToDo:
      "Return Retry-After when possible; scale capacity; use graceful degradation pages for humans.",
  },
  {
    code: 504,
    phrase: "Gateway Timeout",
    category: "server-error",
    summary:
      "A proxy did not receive a timely response from the upstream—distinct from slow client uploads (408).",
    typicalCauses:
      "Long database queries, cold starts, or upstream saturation hitting proxy read timeouts.",
    whatToDo:
      "Optimize hot paths, add caching, increase timeouts only where safe, and parallelize independent calls.",
  },
  {
    code: 505,
    phrase: "HTTP Version Not Supported",
    category: "server-error",
    summary:
      "The server does not support—or refuses to support—the major HTTP version used in the request.",
    typicalCauses:
      "HTTP/3-only edges rejecting HTTP/1.1, or legacy stacks that cannot parse newer framing.",
    whatToDo:
      "Align client and server on supported protocol versions; update libraries and TLS stacks.",
  },
  {
    code: 507,
    phrase: "Insufficient Storage",
    category: "server-error",
    summary:
      "WebDAV: the method could not complete because the server is out of storage for the representation.",
    typicalCauses:
      "Disk full on NAS, quota exceeded on object storage, or database tablespace limits.",
    whatToDo:
      "Expand capacity, purge old data, and alert before exhaustion triggers user-facing failures.",
  },
  {
    code: 511,
    phrase: "Network Authentication Required",
    category: "server-error",
    summary:
      "The client must authenticate to gain network access—common with captive portals and hotspot logins.",
    typicalCauses:
      "Wi‑Fi splash pages intercepting HTTP before Internet access is granted.",
    whatToDo:
      "Complete portal authentication or use VPN; automated clients should detect captive portals explicitly.",
  },
];

export function categoryLabel(c: HttpStatusCategory): string {
  switch (c) {
    case "informational":
      return "1xx Informational";
    case "success":
      return "2xx Success";
    case "redirection":
      return "3xx Redirection";
    case "client-error":
      return "4xx Client error";
    case "server-error":
      return "5xx Server error";
    default:
      return c;
  }
}

export function matchesSearch(entry: HttpStatusEntry, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const blob = [
    String(entry.code),
    entry.phrase,
    entry.summary,
    entry.typicalCauses,
    entry.whatToDo,
    categoryLabel(entry.category),
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes(s);
}
