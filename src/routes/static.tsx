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
      <div class="prose">
        <h1>身体というシステムを、「デバッグ」する。</h1>

        <h2>中山 正之 (Nakayama Masayuki)</h2>
        <p><strong>薬剤師 / メディカルライター / 健康戦略コンサルタント</strong></p>

        <p>1986年、神奈川県生まれ。</p>
        <p>「論理（エビデンス）」と「直感（漢方・イラスト）」の両輪で、働き盛りの身体を最適化する専門家。</p>

        <p>元システムエンジニアという異色の経歴を持ち、人体のメカニズムを「複雑なシステム」として捉え直す独自のアプローチで、慢性疲労や不調に悩むビジネスパーソンの「健康のボトルネック」を解消しています。</p>

        <hr />

        <h3>■ 経歴：コードの世界から、生命のシステムへ</h3>

        <h4>20代：ITエンジニアとしての葛藤</h4>
        <p>キャリアのスタートは、システムエンジニア・Webディベロッパーでした。論理的なコードの世界に没頭する一方で、不規則な生活で心身のパフォーマンスが乱れる同僚たちを目の当たりにし、「人間の身体というシステム」への興味が抑えきれなくなりました。</p>

        <h4>30代：薬学への挑戦と「学び直し」</h4>
        <p>「人体のソースコードを理解したい」という思いから、2015年、29歳で城西国際大学薬学部へ入学。一回り年下の学生たちと共に学び、メタアナリシス（統計解析）を研究テーマにエビデンスの読み解き方を徹底的に叩き込みました。</p>

        <h4>現在：3つの現場で培った「最適解」の提案</h4>
        <p>2022年に薬剤師免許を取得後、以下の現場で臨床経験を積みました。</p>

        <ol>
          <li><strong>総合病院（慢性期）：</strong> 輸液管理を通じ、「人が生きるために最低限必要な栄養成分」を分子レベルで考察。</li>
          <li><strong>漢方専門薬局：</strong> 『傷寒論』『金匱要略』などの古典に基づき、西洋医学では見落とされる「証（体質）」を見立てる古法漢方を習得。</li>
          <li><strong>ドラッグストア：</strong> 膨大なOTC医薬品や生活用品の中から、生活者のリアルな悩みに即した「ハック（活用法）」を研究。</li>
        </ol>

        <p>現在はこれらを統合し、薬に頼りすぎない「自走する健康管理」を提案しています。</p>

        <hr />

        <h3>■ ミッション：なぜ「コンサル」なのか？</h3>

        <p>現場で働きながら、常に感じていた違和感があります。</p>

        <blockquote>
          「生活習慣という『OS』がバグっているのに、薬という『パッチ』を当てるだけでいいのか？」
        </blockquote>

        <p>3分診療で大量の薬が出され、根本的な解決にならないまま通院を続ける患者さんたち。<br />
        「もっと食事や生活を変えれば、この薬はいらないのに」——その思いが、現在の活動の原点です。</p>

        <p>病院は「病気になってから行く場所」ですが、私が作りたいのは<strong>「病気になる前の戦略会議室」</strong>です。<br />
        ビジネスのパフォーマンスを落としたくない経営者やリーダーのために、医学論文と漢方の知見を使い、あなたの専属参謀としてサポートします。</p>

        <hr />

        <h3>■ 私について（Persona）</h3>

        <h4>1986年生まれ（五黄の寅）</h4>
        <p>私自身、30代後半に差し掛かり「気合で乗り切れた徹夜」ができなくなるなど、身体の変化（スペックダウン）を痛感しています。だからこそ、同世代の「まだまだ前線で戦いたい」という切実な思いがわかります。</p>

        <h4>オタク気質な「凝り性」</h4>
        <ul>
          <li><strong>漫画・ゲーム:</strong> 人生のバイブルは『HUNTER×HUNTER』。念能力のような複雑なルール考察が好きです。ゲームは『DQ5』『クロノ・トリガー』が至高。最近『FF7 リバース』をプレイしましたが、おじさん世代にはボリュームが辛く、体力の重要性を再確認しました。</li>
          <li><strong>特技:</strong> イラスト・人体デッサン。言葉では伝えにくい「気の流れ」や「解剖学」を、図解イラストにするのが得意です。</li>
        </ul>

        <h4>弱点：ラーメンの魔力</h4>
        <p>健康を説く立場ですが、聖人君子ではありません。横浜家系、煮干し系、そして「二郎系（豚山）」の魔力には勝てません。「食べた分、どうリカバリーするか？」を考えるのもまた、健康戦略の一部だと（勝手に）解釈しています。</p>

        <hr />

        <h3>■ 提供できる価値</h3>

        <p>当サイト「医スク！」では、以下のスタンスで情報を発信しています。</p>

        <ol>
          <li><strong>学術論文の咀嚼:</strong> メタアナリシス研究で培った視点で、情報の「量」を読み込み、鵜呑みにせず、日本人の体質に合うかを考察します。</li>
          <li><strong>漢方的アプローチ:</strong> 数値には出ない「なんとなく不調」を、東洋医学の視点で言語化します。</li>
          <li><strong>実践的ハック:</strong> 忙しいあなたが明日から使えるレベルまで、情報を噛み砕いて（イラスト化して）お届けします。</li>
        </ol>

        <p><strong>「診断」ではなく「戦略」を。</strong><br />
        病院に行くほどではないけれど、パフォーマンスが上がらない。<br />
        そんなあなたの「取扱説明書」を一緒に作りましょう。</p>
      </div>
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
      <div class="prose">
        <h1>免責事項・利用規約</h1>

        <h2>1. 医療行為ではないことの明示</h2>
        <p>当サイト「医スク！」（以下、当サイト）および当サイト管理人が提供する健康コンサルティングサービス（以下、本サービス）は、薬剤師の資格を持つ管理者による、健康情報の提供、生活習慣の改善提案、および一般用医薬品（漢方薬含む）・サプリメントに関する助言を行うものです。</p>
        <p>これらは、医師法に基づく「医療行為（診断・治療・投薬）」ではありません。</p>
        <p>いかなる場合も、医師による診断の代わりとなるものではなく、特定の疾患の治癒を保証するものではありません。</p>

        <h2>2. 医療機関の受診について</h2>
        <p>現在、医療機関にて治療を受けている方、または処方薬を服用中の方は、本サービスを利用する前に、必ず主治医にご相談ください。</p>
        <p>当サイトおよび本サービスからの提案内容が、主治医の指示と異なる場合は、常に主治医の指示を優先してください。</p>
        <p>また、身体に不調を感じた場合や、症状が悪化した場合は、速やかに医療機関を受診してください。</p>

        <h2>3. 医薬品・サプリメント等の提案について</h2>
        <p>本サービスにおいて、漢方薬やサプリメント等の提案を行う場合がありますが、これらはあくまで一般的な薬学的知見や最新の論文データに基づいた情報の提供です。</p>
        <p>実際の購入、服用、および継続の判断は、すべて利用者ご本人の自己責任において行ってください。</p>
        <p>提案された商品を使用したことによる体調の変化、副作用、アレルギー反応等について、当サイトおよび管理人は一切の責任を負いかねます。</p>

        <h2>4. 情報の正確性と学術的根拠について</h2>
        <p>当サイトの記事およびコンテンツは、作成時点での信頼できる医学論文や公的機関の情報を基に作成し、正確性の確保に努めています。</p>
        <p>しかしながら、医療・科学情報は常に更新されるものであり、全ての内容が最新かつ完全に正確であることを保証するものではありません。</p>
        <p>また、紹介する論文や事例は、すべての利用者に同様の結果をもたらすことを約束するものではありません。</p>

        <h2>5. 損害賠償の免責</h2>
        <p>当サイトの利用、または本サービスの利用に関連して生じた利用者および第三者の損害（精神的苦痛、事業の中断、その他の金銭的損失を含む）について、当サイトおよび管理人は、故意または重過失がある場合を除き、一切の責任を負いません。</p>
      </div>
    </Layout>
  )
})

