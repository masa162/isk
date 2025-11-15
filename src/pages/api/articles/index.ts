import { ArticleRepository } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest, context?: any) {
  try {
    // Access Cloudflare bindings directly from the request context
    const env = context?.env || process.env

    if (!env || !env.DB) {
      console.error('Environment or DB binding not available:', {
        hasEnv: !!env,
        hasDB: !!env?.DB,
        envKeys: env ? Object.keys(env) : []
      })
      return Response.json({
        error: 'Database not configured',
        details: 'DB binding is not available',
        debug: {
          hasEnv: !!env,
          hasDB: !!env?.DB
        }
      }, { status: 500 })
    }

    const repo = new ArticleRepository(env.DB)
    const url = new URL(req.url)

    if (req.method === 'GET') {
      // 記事一覧取得
      const q = url.searchParams.get('q') || undefined
      const category = url.searchParams.get('category') || undefined
      const tag = url.searchParams.get('tag') || undefined
      const publishedParam = url.searchParams.get('published')
      const published = publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      const articles = await repo.list({
        q,
        category,
        tag,
        published,
        limit,
        offset,
      })

      return Response.json(articles, { status: 200 })
    }

    if (req.method === 'POST') {
      // 記事作成（管理者のみ）
      try {
        const body = await req.json() as any
        const article = await repo.create(body)
        return Response.json(article, { status: 201 })
      } catch (error: any) {
        console.error('Article creation error:', error)
        return Response.json({ error: error.message }, { status: 400 })
      }
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  } catch (error: any) {
    console.error('API handler error:', error)
    return Response.json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
