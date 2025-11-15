import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  // @ts-ignore - Cloudflare Pages環境でのみ利用可能
  const env = process.env as unknown as Env
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
}