// 特定商取引法ページ
staticRoute.get('/tokushou', (c) => {
  return c.html(
    <Layout
      title="特定商取引法に基づく表記"
      description="医スク！の特定商取引法に基づく表記"
      url="https://isk.masa86.com/tokushou"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <div class="prose">
        <h1>特定商取引法に基づく表記</h1>

        <h2>販売業者</h2>
        <p>ISK Consulting</p>

        <h2>代表責任者</h2>
        <p>中山正之</p>

        <h2>所在地</h2>
        <p>
          〒215-0025<br />
          神奈川県川崎市麻生区五力田 2-18-4
        </p>
        <p style="font-size: 14px; color: #666;">
          ※個人の住所になりますので、取引時に請求があれば遅滞なく開示いたします。
        </p>

        <h2>電話番号</h2>
        <p>090-2405-5122</p>
        <p style="font-size: 14px; color: #666;">
          ※サービスに関するお問い合わせは、記録保持の観点から下記メールアドレス、または公式LINEよりお願いいたします。<br />
          ※請求があれば遅滞なく開示いたします。
        </p>

        <h2>メールアドレス</h2>
        <p><a href="mailto:info@masa86.com">info@masa86.com</a></p>

        <h2>ホームページURL</h2>
        <p><a href="https://isk.masa86.com/">https://isk.masa86.com/</a></p>

        <h2>販売価格</h2>
        <p>各商品ページに記載（表示価格は消費税込み）</p>

        <h2>商品代金以外の必要料金</h2>
        <p>インターネット接続料金、通信料金（お客様の負担となります）</p>

        <h2>お支払方法</h2>
        <ul>
          <li>クレジットカード決済（Stripe）</li>
          <li>銀行振込（前払い）</li>
        </ul>

        <h2>支払いの時期</h2>
        <ul>
          <li>クレジットカード：商品注文時にお支払いが確定します。</li>
          <li>銀行振込：お申し込みから7日以内にお振込みください。</li>
        </ul>

        <h2>商品の引渡時期（役務の提供時期）</h2>
        <ul>
          <li>決済完了後、直ちにご利用いただけます（デジタルコンテンツの場合）。</li>
          <li>コンサルティングサービスについては、お客様と調整した日時にて実施いたします。</li>
        </ul>

        <h2>返品・交換・キャンセルについて</h2>
        <ul>
          <li><strong>デジタルコンテンツ・コンサルティングの性質上、決済完了後の返品・返金はお受けできません。</strong></li>
          <li>月額プラン（サブスクリプション）の解約は、次回更新日の3日前までにマイページ、またはお問い合わせ窓口よりご連絡ください。日割りでの返金は行いません。</li>
        </ul>

        <h2>免責事項</h2>
        <p>当サービスは、健康維持・増進を目的とした情報提供および相談サービスです。医師法に基づく医療行為（診断・治療・投薬）を行うものではありません。体調に異変を感じた場合は、速やかに医療機関を受診してください。</p>
      </div>
    </Layout>
  )
})

