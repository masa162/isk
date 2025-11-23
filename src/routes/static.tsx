import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'

export const staticRoute = new Hono<{ Bindings: Env }>()

// プロフィールページ
staticRoute.get('/profile', (c) => {
  return c.html(
    <Layout
      title="プロフィール"
      description="薬剤師・メディカルライター 中山正之のプロフィール"
      url="https://isk.masa86.com/profile"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h1>身体というシステムを、「デバッグ」する。</h1>
      <h2>中山 正之 (Nakayama Masayuki)</h2>
      <p><strong>薬剤師 / メディカルライター / 健康戦略コンサルタント</strong></p>
      <p>1986年、神奈川県生まれ。</p>
      <p>「論理（エビデンス）」と「直感（漢方・イラスト）」の両輪で、働き盛りの身体を最適化する専門家。</p>
      <p>詳細は準備中...</p>
    </Layout>
  )
})

// 免責事項ページ
staticRoute.get('/disclaimer', (c) => {
  return c.html(
    <Layout
      title="免責事項・利用規約"
      description="医スク！の免責事項・利用規約"
      url="https://isk.masa86.com/disclaimer"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h1>免責事項・利用規約</h1>

      <h2>1. 医療行為ではないことの明示</h2>
      <p>当サイト「医スク！」は、薬剤師による健康情報の提供を行うものです。これらは医師法に基づく「医療行為（診断・治療・投薬）」ではありません。</p>

      <h2>2. 医療機関の受診について</h2>
      <p>医療機関で治療を受けている方は、必ず主治医にご相談ください。</p>

      <h2>3. 医薬品・サプリメント等の提案について</h2>
      <p>提案はあくまで情報提供であり、購入・服用の判断は自己責任で行ってください。</p>

      <h2>4. 情報の正確性について</h2>
      <p>信頼できる情報源を基に作成していますが、すべての内容が最新・完全に正確であることを保証するものではありません。</p>

      <h2>5. 損害賠償の免責</h2>
      <p>当サイトの利用に関連して生じた損害について、故意または重過失がある場合を除き、一切の責任を負いません。</p>
    </Layout>
  )
})

// Aboutページ
staticRoute.get('/about', (c) => {
  return c.html(
    <Layout
      title="About"
      description="医スク！について - 薬剤師によるエビデンスに基づいた医学記事解説サイト"
      url="https://isk.masa86.com/about"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h1>医スク！について</h1>
      <p>薬剤師による、エビデンスに基づいた医学記事解説サイトです。</p>
      <p>最新の医学論文を分かりやすく解説し、あなたの健康をサポートします。</p>
    </Layout>
  )
})

// サイトマップページ (HTML)
staticRoute.get('/sitemap', async (c) => {
  return c.html(
    <Layout
      title="サイトマップ"
      description="医スク！のサイトマップ"
      url="https://isk.masa86.com/sitemap"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h1>サイトマップ</h1>
      <h2>メインページ</h2>
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/articles">記事一覧</a></li>
        <li><a href="/profile">プロフィール</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/disclaimer">免責事項・利用規約</a></li>
      </ul>
    </Layout>
  )
})

// XML サイトマップ (Google Search Console用)
staticRoute.get('/sitemap.xml', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const articles = await repo.list({ published: true, limit: 1000 })
  const siteUrl = 'https://isk.masa86.com'

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/articles', changefreq: 'daily', priority: '0.9' },
    { url: '/profile', changefreq: 'monthly', priority: '0.7' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/disclaimer', changefreq: 'yearly', priority: '0.5' }
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${articles.map(article => `  <url>
    <loc>${siteUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updated_at.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  return c.text(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8'
  })
})

// robots.txt
staticRoute.get('/robots.txt', (c) => {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://isk.masa86.com/sitemap.xml`

  return c.text(robotsTxt, 200, {
    'Content-Type': 'text/plain; charset=utf-8'
  })
})
