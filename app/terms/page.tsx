import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for the Zero Snippet website and tools.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        <strong>Last updated:</strong> April 4, 2026
      </p>
      <p>
        By accessing or using Zero Snippet (&quot;the Service&quot;), you agree
        to these terms. If you do not agree, do not use the Service.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Use of tools</h2>
      <p>
        The Service is provided for lawful purposes. You are responsible for your
        inputs (text, files, URLs) and for complying with applicable laws and
        third-party terms when you use our tools in your workflows.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        No warranties
      </h2>
      <p>
        Tools are provided &quot;as is&quot; without warranties of any kind. We
        do not guarantee uninterrupted access, error-free results, or fitness
        for a particular purpose. Outputs may require human review before use
        in production or legal contexts.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">
        Limitation of liability
      </h2>
      <p>
        To the maximum extent permitted by law, Zero Snippet and its operators
        are not liable for indirect, incidental, or consequential damages
        arising from your use of the Service.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-foreground">Changes</h2>
      <p>
        We may update these terms or the Service. Continued use after changes
        constitutes acceptance of the updated terms where permitted by law.
      </p>
    </LegalPage>
  );
}
