import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  try {
    // @ts-ignore - Cloudflare Pages環境でのみ利用可能
    const env = process.env as unknown as Env
    const repo = new ArticleRepository(env?.DB)

    // Get all published articles
    const articles = await repo.list({ published: true, limit: 1000 })

    // Base URL
    const baseUrl = 'https://isk.masa86.com'

    // Static pages with priority
    const staticPages = [
      { url: '', lastmod: new Date().toISOString(), priority: '1.0' }, // Home
      { url: '/articles', lastmod: new Date().toISOString(), priority: '0.9' },
      { url: '/about', lastmod: new Date().toISOString(), priority: '0.7' },
      { url: '/sitemap', lastmod: new Date().toISOString(), priority: '0.5' },
    ]

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod.split('T')[0]}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${articles
  .map(
    (article) => `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at || article.created_at).toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
