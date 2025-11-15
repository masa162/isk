import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Article } from '@/types/article'

export default function EditArticle() {
  const router = useRouter()
  const { id } = router.query

  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    slug: `article-${Date.now()}`,
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

      console.log('Submitting article:', payload)

      const url = id === 'new' ? '/api/articles' : `/api/articles/${id}`
      const method = id === 'new' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', res.status)

      if (res.ok) {
        alert('保存しました')
        router.push('/admin')
      } else {
        const errorText = await res.text()
        console.error('Error response:', errorText)
        let errorMessage = '保存に失敗しました'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = `保存に失敗しました: ${errorData.error || errorData.message || errorText}`
        } catch {
          errorMessage = `保存に失敗しました: ${errorText}`
        }
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Failed to save article:', error)
      alert(`保存に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  戻る
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                  {id === 'new' ? '新規記事作成' : '記事編集'}
                </h1>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  form="article-form"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      保存
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="article-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
            {/* 基本情報セクション */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">基本情報</h2>

              {/* タイトル */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="記事のタイトルを入力..."
                />
              </div>

              {/* スラッグ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  スラッグ (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={article.slug}
                    onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="article-url-slug"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    自動生成
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">URL: /articles/{article.slug || 'slug'}</p>
              </div>

              {/* カテゴリとタグ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    カテゴリ
                  </label>
                  <input
                    type="text"
                    value={article.category}
                    onChange={(e) => setArticle({ ...article, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="例: 循環器, 消化器"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    タグ (カンマ区切り)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="例: 高血圧, 薬剤師解説"
                  />
                </div>
              </div>

              {/* 概要 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  概要
                </label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="記事の簡単な説明（SEO用、SNSシェア時に表示されます）"
                />
                <p className="mt-1 text-xs text-gray-500">{article.excerpt?.length || 0} / 160文字推奨</p>
              </div>
            </div>

            {/* コンテンツセクション */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">コンテンツ</h2>

              {/* 本文 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  本文 (Markdown) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    value={article.content}
                    onChange={(e) => setArticle({ ...article, content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm resize-y"
                    placeholder="# 見出し1&#10;&#10;本文をMarkdown形式で入力...&#10;&#10;## 見出し2&#10;&#10;- リスト1&#10;- リスト2"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                    {article.content?.length || 0} 文字
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Markdown記法: **太字**、*斜体*、[リンク](URL)、`コード`、など
                </p>
              </div>
            </div>

            {/* メディアセクション */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">メディア</h2>

              {/* 音声ファイル */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  音声ファイル (MP3/Podcast)
                </label>
                {article.audio_url && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">アップロード済み</span>
                    </div>
                    <audio src={article.audio_url} controls className="w-full mb-2" />
                    <p className="text-xs text-gray-500 truncate">{article.audio_url}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {uploading ? 'アップロード中...' : 'ファイルを選択'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/mp4,audio/m4a,audio/x-m4a,audio/aac"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploading && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    アップロード中...
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  MP3、AAC、M4A形式、最大50MB。Podcast配信にも使用されます。
                </p>
              </div>
            </div>

            {/* 公開設定 */}
            <div className="pt-6 border-t border-gray-200">
              <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={article.published}
                  onChange={(e) => setArticle({ ...article, published: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-semibold text-gray-900">この記事を公開する</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    チェックを入れると、サイトに記事が表示されます
                  </p>
                </div>
              </label>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
