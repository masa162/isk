import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Article } from '@/types/article'

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('この記事を削除しますか?')) return

    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      await loadArticles()
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('削除に失敗しました')
    }
  }

  return (
    <>
      <Head>
        <title>管理画面 - isuku</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">isuku 管理画面</h1>
              <Link
                href="/admin/articles/new"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                新規記事作成
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">記事一覧</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-500">読み込み中...</div>
            ) : articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">記事がありません</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {article.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                          <span>{article.published ? '公開' : '下書き'}</span>
                          {article.category && (
                            <span className="bg-gray-200 px-2 py-1 rounded">
                              {article.category}
                            </span>
                          )}
                          {article.audio_url && (
                            <span className="text-blue-600">🎧 音声あり</span>
                          )}
                          <span>{new Date(article.created_at).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
