import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Article } from '@/types/article'

export default function SitemapPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles?published=true')
      const data = await res.json() as Article[]
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    const category = article.category || '未分類'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(article)
    return acc
  }, {} as Record<string, Article[]>)

  return (
    <>
      <Head>
        <title>サイトマップ - isuku</title>
        <meta name="description" content="サイトの全記事一覧" />
      </Head>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">サイトマップ</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">メインページ</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-blue-600 hover:underline">
                記事一覧
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-blue-600 hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
              <div key={category} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {category}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({categoryArticles.length}件)
                  </span>
                </h2>
                <ul className="space-y-3">
                  {categoryArticles.map((article) => (
                    <li key={article.id} className="flex items-start gap-3">
                      {article.audio_url && (
                        <span className="text-blue-600">🎧</span>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {article.title}
                        </Link>
                        {article.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                          {new Date(article.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
