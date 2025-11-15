export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: string
  tags?: string[] // JSONから変換後
  audio_url?: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface ArticleCreateInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: string
  tags?: string[]
  audio_url?: string
  published?: boolean
}

export interface ArticleUpdateInput extends Partial<ArticleCreateInput> {
  id: number
}

export interface ArticleSearchParams {
  q?: string // 検索クエリ
  category?: string
  tag?: string
  published?: boolean
  limit?: number
  offset?: number
}
