import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Zero Snippet handles information when you use our free online tools.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        <strong>Last updated:</strong> April 4, 2026
      </p>
      <p>
        Zero Snippet (&quot;we&quot;, &quot;us&quot;) provides browser-based tools
        that run primarily on your device. This policy explains what we may
        collect and how we use it.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        Information you provide
      </h2>
      <p>
        Most tools process text, files, or URLs locally in your browser and do
        not require an account. If you contact us, we receive only what you send
        in that message.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        Technical data
      </h2>
      <p>
        Like many sites, our hosting and analytics providers may log standard
        server data such as approximate location, browser type, and pages
        visited. We use this to operate and improve the service.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Cookies</h2>
      <p>
        We may use cookies or local storage for preferences (such as theme) and
        for essential site functionality.         See our{" "}
        <Link
          href="/cookie-policy"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Cookie Policy
        </Link>{" "}
        for details.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Contact</h2>
      <p>
        For privacy questions, use the contact options listed on the site if
        provided, or reach out through your normal support channel.
      </p>
    </LegalPage>
  );
}
