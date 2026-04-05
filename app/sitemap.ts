import type { MetadataRoute } from "next";
import { allTools } from "@/lib/tool-catalog";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return "http://localhost:3000";
}

const STATIC_PATHS = [
  "/",
  "/about",
  "/privacy-policy",
  "/disclaimer",
  "/cookie-policy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : path === "/about" ? 0.7 : 0.4,
  }));

  const toolEntries: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${base}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...toolEntries];
}
