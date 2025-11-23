import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export const articlesRoute = new Hono<{ Bindings: Env }>()

// 記事一覧
articlesRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const category = c.req.query('category')
  const q = c.req.query('q')

  const articles = await repo.list({
    published: true,
    category,
    q,
    limit: 50
  })

  return c.html(
    <Layout title="記事一覧">
      <h2>記事一覧</h2>

      <div class="article-grid">
        {articles.map(article => (
          <div class="article-card">
            <h3>
              <a href={`/articles/${article.slug}`}>{article.title}</a>
            </h3>
            {article.excerpt && <p>{article.excerpt}</p>}
            <div class="article-meta">
              {article.category && <span class="category">{article.category}</span>}
              {article.tags && article.tags.map(tag => (
                <span class="tag">#{tag}</span>
              ))}
              {article.audio_url && <span>🎧</span>}
              <div>{new Date(article.created_at).toLocaleDateString('ja-JP')}</div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && <p>記事が見つかりません。</p>}
    </Layout>
  )
})

// 記事詳細
articlesRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const repo = new ArticleRepository(c.env.DB)
  const article = await repo.get(slug)

  if (!article || !article.published) {
    return c.notFound()
  }

  const htmlContent = md.render(article.content)

  return c.html(
    <Layout title={article.title}>
      <article>
        <div style="margin-bottom: 20px;">
          {article.category && <span class="category">{article.category}</span>}
          {article.tags && article.tags.map(tag => (
            <span class="tag">#{tag}</span>
          ))}
        </div>

        <h1>{article.title}</h1>

        <div class="article-meta" style="margin-bottom: 30px;">
          <time>{new Date(article.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
          {article.audio_url && <span> | 🎧 音声解説あり</span>}
        </div>

        {article.audio_url && (
          <div style="background: linear-gradient(to right, #e3f2fd, #f3e5f5); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px;">🎧 音声で聴く</h3>
            <audio controls style="width: 100%;">
              <source src={`${c.env.R2_PUBLIC_URL}${article.audio_url}`} type="audio/mpeg" />
              お使いのブラウザは音声再生に対応していません。
            </audio>
          </div>
        )}

        <div class="prose" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>

        <div style="margin-top: 40px; text-align: center;">
          <a href="/" style="color: #0066cc; text-decoration: none;">← 記事一覧に戻る</a>
        </div>
      </article>
    </Layout>
  )
})
