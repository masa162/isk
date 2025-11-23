import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'

export const staticRoute = new Hono<{ Bindings: Env }>()

// プロフィールページ
staticRoute.get('/profile', (c) => {
  return c.html(
    <Layout title="プロフィール">
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
    <Layout title="免責事項・利用規約">
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
    <Layout title="About">
      <h1>医スク！について</h1>
      <p>薬剤師による、エビデンスに基づいた医学記事解説サイトです。</p>
      <p>最新の医学論文を分かりやすく解説し、あなたの健康をサポートします。</p>
    </Layout>
  )
})

// サイトマップページ
staticRoute.get('/sitemap', async (c) => {
  return c.html(
    <Layout title="サイトマップ">
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
