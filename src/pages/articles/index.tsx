import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Article } from '@/types/article'
import ArticleCard from '@/components/ArticleCard'

export default function ArticlesPage() {
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
      const data = await res.json() as Article[]
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
        <title>記事一覧 - isuku</title>
        <meta name="description" content="医学記事の一覧ページ" />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">記事一覧</h1>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
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
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
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

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">記事が見つかりませんでした</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  )
}
