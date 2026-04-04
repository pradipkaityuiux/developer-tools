export const cronExplainerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a cron expression?",
    answer:
      "A cron expression is a compact schedule string used by Unix-style schedulers (cron, systemd timers, Kubernetes CronJob, cloud functions, and CI cron). The common five-field form is: minute, hour, day-of-month, month, and day-of-week, separated by spaces.",
  },
  {
    question: "What does this cron explainer do?",
    answer:
      "Paste a five-field cron string to see a plain-English breakdown of each part, any important warnings (such as the day-of-month vs day-of-week OR rule), and the next several run times calculated in your browser using your local clock.",
  },
  {
    question: "Is my cron expression sent to a server?",
    answer:
      "No. Parsing and next-run calculation run entirely in your browser with JavaScript. Nothing is uploaded unless you use another page that explicitly makes network requests.",
  },
  {
    question: "Why do day-of-month and day-of-week both matter?",
    answer:
      "In Vixie-style cron, when both day-of-month and day-of-week are restricted (not *), the job runs if either field matches—not only when both match. For example, 30 4 1,15 * 5 runs at 4:30 AM on the 1st and 15th of each month and also every Friday. This tool surfaces that behavior so you are not surprised in production.",
  },
  {
    question: "Does this support seconds, years, or Quartz extensions?",
    answer:
      "This page focuses on the standard five-field Unix cron. Six-field schedules with seconds, the question-mark (?) placeholder from Quartz, L/W/# modifiers, and @yearly-style aliases are not parsed here—use your platform’s documentation for those variants.",
  },
  {
    question: "Can I use month or weekday names?",
    answer:
      "Yes. Month abbreviations JAN through DEC are accepted in the month field. Day-of-week accepts SUN through SAT (Sunday is 0 or 7 in many crons; this tool normalizes Sunday consistently for matching and explanations).",
  },
  {
    question: "Which timezone are the “next runs” in?",
    answer:
      "Next run times use your browser’s local timezone, same as JavaScript Date. Cron on a server uses the server’s timezone unless configured otherwise—always confirm TZ in production.",
  },
  {
    question: "How is this different from a cron builder or generator?",
    answer:
      "An explainer starts from an existing string (for example from crontab -l, GitHub Actions, or a Terraform schedule) and translates it. A generator or UI builder helps you compose a new expression from dropdowns. Use both when you inherit schedules or audit automation—see also our developer tools index for formatters and testers you can pair with pipeline YAML.",
  },
];
