import type { Article, ArticleRow, ArticleInput, ArticleSearchParams } from '../types'

export class ArticleRepository {
  constructor(private db: D1Database) {}

  // 記事を取得（ID or Slug）
  async get(idOrSlug: number | string): Promise<Article | null> {
    const isId = typeof idOrSlug === 'number'
    const query = isId
      ? 'SELECT * FROM articles WHERE id = ?'
      : 'SELECT * FROM articles WHERE slug = ?'

    const result = await this.db.prepare(query).bind(idOrSlug).first<ArticleRow>()

    if (!result) return null
    return this.rowToArticle(result)
  }

  // 記事一覧を取得
  async list(params: ArticleSearchParams = {}): Promise<Article[]> {
    const {
      published,
      category,
      q,
      limit = 20,
      offset = 0
    } = params

    let query = 'SELECT * FROM articles WHERE 1=1'
    const bindings: (string | number)[] = []

    if (published !== undefined) {
      query += ' AND published = ?'
      bindings.push(published ? 1 : 0)
    }

    if (category) {
      query += ' AND category = ?'
      bindings.push(category)
    }

    if (q) {
      // 全文検索
      query = `
        SELECT a.* FROM articles a
        JOIN articles_fts fts ON a.id = fts.rowid
        WHERE fts MATCH ?
      `
      bindings.push(q)

      if (published !== undefined) {
        query += ' AND a.published = ?'
        bindings.push(published ? 1 : 0)
      }
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    bindings.push(limit, offset)

    const result = await this.db.prepare(query).bind(...bindings).all<ArticleRow>()
    return result.results.map(row => this.rowToArticle(row))
  }

  // 記事を作成
  async create(input: ArticleInput): Promise<Article> {
    const tagsJson = input.tags ? JSON.stringify(input.tags) : null

    const result = await this.db.prepare(`
      INSERT INTO articles (title, slug, content, excerpt, category, tags, audio_url, image_url, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      input.title,
      input.slug,
      input.content,
      input.excerpt || null,
      input.category || null,
      tagsJson,
      input.audio_url || null,
      input.image_url || null,
      input.published
    ).run()

    if (!result.success) {
      throw new Error('Failed to create article')
    }

    const id = result.meta.last_row_id
    const article = await this.get(id)
    if (!article) throw new Error('Failed to retrieve created article')

    return article
  }

  // 記事を更新
  async update(id: number, input: Partial<ArticleInput>): Promise<Article> {
    const fields: string[] = []
    const bindings: any[] = []

    if (input.title !== undefined) {
      fields.push('title = ?')
      bindings.push(input.title)
    }
    if (input.slug !== undefined) {
      fields.push('slug = ?')
      bindings.push(input.slug)
    }
    if (input.content !== undefined) {
      fields.push('content = ?')
      bindings.push(input.content)
    }
    if (input.excerpt !== undefined) {
      fields.push('excerpt = ?')
      bindings.push(input.excerpt || null)
    }
    if (input.category !== undefined) {
      fields.push('category = ?')
      bindings.push(input.category || null)
    }
    if (input.tags !== undefined) {
      fields.push('tags = ?')
      bindings.push(input.tags ? JSON.stringify(input.tags) : null)
    }
    if (input.audio_url !== undefined) {
      fields.push('audio_url = ?')
      bindings.push(input.audio_url || null)
    }
    if (input.image_url !== undefined) {
      fields.push('image_url = ?')
      bindings.push(input.image_url || null)
    }
    if (input.published !== undefined) {
      fields.push('published = ?')
      bindings.push(input.published)
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')

    bindings.push(id)

    await this.db.prepare(`
      UPDATE articles SET ${fields.join(', ')} WHERE id = ?
    `).bind(...bindings).run()

    const article = await this.get(id)
    if (!article) throw new Error('Failed to retrieve updated article')

    return article
  }

  // 記事を削除
  async delete(id: number): Promise<void> {
    await this.db.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
  }

  // DBの行データをArticle型に変換
  private rowToArticle(row: ArticleRow): Article {
    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }
  }

  // 記事数を取得（ページネーション用）
  async count(params: Pick<ArticleSearchParams, 'published' | 'category'> = {}): Promise<number> {
    let query = 'SELECT COUNT(*) as cnt FROM articles WHERE 1=1'
    const bindings: (string | number)[] = []

    if (params.published !== undefined) {
      query += ' AND published = ?'
      bindings.push(params.published ? 1 : 0)
    }
    if (params.category) {
      query += ' AND category = ?'
      bindings.push(params.category)
    }

    const result = await this.db.prepare(query).bind(...bindings).first<{ cnt: number }>()
    return result?.cnt ?? 0
  }

  // カテゴリ一覧を取得
  async getCategories(): Promise<string[]> {
    const result = await this.db.prepare(`
      SELECT DISTINCT category FROM articles
      WHERE category IS NOT NULL AND category != '' AND published = 1
      ORDER BY category
    `).all<{ category: string }>()

    return result.results.map(r => r.category)
  }
}
