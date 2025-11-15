import { ArticleRepository } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest, context?: any) {
  try {
    // Extract ID from URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]

    if (!id) {
      return Response.json({ error: 'Article ID is required' }, { status: 400 })
    }

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

    // IDまたはslugで取得
    const idOrSlug = isNaN(Number(id)) ? id : Number(id)

    if (req.method === 'GET') {
      // 記事取得
      const article = await repo.get(idOrSlug)
      if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 })
      }
      return Response.json(article, { status: 200 })
    }

    if (req.method === 'PUT') {
      // 記事更新（管理者のみ）
      try {
        const body = await req.json() as any
        const article = await repo.update({
          id: Number(id),
          ...body,
        })
        return Response.json(article, { status: 200 })
      } catch (error: any) {
        console.error('Article update error:', error)
        return Response.json({ error: error.message }, { status: 400 })
      }
    }

    if (req.method === 'DELETE') {
      // 記事削除（管理者のみ）
      try {
        await repo.delete(Number(id))
        return new Response(null, { status: 204 })
      } catch (error: any) {
        console.error('Article delete error:', error)
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
