import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { totalToolCount } from "@/lib/tool-catalog";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "What Zero Snippet is: free developer and marketer tools in one place.",
};

export default function AboutPage() {
  return (
    <LegalPage title="About Us">
      <p>
        Zero Snippet is a collection of {totalToolCount}+ free, browser-friendly
        utilities for people who build and ship on the web—developers,
        marketers, and content teams.
      </p>
      <p>
        Tools are grouped by job: code and data formatting, SEO and website
        checks, security helpers, design utilities, text processing, file
        conversions, and more. Each page is focused so you can get in, do the
        task, and move on.
      </p>
      <p>
        We prioritize clarity, speed, and running as much as possible on your
        device so your inputs stay under your control whenever the tool allows
        it.
      </p>
      <p>
        <Link
          href="/"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Browse all tools
        </Link>{" "}
        from the home page.
      </p>
    </LegalPage>
  );
}
