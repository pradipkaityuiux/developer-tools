import type { MetadataRoute } from "next";
import { allTools } from "@/lib/tool-catalog";
import { getPublishedPosts } from "@/lib/blog";

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
  "/blog",
  "/about",
  "/privacy-policy",
  "/disclaimer",
  "/cookie-policy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOrigin();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority:
      path === "/" ? 1 : path === "/about" ? 0.7 : path === "/blog" ? 0.8 : 0.4,
  }));

  const toolEntries: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: `${base}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const posts = await getPublishedPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}${post.url}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries];
}
