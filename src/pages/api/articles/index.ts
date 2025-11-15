import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'
import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  try {
    // Cloudflare Pagesの環境変数とバインディングを取得
    let env: Env | undefined
    try {
      const ctx = getRequestContext()
      env = ctx.env as Env
    } catch (e) {
      // ローカル開発環境では getRequestContext() が使えないので、フォールバック
      console.log('Running in local dev mode (no Cloudflare context)')
      env = undefined
    }

    console.log('Article API index - env:', env ? 'present' : 'missing')
    console.log('Article API index - DB:', env?.DB ? 'present' : 'missing')

    const repo = new ArticleRepository(env?.DB)
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
    console.error('Article API error:', error)
    console.error('Error stack:', error.stack)
    return Response.json({
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
