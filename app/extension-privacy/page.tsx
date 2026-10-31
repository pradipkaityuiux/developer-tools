import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy for ZeroSnippet Extension",
  description:
    "Privacy Policy for ZeroSnippet, a local-first Chrome side panel developer and designer extension.",
};

const permissions = [
  {
    name: "sidePanel",
    scope: "Browser UI",
    justification:
      "Enables the extension interface to render in Chrome's native side panel next to your active webpage.",
  },
  {
    name: "storage",
    scope: "Local Browser Storage",
    justification:
      "Saves your UI configuration (theme preference: dark/light/system, and default category filter) in chrome.storage.local. No personal data or user inputs are saved.",
  },
  {
    name: "scripting",
    scope: "Page Inspection",
    justification:
      'Used solely to inject on-demand inspection overlays when you click "Pick element" in inspect tools (Element Inspector, CSS Inspector, Font Inspector, Dimensions, Selector/XPath tools). Script execution only occurs upon explicit user interaction.',
  },
  {
    name: "activeTab",
    scope: "Active Tab Context",
    justification:
      "Allows temporary interaction with the active tab when you click the extension icon or trigger inspection, without granting ongoing access to your browsing history.",
  },
  {
    name: "Optional Host Permissions (http://*/*, https://*/*)",
    scope: "Per-Origin On-Demand",
    justification: (
      <>
        Not granted by default. When you use tools requiring page analysis (such
        as reading HTTP headers or analyzing page fonts), ZeroSnippet prompts
        you to grant access{" "}
        <em>specifically for the current site origin</em>. You can grant or
        revoke this access at any time in Chrome&apos;s extension settings.
      </>
    ),
  },
];

