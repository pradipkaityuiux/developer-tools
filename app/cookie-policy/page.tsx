import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Zero Snippet uses cookies and similar storage.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        <strong>Last updated:</strong> April 4, 2026
      </p>
      <p>
        This policy describes how Zero Snippet may use cookies and similar
        technologies (such as local storage) when you visit our site.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        What we use storage for
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Preferences:</strong> for example, remembering your selected
          color theme (light, dark, or system).
        </li>
        <li>
          <strong>Essential functionality:</strong> keeping the site usable and
          consistent across pages.
        </li>
      </ul>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Your choices</h2>
      <p>
        You can clear site data from your browser settings at any time. Blocking
        all cookies may affect how preferences are saved.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Updates</h2>
      <p>
        We may update this policy when our practices change. The date at the top
        reflects the latest revision.
      </p>
    </LegalPage>
  );
}
