// Cloudflare環境の型定義
export type Env = {
  DB: D1Database
  R2: R2Bucket
  SITE_URL: string
  R2_PUBLIC_URL: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
}

// 記事の型定義
export type Article = {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: string
  tags?: string[]
  audio_url?: string
  published: number
  created_at: string
  updated_at: string
}

// データベースから取得した記事（tagsはJSON文字列）
export type ArticleRow = Omit<Article, 'tags'> & {
  tags?: string
}

// 記事作成・更新用の入力型
export type ArticleInput = Omit<Article, 'id' | 'created_at' | 'updated_at'>

// 記事検索パラメータ
export type ArticleSearchParams = {
  published?: boolean
  category?: string
  q?: string
  limit?: number
  offset?: number
}
