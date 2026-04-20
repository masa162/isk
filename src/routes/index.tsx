import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'
import { generateWebsiteJsonLd } from '../utils/seo'

export const indexRoute = new Hono<{ Bindings: Env }>()

const PAGE_SIZE = 20

indexRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const category = c.req.query('category')
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const offset = (page - 1) * PAGE_SIZE

  const [articles, total, categories] = await Promise.all([
    repo.list({ published: true, limit: PAGE_SIZE, offset, category }),
    repo.count({ published: true, category }),
    repo.getCategories()
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildUrl = (p: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('page', String(p))
    return `/?${params.toString()}`
  }

  const siteUrl = 'https://isk.masa86.com'
  const jsonLd = generateWebsiteJsonLd(siteUrl)

  return c.html(
    <Layout
      title="ホーム"
      description="薬剤師による医学記事解説 + Podcast。エビデンスに基づいた分かりやすい医学情報をお届けします。"
      url={siteUrl}
      jsonLd={jsonLd}
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      {/* Hero Section */}
      <div class="hero-section">
        <img src="/images/hero/hero-main.webp" alt="医スク！Hero" class="hero-image" />
        <div class="hero-overlay">
          <h1 class="hero-title">医スク！</h1>
          <p class="hero-description">薬剤師による医学記事解説 + Podcast</p>
          <p class="hero-subtitle">エビデンスに基づいた分かりやすい医学情報をお届けします</p>
        </div>
      </div>

      <h2>{category ? `カテゴリ: ${category}` : '最新記事'}</h2>

      {categories.length > 0 && (
        <div style="margin: 20px 0;">
          <strong>カテゴリ: </strong>
          {categories.map(cat => (
            <a href={`/?category=${encodeURIComponent(cat)}`} class="category">{cat}</a>
          ))}
        </div>
      )}

      <div class="article-grid">
        {articles.map(article => (
          <div class="article-card">
            {article.image_url && (
              <a href={`/articles/${article.slug}`} class="article-card-thumb">
                <img src={article.image_url} alt={article.title} loading="lazy" />
              </a>
            )}
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

      {articles.length === 0 && <p>記事がまだありません。</p>}

      {totalPages > 1 && (
        <div class="pagination">
          {page > 1 && <a href={buildUrl(page - 1)} class="pagination-btn">← 前へ</a>}
          <span class="pagination-info">{page} / {totalPages}</span>
          {page < totalPages && <a href={buildUrl(page + 1)} class="pagination-btn">次へ →</a>}
        </div>
      )}
    </Layout>
  )
})
