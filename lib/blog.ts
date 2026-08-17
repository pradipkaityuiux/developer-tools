import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  url: string
  title: string
  description: string
  date: string
  tags?: string[]
  published: boolean
  content: string
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return collectMdxFiles(fullPath)
      return entry.name.endsWith('.mdx') ? [fullPath] : []
    })
  )
  return files.flat()
}

function toSlug(filePath: string): string {
  const relative = path.relative(BLOG_ROOT, filePath).replace(/\\/g, '/')
  return relative.replace(/\.mdx$/, '')
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await collectMdxFiles(BLOG_ROOT)
  const posts = await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      const slug = toSlug(filePath)
      return {
        slug,
        url: `/blog/${slug}`,
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        date: String(data.date ?? ''),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        published: data.published === false ? false : true,
        content,
      } satisfies BlogPost
    })
  )
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.published)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug)
}
