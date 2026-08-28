import Link from "next/link";

const footerLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/90 bg-zinc-50/80 dark:border-zinc-800/90 dark:bg-zinc-950/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 pb-24 pt-10 sm:flex-row sm:px-6 sm:pb-20">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 sm:text-left">
            © {new Date().getFullYear()} Zero Snippet. Free tools for developers
            and marketers.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:justify-start"
            aria-label="Legal and info"
          >
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-zinc-600 underline-offset-4 transition-colors hover:text-foreground hover:underline dark:text-zinc-400 dark:hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center justify-center">
          <a
            href="https://firstlook.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex transition-opacity hover:opacity-80"
          >
            {/* Light mode badge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://firstlook.tools/badge/badge_light.svg"
              alt="Featured on First Look"
              width={160}
              height={44}
              className="h-[44px] w-auto dark:hidden"
            />
            {/* Dark mode badge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://firstlook.tools/badge/badge_dark.svg"
              alt="Featured on First Look"
              width={160}
              height={44}
              className="hidden h-[44px] w-auto dark:block"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
