import { NextApiRequest, NextApiResponse } from 'next'
import { ArticleRepository } from '@/lib/db'
import type { Env } from '@/types/env'

const getEnv = (req: NextApiRequest): Env | undefined => {
  return (req as any).env
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const env = getEnv(req)
  const repo = new ArticleRepository(env?.DB)

  // IDまたはslugで取得
  const idOrSlug = isNaN(Number(id)) ? (id as string) : Number(id)

  if (req.method === 'GET') {
    // 記事取得
    const article = await repo.get(idOrSlug)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }
    return res.status(200).json(article)
  }

  if (req.method === 'PUT') {
    // 記事更新（管理者のみ）
    try {
      const article = await repo.update({
        id: Number(id),
        ...req.body,
      })
      return res.status(200).json(article)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  if (req.method === 'DELETE') {
    // 記事削除（管理者のみ）
    try {
      await repo.delete(Number(id))
      return res.status(204).end()
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
