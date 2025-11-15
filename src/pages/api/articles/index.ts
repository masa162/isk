import { NextApiRequest, NextApiResponse } from 'next'
import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'

// @ts-ignore - Cloudflare環境でのみ利用可能
const getEnv = (req: NextApiRequest): Env | undefined => {
  return (req as any).env
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const env = getEnv(req)
  const repo = new ArticleRepository(env?.DB)

  if (req.method === 'GET') {
    // 記事一覧取得
    const { q, category, tag, published, limit, offset } = req.query

    const articles = await repo.list({
      q: q as string | undefined,
      category: category as string | undefined,
      tag: tag as string | undefined,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    })

    return res.status(200).json(articles)
  }

  if (req.method === 'POST') {
    // 記事作成（管理者のみ）
    try {
      const article = await repo.create(req.body)
      return res.status(201).json(article)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
