export const unixTimestampFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a Unix timestamp?",
    answer:
      "A Unix timestamp counts time from the Unix epoch: midnight UTC on 1 January 1970. It is usually stored as whole seconds (ten digits through the year 2286) or as milliseconds since the same instant (thirteen digits). APIs, databases, and log lines often emit one of these forms.",
  },
  {
    question: "How do I know if my value is in seconds or milliseconds?",
    answer:
      "Seconds are typically ten digits (or fewer for dates before 2001). Millisecond values are usually thirteen digits. If you are unsure, use the Auto mode on this page, or compare against a known date: milliseconds are one thousand times larger than seconds for the same instant.",
  },
  {
    question: "Does this tool send my timestamps to a server?",
    answer:
      "No. Parsing and formatting run entirely in your browser with JavaScript’s Date APIs. Nothing you type is uploaded unless you copy it elsewhere yourself.",
  },
  {
    question: "Why does my local time differ from UTC?",
    answer:
      "UTC is a fixed reference; your local clock follows your operating system time zone and daylight saving rules. This converter shows both so you can line up log entries (often UTC) with what you see on your machine.",
  },
  {
    question: "Can I convert human-readable dates back to Unix time?",
    answer:
      "Yes. Use the date and time picker for your local zone, or paste an ISO 8601 string (for example with a Z suffix for UTC). The tool outputs both seconds and milliseconds since the epoch.",
  },
  {
    question: "What about timestamps before 1970 or very large values?",
    answer:
      "JavaScript Date supports negative values for instants before 1970-01-01 UTC and large positive values within its internal range. If a number is out of range, the tool will show an error instead of a misleading date.",
  },
  {
    question: "How is this related to JWT or API debugging?",
    answer:
      "JSON Web Tokens and many OAuth responses carry numeric exp, iat, or nbf claims as Unix seconds. After converting here, you can paste tokens into the site’s JWT decoder or compare with cron schedules from the cron tools in the developer catalog.",
  },
];
