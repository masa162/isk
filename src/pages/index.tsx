import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Article } from '@/types/article'
import ArticleCard from '@/components/ArticleCard'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadArticles()
  }, [searchQuery, selectedCategory])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        published: 'true',
      })
      if (searchQuery) params.append('q', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)

      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)))

  return (
    <>
      <Head>
        <title>isuku - 医学記事解説ブログ + Podcast</title>
        <meta name="description" content="薬剤師による一般向け医学記事解説とPodcast配信" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              isuku
            </h1>
            <p className="text-gray-600">
              薬剤師による医学記事解説 + Podcast 🎧
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  すべて
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat!)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">読み込み中...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">記事がまだありません</p>
              <p className="text-sm text-gray-500">
                管理画面から記事を投稿してみましょう
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
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
