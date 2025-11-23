import type { FC } from 'hono/jsx'
import { LeftSidebar } from './LeftSidebar'
import { RightTOC } from './RightTOC'
import type { TOCItem } from '../utils/toc'

type LayoutProps = {
  title: string
  children: any
  showTOC?: boolean
  tocItems?: TOCItem[]
}

export const Layout: FC<LayoutProps> = ({ title, children, showTOC = false, tocItems = [] }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - 医スク！</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="app-layout">
          <LeftSidebar />

          <main class="main-content">
            {children}
          </main>

          {showTOC && tocItems.length > 0 && (
            <RightTOC items={tocItems} />
          )}
        </div>

        <footer>
          <div class="footer-content">
            <p>© 2025 医スク！- 薬剤師による医学記事解説</p>
            <p><a href="/disclaimer">免責事項・利用規約</a></p>
          </div>
        </footer>
      </body>
    </html>
  )
}
