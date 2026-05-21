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

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// mermaidコードブロックをdivに変換
const defaultFenceRender = md.renderer.rules.fence || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.fence = function (tokens, idx, options, _env, self) {
  const token = tokens[idx]
  if (token.info.trim() === 'mermaid') {
    return `<div class="mermaid">${escapeHtml(token.content)}</div>`
  }
  return defaultFenceRender(tokens, idx, options, _env, self)
}

// 外部リンクを別タブで開くように設定
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, _env, self) {
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

  return defaultRender(tokens, idx, options, _env, self)
}

export const articlesRoute = new Hono<{ Bindings: Env }>()

const PAGE_SIZE = 20

// 記事一覧
articlesRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const category = c.req.query('category')
  const tagFilter = c.req.query('tag')
  const q = c.req.query('q')
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const offset = (page - 1) * PAGE_SIZE

  let articles = await repo.list({
    published: true,
    category,
    q,
    limit: tagFilter ? 200 : PAGE_SIZE,
    offset: tagFilter ? 0 : offset
  })

  if (tagFilter) {
    articles = articles.filter(a => a.tags && a.tags.includes(tagFilter))
  }

  const total = tagFilter ? articles.length : await repo.count({ published: true, category })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildUrl = (p: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (tagFilter) params.set('tag', tagFilter)
    if (q) params.set('q', q)
    params.set('page', String(p))
    return `/articles?${params.toString()}`
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
            <a href={`/articles/${article.slug}`} class="article-card-thumb">
                <img
                  src={article.image_url || 'https://img.tokyo86.com/7cccfc.webp'}
                  alt={article.title}
                  loading="lazy"
                  onerror="this.src='https://img.tokyo86.com/7cccfc.webp'"
                />
              </a>
            <h3>
              <a href={`/articles/${article.slug}`}>{article.title}</a>
            </h3>
            {article.excerpt && <p>{article.excerpt}</p>}
            <div class="article-meta">
              {article.category && <span class="category">{article.category}</span>}
              {article.tags && article.tags.map(t => (
                <a href={`/articles?tag=${t}`} class="tag">#{t}</a>
              ))}
              {article.audio_url && <span>🎧</span>}
              <div>{new Date(article.created_at).toLocaleDateString('ja-JP')}</div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && <p>記事が見つかりません。</p>}

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

// 記事詳細
articlesRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const repo = new ArticleRepository(c.env.DB)
  const article = await repo.get(slug)

  if (!article) {
    return c.notFound()
  }

  // 未公開記事はURL直打ちでのみ閲覧可（一覧には出ない）
  const isDraft = !article.published

  // Markdownをレンダリング
  let htmlContent = md.render(article.content)

  // 見出しにIDを追加
  htmlContent = addHeadingIds(htmlContent)

  // 目次を抽出
  const tocItems = extractHeadings(htmlContent)

  // 同カテゴリの前後記事
  const adjacent = article.category
    ? await repo.getAdjacentInCategory(article.id, article.category)
    : { prev: null, next: null }

  // タグベース関連記事
  const related = article.tags?.length
    ? await repo.getRelatedByTags(article.id, article.tags, 3)
    : []

  // SEO設定
  const siteUrl = 'https://isk.masa86.com'
  const articleUrl = `${siteUrl}/articles/${article.slug}`
  const description = truncateDescription(article.excerpt || article.title)
  const jsonLd = generateArticleJsonLd(article, siteUrl)
  const ogImage = article.image_url || 'https://img.tokyo86.com/b8b198.webp'

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
        {isDraft && (
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 10px 16px; margin-bottom: 20px; font-size: 14px; color: #856404;">
            ⚠️ これは下書き記事です。公開一覧には表示されません。
          </div>
        )}
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

        {related.length > 0 && (
          <div style="margin-top: 48px; border-top: 1px solid #eee; padding-top: 24px;">
            <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
              🔗 関連記事
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
              {related.map(r => (
                <a href={`/articles/${r.slug}`} style="display: block; text-decoration: none; color: #333; border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: box-shadow 0.15s;"
                  onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'"
                  onmouseout="this.style.boxShadow=''"
                >
                  <img
                    src={r.image_url || 'https://img.tokyo86.com/b8b198.webp'}
                    alt={r.title}
                    style="width: 100%; height: 80px; object-fit: cover; display: block;"
                    onerror="this.src='https://img.tokyo86.com/7cccfc.webp'"
                  />
                  <div style="padding: 8px 10px;">
                    {r.category && <span style="font-size: 10px; color: #888;">{r.category}</span>}
                    <div style="font-size: 12px; line-height: 1.5; margin-top: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      {r.title}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {(adjacent.prev || adjacent.next) && (
          <div style="margin-top: 48px; border-top: 1px solid #eee; padding-top: 24px;">
            <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
              {article.category} の他の記事
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              {adjacent.prev ? (
                <a href={`/articles/${adjacent.prev.slug}`} style="display: block; padding: 12px; border: 1px solid #eee; border-radius: 8px; text-decoration: none; color: #333;">
                  <div style="font-size: 11px; color: #999; margin-bottom: 6px;">← 前の記事</div>
                  {adjacent.prev.image_url && (
                    <img src={adjacent.prev.image_url} style="width: 100%; height: 60px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" />
                  )}
                  <div style="font-size: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {adjacent.prev.title}
                  </div>
                </a>
              ) : <div />}
              {adjacent.next ? (
                <a href={`/articles/${adjacent.next.slug}`} style="display: block; padding: 12px; border: 1px solid #eee; border-radius: 8px; text-decoration: none; color: #333; text-align: right;">
                  <div style="font-size: 11px; color: #999; margin-bottom: 6px;">次の記事 →</div>
                  {adjacent.next.image_url && (
                    <img src={adjacent.next.image_url} style="width: 100%; height: 60px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" />
                  )}
                  <div style="font-size: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {adjacent.next.title}
                  </div>
                </a>
              ) : <div />}
            </div>
          </div>
        )}

        <div style="margin-top: 24px; text-align: center;">
          <a href="/articles" style="color: #0066cc; text-decoration: none;">← 記事一覧に戻る</a>
        </div>
      </article>
    </Layout>
  )
})
