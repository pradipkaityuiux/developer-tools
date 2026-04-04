export const cronGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a cron expression?",
    answer:
      "A cron expression is a compact string that tells a scheduler when to run a job. The classic Unix crontab format uses five fields: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–6, where 0 is Sunday). Special characters include * (any), lists (1,3,5), ranges (1-5), and steps (*/15). Some platforms add a seconds field or different Sunday numbering—always check your host's documentation.",
  },
  {
    question: "What order are the five cron fields?",
    answer:
      "Standard order is: minute, hour, day of month, month, day of week. A mnemonic is \"minute and hour first, then which day in the month, which month, and which weekday.\" The string this generator outputs follows that order, which matches Linux crontab, many PaaS schedulers, and libraries like node-cron when configured for five fields.",
  },
  {
    question: "Does this cron generator run jobs for me?",
    answer:
      "No. It only builds and explains the expression. You still paste the result into your environment: crontab -e on a server, Kubernetes CronJob spec, GitHub Actions schedule, AWS EventBridge rule, or your framework's scheduler config. Execution time zone and field support are defined by that system, not by this page.",
  },
  {
    question: "Why does my job run at the wrong local time?",
    answer:
      "Cron is usually interpreted in one fixed time zone: often the server's UTC offset, or explicitly UTC in the cloud. Daylight saving changes can shift apparent local times. Set the scheduler or container to the zone you intend, or express schedules in UTC. Our descriptions show clock times for clarity but do not know your production zone.",
  },
  {
    question: "What is the difference between day of month and day of week?",
    answer:
      "Both restrict which days a job may run. In classic cron, if both are set (neither is *), behavior depends on the implementation: many systems run when either condition matches (OR), not both. To avoid surprises, leave one field * when you mean \"only weekdays\" or \"only the 15th.\" This generator is clearest when one of dom or dow is *.",
  },
  {
    question: "How do I schedule every N minutes?",
    answer:
      "Use a step in the minute field, e.g. */5 for every five minutes or */15 for quarter-hourly. That pattern does not pin a wall-clock anchor; it runs from whenever the scheduler evaluates the expression. For aligned times (e.g. exactly :00, :15, :30), some platforms offer different syntax or fixed-rate APIs—check your provider.",
  },
  {
    question: "Is Sunday 0 or 7 in cron?",
    answer:
      "In Vixie cron and Linux crontab, 0 and often 7 both mean Sunday. This generator uses 0 for Sunday. If your platform maps weekdays differently, translate accordingly. AWS and some tools document their own tables—verify before production.",
  },
  {
    question: "Are my schedule choices sent to a server?",
    answer:
      "No. The generator runs entirely in your browser: fields combine into a string and the description is computed locally. Nothing is uploaded. You should still avoid pasting secrets into any website out of habit.",
  },
  {
    question: "Where can I decode an existing cron string?",
    answer:
      "Use a dedicated explainer tool that parses arbitrary expressions and lists next run times. This site offers a Cron Expression Explainer at /dev/cron-explainer for pasted strings; this page is optimized for building new schedules from presets and dropdowns.",
  },
];
