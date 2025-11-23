import type { FC } from 'hono/jsx'

type LayoutProps = {
  title: string
  children: any
}

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - 医スク！</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <header>
          <div class="container">
            <h1>医スク！</h1>
            <p>薬剤師による医学記事解説 + Podcast 🎧</p>
            <nav>
              <a href="/">ホーム</a>
              <a href="/articles">記事一覧</a>
              <a href="/profile">プロフィール</a>
              <a href="/sitemap">サイトマップ</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main>
          <div class="container">
            {children}
          </div>
        </main>
        <footer>
          <div class="container">
            <p>© 2025 医スク！- 薬剤師による医学記事解説</p>
            <p><a href="/disclaimer">免責事項・利用規約</a></p>
          </div>
        </footer>
      </body>
    </html>
  )
}