// お申し込みページ
staticRoute.get('/payment', (c) => {
  return c.html(
    <Layout
      title="お申し込み"
      description="医スク！の健康コンサルティングサービスにお申し込みいただけます"
      url="https://isk.masa86.com/payment"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <div class="prose">
        <h1>お申し込み</h1>
        <p>医スク！では、薬剤師による健康コンサルティングサービスを提供しています。</p>

        <div style="margin: 40px 0;">
          <h2>パーソナル健康コンサルティング（相談 60分）</h2>
          <p><strong>¥30,000 / 月</strong></p>
          <p>毎月60分の個別健康相談を受けられるサブスクリプションサービスです。</p>
          <a
            href="https://buy.stripe.com/9B69AVdf837bbXZcnH3VC00"
            target="_blank"
            rel="noopener noreferrer"
            style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px; font-weight: bold;"
          >
            お申し込みはこちら
          </a>
        </div>

        <div style="margin: 40px 0;">
          <h2>スポット健康相談（単発）</h2>
          <p><strong>¥30,000</strong></p>
          <p>単発での健康相談サービスです。1回限りのご相談に最適です。</p>
          <a
            href="https://buy.stripe.com/fZu3cx1wqcHL1jl0EZ3VC01"
            target="_blank"
            rel="noopener noreferrer"
            style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px; font-weight: bold;"
          >
            お申し込みはこちら
          </a>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3>ご注意事項</h3>
          <ul>
            <li>お支払いはStripeの安全な決済システムを使用しています</li>
            <li>お申し込み後、メールにて詳細をご案内いたします</li>
            <li>キャンセルポリシーについては利用規約をご確認ください</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
})

// サイトマップページ (HTML)
staticRoute.get('/sitemap', async (c) => {
  let articles = []

  try {
    const repo = new ArticleRepository(c.env.DB)
    articles = await repo.list({ published: true, limit: 1000 })
  } catch (error) {
    console.error('[HTML Sitemap] Error fetching articles:', error)
  }

  return c.html(
    <Layout
      title="サイトマップ"
      description="医スク！のサイトマップ"
      url="https://isk.masa86.com/sitemap"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
      hideSidebar={true}
    >
      <h1>サイトマップ</h1>
      <h2>メインページ</h2>
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/articles">記事一覧</a></li>
        <li><a href="/profile">プロフィール</a></li>
        <li><a href="/payment">お申し込み</a></li>
        <li><a href="/disclaimer">免責事項・利用規約</a></li>
        <li><a href="/tokushou">特定商取引法</a></li>
      </ul>

      {articles.length > 0 && (
        <>
          <h2>記事一覧</h2>
          <ul>
            {articles.map(article => (
              <li>
                <a href={`/articles/${article.slug}`}>{article.title}</a>
                {article.category && <span style="margin-left: 10px; color: #666;">({article.category})</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </Layout>
  )
})

// XML サイトマップ (Google Search Console用)
staticRoute.get('/sitemap.xml', async (c) => {
  const siteUrl = 'https://isk.masa86.com'

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/articles', changefreq: 'daily', priority: '0.9' },
    { url: '/profile', changefreq: 'monthly', priority: '0.7' },
    { url: '/payment', changefreq: 'monthly', priority: '0.8' },
    { url: '/disclaimer', changefreq: 'yearly', priority: '0.5' },
    { url: '/tokushou', changefreq: 'yearly', priority: '0.5' }
  ]

  let articles = []

  try {
    const repo = new ArticleRepository(c.env.DB)
    articles = await repo.list({ published: true, limit: 1000 })
    console.log(`[Sitemap] Successfully fetched ${articles.length} articles`)
  } catch (error) {
    console.error('[Sitemap] Error fetching articles:', error)
    // Continue with empty articles array - at least return static pages
  }

  const articlesXml = articles.map(article => {
    // Safely handle updated_at field
    const lastmod = article.updated_at || article.created_at
    const lastmodDate = lastmod ? new Date(lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

    return `  <url>
    <loc>${siteUrl}/articles/${article.slug}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${articlesXml}
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
