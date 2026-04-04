import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important limitations on Zero Snippet tools and content.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>
        <strong>Last updated:</strong> April 4, 2026
      </p>
      <p>
        The information and tools on Zero Snippet are for general assistance
        only. Nothing on this site constitutes professional legal, financial,
        security, or medical advice.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Tools</h2>
      <p>
        Calculators, formatters, checkers, and converters may contain errors or
        may not cover every edge case. Verify critical results independently
        before relying on them for compliance, security, contracts, or safety.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        Third-party sites
      </h2>
      <p>
        Tools that fetch URLs or reference external resources do not imply
        endorsement. We are not responsible for third-party content, APIs, or
        availability.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">No guarantee</h2>
      <p>
        We aim for accuracy and uptime but do not warrant that the Service will
        be error-free or available at all times.
      </p>
    </LegalPage>
  );
}
