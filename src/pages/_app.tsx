import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Determine if TOC should be shown (only on article detail pages)
  const showTOC = router.pathname.startsWith('/articles/[')

  // Admin pages use their own layout
  if (router.pathname.startsWith('/admin')) {
    return <Component {...pageProps} />
  }

  return (
    <Layout showTOC={showTOC}>
      <Component {...pageProps} />
    </Layout>
  )
}
