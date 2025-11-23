import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'

export const indexRoute = new Hono<{ Bindings: Env }>()

indexRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const articles = await repo.list({ published: true, limit: 20 })
  const categories = await repo.getCategories()

  return c.html(
    <Layout title="ホーム">
      <h2>最新記事</h2>

      {categories.length > 0 && (
        <div style="margin: 20px 0;">
          <strong>カテゴリ: </strong>
          {categories.map(cat => (
            <a href={`/?category=${cat}`} class="category">{cat}</a>
          ))}
        </div>
      )}

      <div class="article-grid">
        {articles.map(article => (
          <div class="article-card">
            <h3>
              <a href={`/articles/${article.slug}`}>{article.title}</a>
            </h3>
            {article.excerpt && <p>{article.excerpt}</p>}
            <div class="article-meta">
              {article.category && <span class="category">{article.category}</span>}
              {article.audio_url && <span>🎧 音声解説あり</span>}
              <div>{new Date(article.created_at).toLocaleDateString('ja-JP')}</div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <p>記事がまだありません。</p>
      )}
    </Layout>
  )
})
