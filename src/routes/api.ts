import { Hono } from 'hono'
import type { Env } from '../types'
import { ArticleRepository } from '../db/articles'

export const apiRoute = new Hono<{ Bindings: Env }>()

// パブリック検索API（認証不要・LIKE検索）
apiRoute.get('/search', async (c) => {
  const q = c.req.query('q') || ''
  if (q.length < 2) return c.json({ articles: [] })
  const like = `%${q}%`
  const result = await c.env.DB.prepare(
    `SELECT slug, title, category, image_url FROM articles
     WHERE published = 1 AND (title LIKE ? OR content LIKE ?)
     ORDER BY created_at DESC LIMIT 6`
  ).bind(like, like).all()
  return c.json({ articles: result.results })
})

// 今日はなんの日API（認証不要・月日で絞り込み）
apiRoute.get('/today', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const now = new Date()
  const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  // 全記事から月日が一致するものを探す（created_atはUNIX秒）
  const all = await repo.list({ published: true, limit: 200 })
  const today = all.filter(a => {
    const d = new Date(a.created_at)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${m}-${day}` === mmdd
  })
  // 今日の記事がなければランダムに3本
  const picks = today.length > 0
    ? today.slice(0, 3)
    : all.sort(() => Math.random() - 0.5).slice(0, 3)
  return c.json({
    isToday: today.length > 0,
    mmdd,
    articles: picks.map(a => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      image_url: a.image_url,
    }))
  })
})

// パブリックカテゴリ一覧API（認証不要）
apiRoute.get('/categories-public', async (c) => {
  const result = await c.env.DB.prepare(
    `SELECT DISTINCT category FROM articles WHERE published = 1 AND category IS NOT NULL ORDER BY category`
  ).all<{category: string}>()
  return c.json({ categories: result.results.map(r => r.category) })
})

// Bearer token認証ミドルウェア（/articles/* のみ、search/todayは除外）
apiRoute.use('/articles/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token || token !== c.env.API_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  return next()
})
apiRoute.use('/articles', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token || token !== c.env.API_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  return next()
})

// 記事一覧
apiRoute.get('/articles', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const { category, q, limit, offset, published } = c.req.query()
  const articles = await repo.list({
    category: category || undefined,
    q: q || undefined,
    limit: limit ? Number(limit) : 50,
    offset: offset ? Number(offset) : 0,
    published: published === 'true' ? true : published === 'false' ? false : undefined,
  })
  return c.json({ articles })
})

// 記事取得（ID or slug）
apiRoute.get('/articles/:idOrSlug', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const param = c.req.param('idOrSlug')
  const idOrSlug = /^\d+$/.test(param) ? Number(param) : param
  const article = await repo.get(idOrSlug)
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ article })
})

// 記事作成
apiRoute.post('/articles', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const body = await c.req.json()

  const slug = body.slug || generateSlug()

  const article = await repo.create({
    title: body.title,
    slug,
    content: body.content,
    excerpt: body.excerpt || undefined,
    category: body.category || undefined,
    tags: body.tags || [],
    audio_url: body.audio_url || undefined,
    image_url: body.image_url || undefined,
    published: body.published ? 1 : 0,
  })
  return c.json({ article }, 201)
})

// 記事更新
apiRoute.put('/articles/:id', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const article = await repo.update(id, body)
  return c.json({ article })
})

// 記事削除
apiRoute.delete('/articles/:id', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const id = Number(c.req.param('id'))
  await repo.delete(id)
  return c.json({ success: true })
})

// カテゴリ一覧
apiRoute.get('/categories', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const categories = await repo.getCategories()
  return c.json({ categories })
})

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
