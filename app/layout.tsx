import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeFloatingToggle } from "@/components/theme-select";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-NV55ED50ZQ";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zero Snippet",
    template: "%s | Zero Snippet",
  },
  description:
    "Free online developer and marketer utilities: code formatters, SEO, security, design, text, and file tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader />
            <div className="flex flex-1 flex-col">
              {children}
              <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
            </div>
          <SiteFooter />
          <ThemeFloatingToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
