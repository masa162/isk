import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Article } from '@/types/article'
import AudioPlayer from '@/components/AudioPlayer'

export default function ArticlePage() {
  const router = useRouter()
  const { slug } = router.query

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

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
          router.push('/')
        }
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to load article:', error)
      router.push('/')
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

      <article>
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
            >
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
    </>
  )
}
