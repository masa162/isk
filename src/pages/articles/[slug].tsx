import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Article } from '@/types/article'
import AudioPlayer from '@/components/AudioPlayer'

export default function ArticlePage() {
  const router = useRouter()
  const { slug } = router.query

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      loadArticle()
    }
  }, [slug])

  const loadArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${slug}`)
      if (res.ok) {
        const data = await res.json() as Article
        // 公開記事のみ表示
        if (data.published) {
          setArticle(data)
        } else {
          setError('この記事は現在非公開です。')
        }
      } else if (res.status === 404) {
        setError('記事が見つかりませんでした。')
      } else {
        setError('記事の読み込みに失敗しました。')
      }
    } catch (error) {
      console.error('Failed to load article:', error)
      setError('記事の読み込み中にエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>エラー - isuku</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                ← isuku
              </Link>
            </div>
          </header>
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error}
              </h1>
              <p className="text-gray-600 mb-8">
                {error === 'この記事は現在非公開です。'
                  ? '記事を公開するには、管理画面から記事を編集して「この記事を公開する」にチェックを入れてください。'
                  : 'お探しの記事が見つからないか、削除された可能性があります。'}
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                記事一覧に戻る
              </Link>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (!article) {
    return null
  }

  return (
    <>
      <Head>
        <title>{article.title} - isuku</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              ← isuku
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <article className="max-w-3xl mx-auto">
            {/* Article Header */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.category && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                )}
                {article.tags?.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <time suppressHydrationWarning>
                  {new Date(article.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {article.audio_url && (
                  <span className="text-blue-600 font-medium">🎧 音声解説あり</span>
                )}
              </div>
            </div>

            {/* Audio Player */}
            {article.audio_url && (
              <AudioPlayer audioUrl={article.audio_url} title={article.title} />
            )}

            {/* Article Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                記事一覧に戻る
              </Link>
            </div>
          </article>
        </main>

        {/* Footer */}
        <footer className="mt-16 bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2025 isuku - 薬剤師による医学記事解説
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
