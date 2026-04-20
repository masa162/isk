import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'
import MarkdownIt from 'markdown-it'
import { extractHeadings, addHeadingIds } from '../utils/toc'
import { generateArticleJsonLd, truncateDescription } from '../utils/seo'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// mermaidコードブロックをdivに変換
const defaultFenceRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  if (token.info.trim() === 'mermaid') {
    return `<div class="mermaid">${token.content}</div>`
  }
  return defaultFenceRender(tokens, idx, options, env, self)
}

// 外部リンクを別タブで開くように設定
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const hrefIndex = token.attrIndex('href')

  if (hrefIndex >= 0) {
    const href = token.attrs![hrefIndex][1]
    // 外部リンク（http/httpsで始まり、isk.masa86.comではない）を判定
    if ((href.startsWith('http://') || href.startsWith('https://')) && !href.includes('isk.masa86.com')) {
      token.attrPush(['target', '_blank'])
      token.attrPush(['rel', 'noopener noreferrer'])
    }
  }

  return defaultRender(tokens, idx, options, env, self)
}

export const articlesRoute = new Hono<{ Bindings: Env }>()

// 記事一覧
articlesRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const category = c.req.query('category')
  const tag = c.req.query('tag')
  const q = c.req.query('q')

  // タグでフィルタリング
  let articles = await repo.list({
    published: true,
    category,
    q,
    limit: 50
  })

  if (tag) {
    articles = articles.filter(article => article.tags && article.tags.includes(tag))
  }

  return c.html(
    <Layout
      title="記事一覧"
      description="医スク！の記事一覧ページ。薬剤師による最新の医学記事解説をチェック。"
      url="https://isk.masa86.com/articles"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h2>記事一覧</h2>

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
              {article.tags && article.tags.map(tag => (
                <a href={`/articles?tag=${tag}`} class="tag">#{tag}</a>
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

  // Markdownをレンダリング
  let htmlContent = md.render(article.content)

  // 見出しにIDを追加
  htmlContent = addHeadingIds(htmlContent)

  // 目次を抽出
  const tocItems = extractHeadings(htmlContent)

  // SEO設定
  const siteUrl = 'https://isk.masa86.com'
  const articleUrl = `${siteUrl}/articles/${article.slug}`
  const description = truncateDescription(article.excerpt || article.title)
  const jsonLd = generateArticleJsonLd(article, siteUrl)
  const ogImage = article.image_url || 'https://isk.masa86.com/og-default.png'

  return c.html(
    <Layout
      title={article.title}
      showTOC={true}
      tocItems={tocItems}
      description={description}
      url={articleUrl}
      type="article"
      ogImage={ogImage}
      publishedTime={article.created_at}
      modifiedTime={article.updated_at}
      jsonLd={jsonLd}
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <article>
        <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; line-height: 1.2;">{article.title}</h1>

        <div class="article-meta" style="margin-bottom: 30px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
          <time>{new Date(article.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
          {article.category && <a href={`/articles?category=${encodeURIComponent(article.category)}`} class="category">{article.category}</a>}
          {article.tags && article.tags.map(tag => (
            <a href={`/articles?tag=${tag}`} class="tag">#{tag}</a>
          ))}
          {article.audio_url && <span> | 🎧 音声解説あり</span>}
        </div>

        {article.audio_url && (
          <div style="background: linear-gradient(to right, #e3f2fd, #f3e5f5); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px;">🎧 音声で聴く</h3>
            <audio controls style="width: 100%;">
              <source src={article.audio_url?.startsWith('http') ? article.audio_url : `${c.env.R2_PUBLIC_URL}${article.audio_url}`} type="audio/mpeg" />
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
