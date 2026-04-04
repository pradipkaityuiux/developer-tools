export type CronFields = {
  minute: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
};

const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const DOW: Record<string, string> = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "7": "Sunday",
};

function pad2(n: string): string {
  return n.length >= 2 ? n : `0${n}`;
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatClock(hour: string, minute: string): string {
  const h = Number.parseInt(hour, 10);
  const m = Number.parseInt(minute, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return `${hour}:${minute}`;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${h12}:${pad2(String(m))} ${ampm} (${hour}:${pad2(minute)} 24h)`;
}

function monthLabel(month: string): string {
  const n = Number.parseInt(month, 10);
  if (Number.isFinite(n) && n >= 1 && n <= 12) return MONTHS[n] ?? month;
  return month;
}

function dowPhrase(dow: string): string {
  if (dow === "1-5") return "Monday through Friday";
  if (dow === "*") return "";
  const range = /^(\d)-(\d)$/.exec(dow);
  if (range) {
    const a = DOW[range[1] ?? ""];
    const b = DOW[range[2] ?? ""];
    if (a && b) return `${a} through ${b}`;
  }
  if (dow.includes(",")) {
    const parts = dow.split(",").map((p) => p.trim());
    return parts.map((p) => dowPhrase(p) || p).join(", ");
  }
  return DOW[dow] ?? `day-of-week ${dow}`;
}

export function buildCronString(f: CronFields): string {
  return [f.minute, f.hour, f.dom, f.month, f.dow].join(" ");
}

function isEveryFieldStar(f: CronFields): boolean {
  return (
    f.minute === "*" &&
    f.hour === "*" &&
    f.dom === "*" &&
    f.month === "*" &&
    f.dow === "*"
  );
}

/** Plain-English description for common 5-field cron patterns (Vixie-style). */
export function describeCron(fields: CronFields): string {
  const { minute, hour, dom, month, dow } = fields;

  if (isEveryFieldStar(fields)) {
    return "Runs every minute.";
  }

  if (
    minute.startsWith("*/") &&
    hour === "*" &&
    dom === "*" &&
    month === "*" &&
    dow === "*"
  ) {
    const step = minute.slice(2);
    return `Runs every ${step} minutes.`;
  }

  if (
    hour === "*" &&
    dom === "*" &&
    month === "*" &&
    dow === "*" &&
    minute !== "*" &&
    !minute.includes("/")
  ) {
    return `Runs every hour at minute ${minute} (at :${pad2(minute)} past each hour).`;
  }

  if (
    dom === "*" &&
    month === "*" &&
    dow === "*" &&
    minute !== "*" &&
    hour !== "*" &&
    !minute.includes("/") &&
    !hour.includes("/") &&
    !minute.includes(",") &&
    !hour.includes(",")
  ) {
    return `Runs every day at ${formatClock(hour, minute)}.`;
  }

  if (
    dom === "*" &&
    month === "*" &&
    dow === "1-5" &&
    minute !== "*" &&
    hour !== "*" &&
    !minute.includes("/") &&
    !hour.includes("/")
  ) {
    return `Runs on weekdays (Monday–Friday) at ${formatClock(hour, minute)}.`;
  }

  if (
    dom === "*" &&
    month === "*" &&
    dow !== "*" &&
    minute !== "*" &&
    hour !== "*" &&
    !minute.includes("/") &&
    !hour.includes("/") &&
    !dow.includes(",")
  ) {
    const day = dowPhrase(dow);
    return `Runs every week on ${day} at ${formatClock(hour, minute)}.`;
  }

  if (
    dom !== "*" &&
    month === "*" &&
    dow === "*" &&
    minute !== "*" &&
    hour !== "*" &&
    !dom.includes("/") &&
    !minute.includes("/") &&
    !hour.includes("/")
  ) {
    const n = Number.parseInt(dom, 10);
    const suffix = ordinalSuffix(Number.isFinite(n) ? n : 0);
    return `Runs on the ${dom}${suffix} of every month at ${formatClock(hour, minute)}.`;
  }

  if (
    dom !== "*" &&
    month !== "*" &&
    dow === "*" &&
    minute !== "*" &&
    hour !== "*" &&
    !minute.includes("/") &&
    !hour.includes("/")
  ) {
    return `Runs yearly on ${monthLabel(month)} ${dom} at ${formatClock(hour, minute)}.`;
  }

  return `Schedule (minute hour day-of-month month day-of-week): ${buildCronString(fields)}. Times use the server or scheduler's time zone unless configured otherwise.`;
}

export type CronPreset = { id: string; label: string; fields: CronFields };

export const CRON_PRESETS: CronPreset[] = [
  {
    id: "every-minute",
    label: "Every minute",
    fields: {
      minute: "*",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "every-5",
    label: "Every 5 minutes",
    fields: {
      minute: "*/5",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "every-15",
    label: "Every 15 minutes",
    fields: {
      minute: "*/15",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "every-30",
    label: "Every 30 minutes",
    fields: {
      minute: "*/30",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "hourly",
    label: "Every hour at :00",
    fields: {
      minute: "0",
      hour: "*",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "daily-midnight",
    label: "Daily at midnight",
    fields: {
      minute: "0",
      hour: "0",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "daily-noon",
    label: "Daily at noon",
    fields: {
      minute: "0",
      hour: "12",
      dom: "*",
      month: "*",
      dow: "*",
    },
  },
  {
    id: "weekdays-9",
    label: "Weekdays 9:00 AM",
    fields: {
      minute: "0",
      hour: "9",
      dom: "*",
      month: "*",
      dow: "1-5",
    },
  },
  {
    id: "weekly-sun",
    label: "Weekly — Sunday 00:00",
    fields: {
      minute: "0",
      hour: "0",
      dom: "*",
      month: "*",
      dow: "0",
    },
  },
  {
    id: "monthly-1",
    label: "Monthly — 1st at 00:00",
    fields: {
      minute: "0",
      hour: "0",
      dom: "1",
      month: "*",
      dow: "*",
    },
  },
];
