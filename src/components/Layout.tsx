import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
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
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : ''

  return (
    <>
    {raw('<!DOCTYPE html>')}
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
          <script type="application/ld+json">{raw(jsonLdString)}</script>
        )}

        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" />

        {type === 'article' && (
          <script type="module" dangerouslySetInnerHTML={{
            __html: `
              import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
              mermaid.initialize({ startOnLoad: true, theme: 'default' });
            `
          }}></script>
        )}

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
        <button 
          id="hamburger-btn" 
          class="fixed top-5 left-5 z-[1001] bg-white border border-[#ddd] rounded-lg w-[50px] h-[50px] text-2xl cursor-pointer shadow-sm transition-all duration-300 hover:bg-[#f5f5f5] block lg:hidden" 
          onclick="toggleMobileMenu()"
        >

          ☰
        </button>

        {/* モバイルメニューオーバーレイ */}
        <div 
          id="mobile-overlay" 
          class="fixed inset-0 bg-black/50 z-[999] opacity-0 invisible transition-all duration-300 [&.active]:opacity-100 [&.active]:visible" 
          onclick="toggleMobileMenu()"
        ></div>



        <div 
          class={`grid max-w-[1400px] mx-auto p-5 gap-[30px] flex-1 grid-cols-1 lg:grid-cols-[260px_1fr] has-[.right-toc]:lg:grid-cols-[260px_1fr_240px]`} 
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
            <p class="my-[5px]">© 2026 医スク！- 薬剤師による医学記事解説</p>
            <p class="my-[5px]">
              <a href="/disclaimer" class="text-white underline">免責事項・利用規約</a>
              <span class="mx-2">|</span>
              <a href="/tokushou" class="text-white underline">特定商取引法</a>
              <span class="mx-2">|</span>
              <a href="/feed.xml" class="text-white underline">RSS</a>
            </p>
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
    </>
  )
}
