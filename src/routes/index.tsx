import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'
import { generateWebsiteJsonLd } from '../utils/seo'

export const indexRoute = new Hono<{ Bindings: Env }>()

indexRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const category = c.req.query('category')
  const articles = await repo.list({ published: true, limit: 20, category })
  const categories = await repo.getCategories()

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
