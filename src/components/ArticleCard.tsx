import Link from 'next/link'
import { Article } from '@/types/article'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600">
            {article.title}
          </h2>
          {article.audio_url && (
            <span className="text-2xl ml-2">🎧</span>
          )}
        </div>

        {article.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {article.category && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {article.category}
            </span>
          )}
          {article.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
          <span className="text-gray-500 ml-auto">
            {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </Link>
  )
}
