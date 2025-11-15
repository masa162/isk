import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'
import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export default async function handler(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

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

    console.log('Article API [id] - env:', env ? 'present' : 'missing')
    console.log('Article API [id] - DB:', env?.DB ? 'present' : 'missing')

    const repo = new ArticleRepository(env?.DB)

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
    console.error('Article API error:', error)
    console.error('Error stack:', error.stack)
    return Response.json({
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