export default function ExtensionPrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy for ZeroSnippet" className="max-w-4xl">
      <p>
        <strong>Last updated:</strong> October 31, 2026
      </p>

      <p>
        ZeroSnippet (&quot;we&quot;, &quot;our&quot;, or &quot;the extension&quot;)
        is a developer and designer toolkit built for Google Chrome as a side
        panel extension. We believe strongly in user privacy, transparency, and
        data minimization. ZeroSnippet is architected from the ground up as a{" "}
        <strong>local-first extension</strong>: all processing occurs directly
        inside your local web browser.
      </p>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        1. Summary of Key Principles
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>No Personal Data Collected:</strong> We do not collect, log,
          store, or transmit your name, email address, IP address, browsing
          history, or any other personally identifiable information.
        </li>
        <li>
          <strong>No Remote Servers or APIs:</strong> All formatting, decoding,
          conversion, and inspection utilities run locally on your device. We
          do not operate backend servers that receive your inputs.
        </li>
        <li>
          <strong>No Analytics, Tracking, or Telemetry:</strong> There are no
          analytics SDKs (such as Google Analytics or Mixpanel), advertising
          pixels, third-party trackers, or crash reporting services included in
          the extension.
        </li>
        <li>
          <strong>Data Stays in Your Browser:</strong> Any text, JSON, code
          snippets, tokens, or images you paste or upload into ZeroSnippet are
          processed purely in local memory and are discarded when you navigate
          away or close the side panel.
        </li>
      </ul>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        2. Permissions and Why They Are Needed
      </h2>
      <p>
        ZeroSnippet requests only the minimum permissions necessary to function
        as a side panel utility:
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
              <th className="px-4 py-3 font-semibold text-foreground sm:w-1/4">
                Permission
              </th>
              <th className="px-4 py-3 font-semibold text-foreground sm:w-1/4">
                Scope
              </th>
              <th className="px-4 py-3 font-semibold text-foreground sm:w-1/2">
                Justification &amp; Privacy Handling
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {permissions.map((perm) => (
              <tr
                key={perm.name}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40"
              >
                <td className="px-4 py-3 align-top font-medium text-foreground">
                  {perm.name.startsWith("Optional") ? (
                    <span>
                      Optional Host Permissions (
                      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs text-foreground dark:bg-zinc-800">
                        http://*/*
                      </code>
                      ,{" "}
                      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs text-foreground dark:bg-zinc-800">
                        https://*/*
                      </code>
                      )
                    </span>
                  ) : (
                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground dark:bg-zinc-800">
                      {perm.name}
                    </code>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-zinc-600 dark:text-zinc-400">
                  {perm.scope}
                </td>
                <td className="px-4 py-3 align-top text-zinc-700 dark:text-zinc-300">
                  {perm.justification}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        ZeroSnippet <strong>does not</strong> request or use{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          tabs
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          webRequest
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          webNavigation
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          cookies
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          history
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          downloads
        </code>
        ,{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          declarativeNetRequest
        </code>
        , or broad host permissions.
      </p>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        3. How Specific Features Operate
      </h2>
      <ul className="list-disc space-y-3 pl-5">
        <li>
          <strong>
            Inspect Tools (CSS Inspector, Element Inspector, Dimensions, XPath,
            Selector):
          </strong>{" "}
          When you click &quot;Pick element&quot;, a local script runs in the
          active tab to calculate element geometry and computed styles. This
          data is transferred only to the extension&apos;s side panel and is
          never transmitted externally.
        </li>
        <li>
          <strong>HTTP Headers &amp; Response Status:</strong> These tools issue
          a fresh{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            HEAD
          </code>
          /
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            GET
          </code>{" "}
          request using standard browser{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            fetch()
          </code>{" "}
          directly from the extension to the active tab&apos;s URL. Requests
          omit credentials (
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            credentials: &quot;omit&quot;
          </code>
          ), cookies, and authentication headers.
        </li>
        <li>
          <strong>Offline Code, Text, &amp; Design Utilities:</strong> Utilities
          such as JSON Formatter, Base64, Regex Tester, JWT Decoder, Code Diff,
          Case Converter, Color Converter, Gradient Generator, and SVG Optimizer
          execute 100% locally using bundled JavaScript without needing any
          network connection or site access.
        </li>
      </ul>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        4. Local Storage &amp; Data Deletion
      </h2>
      <p>
        The only data persisted by ZeroSnippet is stored locally on your device
        using Chrome&apos;s{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
          chrome.storage.local
        </code>{" "}
        API:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            theme
          </code>
          : Your selected theme (&quot;dark&quot;, &quot;light&quot;, or
          &quot;system&quot;).
        </li>
        <li>
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
            defaultCategory
          </code>
          : Your chosen startup tool category.
        </li>
      </ul>
      <p>
        You can delete all stored data at any time by clicking{" "}
        <strong>&quot;Clear Stored Data&quot;</strong> in the
        extension&apos;s <strong>Settings &gt; About &amp; Privacy</strong>{" "}
        screen, or by uninstalling the extension.
      </p>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        5. Third-Party Services and External Resources
      </h2>
      <p>
        ZeroSnippet does not load remote scripts, remote fonts, or remote
        stylesheets (no external CDNs). All libraries, SVG icons, and stylesheets
        are bundled directly into the local extension package.
      </p>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        6. Changes to This Policy
      </h2>
      <p>
        If we update this policy, any changes will be reflected in this document
        and posted with an updated revision date. Material updates will be
        clearly noted in extension update notes.
      </p>

      <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

      <h2 className="pt-2 text-xl font-semibold text-foreground">
        7. Contact Information
      </h2>
      <p>
        If you have questions, feedback, or concerns regarding this privacy
        policy or the ZeroSnippet extension, please contact:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Developer:</strong> ZeroSnippet Team
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:pradipforofficial@gmail.com"
            className="font-medium text-foreground underline underline-offset-4 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            pradipforofficial@gmail.com
          </a>
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <Link
            href="https://zerosnippet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            https://zerosnippet.com
          </Link>
        </li>
      </ul>
    </LegalPage>
  );
}
