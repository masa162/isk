import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Determine if TOC should be shown (only on article detail pages)
  const showTOC = router.pathname.startsWith('/articles/[')

  // Admin pages use their own layout
  if (router.pathname.startsWith('/admin')) {
    return (
      <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W7VM968KKP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W7VM968KKP');
          `}
        </Script>
        <Component {...pageProps} />
      </>
    )
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-W7VM968KKP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W7VM968KKP');
        `}
      </Script>
      <Layout showTOC={showTOC}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
