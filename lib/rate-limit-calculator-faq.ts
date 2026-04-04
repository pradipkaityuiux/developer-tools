export const rateLimitCalculatorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is an API rate limit?",
    answer:
      "An API rate limit caps how many requests a client can make in a window of time—per second, per minute, per hour, or per day. Providers use limits to protect infrastructure, ensure fair use, and offer tiered pricing. When you exceed a limit, the API often returns HTTP 429 Too Many Requests with Retry-After or rate-limit headers.",
  },
  {
    question: "How does this calculator relate RPM to a daily quota?",
    answer:
      "It multiplies your requests-per-minute (RPM) by 1,440 (minutes in a day) to estimate how many calls you would make if you sustained that RPM for a full 24-hour period. It compares that projection to your stated daily quota and shows how long it would take to exhaust the daily budget at your RPM, or confirms you stay under the cap.",
  },
  {
    question: "Why is 1,440 minutes used for a day?",
    answer:
      "A standard calendar day has 24 × 60 = 1,440 minutes. If your provider’s “daily” limit follows a rolling 24-hour window or a fixed UTC day, minute-based pacing still gives a useful planning number. Always confirm whether your vendor counts midnight-to-midnight local time, UTC, or a rolling window.",
  },
  {
    question: "My API documents limits per second, not per minute—can I still use this?",
    answer:
      "Yes. Convert requests per second to RPM by multiplying by 60 (for example, 10 RPS = 600 RPM). If you have both a per-second burst cap and a daily quota, the binding limit is whichever you hit first; this tool focuses on the RPM versus daily relationship.",
  },
  {
    question: "What does “average RPM for daily quota” mean?",
    answer:
      "It is your daily quota divided by 1,440. That is the steady requests-per-minute rate that would consume exactly your daily allowance if traffic were perfectly smooth across the whole day. Real traffic spikes; use this figure as a baseline for schedulers and backoff logic.",
  },
  {
    question: "Does the calculator account for HTTP 429 retries?",
    answer:
      "No. Retry storms can multiply effective call volume. Model retries separately: exponential backoff, jitter, and respecting Retry-After reduce duplicate calls. Pair this tool with your observability stack to compare planned pacing to real request counts.",
  },
  {
    question: "Is my input data sent to a server?",
    answer:
      "No. Numbers are processed in your browser to produce the summary. Use Copy to export a text report locally. Upload only reads a JSON file you choose to load preset values—file contents are not transmitted anywhere by this page.",
  },
  {
    question: "How do I interpret “time until daily budget exhausted”?",
    answer:
      "If sustained RPM would exceed your daily quota, this estimates how many minutes of continuous traffic at that RPM would burn through one full daily allowance from a standing start. It assumes steady rate and does not model bursts, partial days, or multiple keys.",
  },
  {
    question: "Where can I learn about HTTP status codes for throttling?",
    answer:
      "HTTP 429 Too Many Requests signals rate limiting; 503 Service Unavailable can appear under load. This site’s HTTP Status Code Reference explains meanings and typical client behavior. Your provider’s docs remain the source of truth for quotas and headers.",
  },
];
