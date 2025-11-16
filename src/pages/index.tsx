import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Article } from '@/types/article'
import ArticleCard from '@/components/ArticleCard'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadArticles()
  }, [selectedCategory])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        published: 'true',
      })
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
        <title>isuku - 医学記事解説ブログ + Podcast</title>
        <meta name="description" content="薬剤師による一般向け医学記事解説とPodcast配信" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  )
}
