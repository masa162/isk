import type { FC } from 'hono/jsx'
import { LeftSidebar } from './LeftSidebar'
import { RightTOC } from './RightTOC'
import type { TOCItem } from '../utils/toc'

type LayoutProps = {
  title: string
  children: any
  showTOC?: boolean
  tocItems?: TOCItem[]
  description?: string
  ogImage?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  jsonLd?: object
  ga4MeasurementId?: string
  hideSidebar?: boolean
}

export const Layout: FC<LayoutProps> = ({
  title,
  children,
  showTOC = false,
  tocItems = [],
  description = '薬剤師による医学記事解説 + Podcast',
  ogImage = 'https://isk.masa86.com/og-default.png',
  url = 'https://isk.masa86.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  jsonLd,
  ga4MeasurementId,
  hideSidebar = false
}) => {
  const fullTitle = `${title} - 医スク！`

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{fullTitle}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="医スク！" />
        <meta property="og:locale" content="ja_JP" />
        {type === 'article' && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === 'article' && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Structured Data */}
        {jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )}

        <link rel="stylesheet" href="/styles.css" />

        {/* Google Analytics 4 */}
        {ga4MeasurementId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}></script>
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4MeasurementId}');
              `
            }}></script>
          </>
        )}
      </head>
      <body>
        {/* ハンバーガーメニューボタン（スマホのみ表示） */}
        <button id="hamburger-btn" class="hamburger-btn" onclick="toggleMobileMenu()">
          ☰
        </button>

        {/* モバイルメニューオーバーレイ */}
        <div id="mobile-overlay" class="mobile-overlay" onclick="toggleMobileMenu()"></div>

        <div id="mobile-overlay" class="mobile-overlay" onclick="toggleMobileMenu()"></div>

        <div 
          class={`grid max-w-[1400px] mx-auto p-5 gap-[30px] flex-1 ${
            hideSidebar 
              ? 'grid-cols-1' 
              : 'grid-cols-[260px_1fr] has-[.right-toc]:grid-cols-[260px_1fr_240px] max-lg:grid-cols-1'
          }`} 
          id="app-layout"
        >
          {!hideSidebar && <LeftSidebar />}

          <main class="min-w-0 bg-white rounded-lg p-[30px] shadow-sm max-lg:p-5">
            {children}
          </main>

          {showTOC && tocItems.length > 0 && (
            <RightTOC items={tocItems} />
          )}
        </div>

        <footer class="bg-[#333] text-white text-center p-5 mt-auto">
          <div class="max-w-[1400px] mx-auto">
            <p class="my-[5px]">© 2025 医スク！- 薬剤師による医学記事解説</p>
            <p class="my-[5px]"><a href="/disclaimer" class="text-white underline">免責事項・利用規約</a></p>
          </div>
        </footer>

        {/* ページトップボタン */}
        <button id="page-top-btn" class="page-top-btn" onclick="scrollToTop()">
          ↑
        </button>

        <script dangerouslySetInnerHTML={{
          __html: `
            // ハンバーガーメニュー制御
            function toggleMobileMenu() {
              const sidebar = document.querySelector('.left-sidebar');
              const overlay = document.getElementById('mobile-overlay');
              const isOpen = sidebar.classList.contains('mobile-open');

              if (isOpen) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
              } else {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
              }
            }

            // ページトップボタンの表示制御
            window.addEventListener('scroll', function() {
              const btn = document.getElementById('page-top-btn');
              if (window.scrollY > 300) {
                btn.classList.add('visible');
              } else {
                btn.classList.remove('visible');
              }
            });

            // ページトップへスクロール
            function scrollToTop() {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          `
        }}></script>
      </body>
    </html>
  )
}
