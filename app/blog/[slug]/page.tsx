// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";

interface Props {
  params: Promise<{ slug: string }>;
}

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return "http://localhost:3000";
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const base = siteOrigin();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${base}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { content: MDXContent } = await compileMDX({
    source: post.content,
    components: {
      BlogCard,
    },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const base = siteOrigin();

  // Article schema for Google rich results
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Zero Snippet",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "Zero Snippet",
      url: base,
    },
    url: `${base}/blog/${slug}`,
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Article schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-12 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        {/* Header */}
        <div className="mb-10">
          {post.tags && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div
          className="prose prose-zinc max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-xl
            prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-lg
            prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400
            prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-blue-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800 dark:prose-code:text-blue-300
            prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-50 prose-pre:text-zinc-800 dark:prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-900 dark:prose-pre:text-zinc-200
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:rounded-none dark:[&_pre_code]:bg-transparent dark:[&_pre_code]:text-inherit
            prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800
            prose-table:text-sm"
        >
          {MDXContent}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900/60 dark:bg-blue-950/30">
          <p className="font-medium text-foreground">Need a tool for that?</p>
          <p className="mb-4 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Zero Snippet has 100+ free utilities for developers and marketers —
            no signup required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Browse all tools
          </Link>
        </div>
      </main>
    </div>
  );
}
