import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Article } from '@/types/article'

export default function EditArticle() {
  const router = useRouter()
  const { id } = router.query

  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    audio_url: '',
    published: false,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (id && id !== 'new') {
      loadArticle()
    }
  }, [id])

  const loadArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${id}`)
      const data = await res.json() as Article
      setArticle(data)
      setTagInput(data.tags?.join(', ') || '')
    } catch (error) {
      console.error('Failed to load article:', error)
      alert('記事の読み込みに失敗しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
      const payload = { ...article, tags }

      const url = id === 'new' ? '/api/articles' : `/api/articles/${id}`
      const method = id === 'new' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('保存しました')
        router.push('/admin')
      } else {
        const error = await res.json() as { error: string }
        alert(`保存に失敗しました: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to save article:', error)
      alert('保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json() as { url?: string; error?: string }
      if (res.ok) {
        setArticle({ ...article, audio_url: data.url })
        alert('アップロードしました')
      } else {
        alert(`アップロードに失敗しました: ${data.error}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = () => {
    if (!article.title) return
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g, '-')
      .replace(/^-|-$/g, '')
    setArticle({ ...article, slug })
  }

  return (
    <>
      <Head>
        <title>{id === 'new' ? '新規記事作成' : '記事編集'} - isuku</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {id === 'new' ? '新規記事作成' : '記事編集'}
            </h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                type="text"
                required
                value={article.title}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* スラッグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スラッグ (URL) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="article-url-slug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  自動生成
                </button>
              </div>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <input
                type="text"
                value={article.category}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 循環器, 消化器"
              />
            </div>

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ (カンマ区切り)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 高血圧, 薬剤師解説"
              />
            </div>

            {/* 概要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                概要
              </label>
              <textarea
                value={article.excerpt}
                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="記事の簡単な説明（省略可）"
              />
            </div>

            {/* 本文 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                本文 (Markdown) *
              </label>
              <textarea
                required
                value={article.content}
                onChange={(e) => setArticle({ ...article, content: e.target.value })}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力..."
              />
            </div>

            {/* 音声ファイル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                音声ファイル (MP3)
              </label>
              {article.audio_url && (
                <div className="mb-2">
                  <audio src={article.audio_url} controls className="w-full mb-2" />
                  <p className="text-sm text-gray-600">{article.audio_url}</p>
                </div>
              )}
              <input
                type="file"
                accept="audio/mp3,audio/mpeg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {uploading && <p className="text-sm text-blue-600 mt-2">アップロード中...</p>}
            </div>

            {/* 公開設定 */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={article.published}
                  onChange={(e) => setArticle({ ...article, published: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">公開する</span>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
