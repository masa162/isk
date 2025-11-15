import { Article, ArticleCreateInput, ArticleUpdateInput, ArticleSearchParams } from '@/types/article'

// ローカル開発用のモックDB（実際のD1は本番環境で使用）
let localArticles: Article[] = []
let nextId = 1

export class ArticleRepository {
  private db: D1Database | null

  constructor(db?: D1Database) {
    this.db = db || null
  }

  // 記事一覧取得
  async list(params: ArticleSearchParams = {}): Promise<Article[]> {
    const { category, tag, published, limit = 20, offset = 0, q } = params

    if (!this.db) {
      // ローカル開発用
      let filtered = [...localArticles]

      if (published !== undefined) {
        filtered = filtered.filter(a => a.published === published)
      }
      if (category) {
        filtered = filtered.filter(a => a.category === category)
      }
      if (tag && filtered.length > 0) {
        filtered = filtered.filter(a => a.tags?.includes(tag))
      }
      if (q) {
        const query = q.toLowerCase()
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query)
        )
      }

      return filtered
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(offset, offset + limit)
    }

    // 本番環境: D1を使用
    let sql = 'SELECT * FROM articles WHERE 1=1'
    const bindings: any[] = []

    if (published !== undefined) {
      sql += ' AND published = ?'
      bindings.push(published ? 1 : 0)
    }
    if (category) {
      sql += ' AND category = ?'
      bindings.push(category)
    }
    if (q) {
      // FTS検索を使用
      const ftsResult = await this.db
        .prepare('SELECT rowid FROM articles_fts WHERE articles_fts MATCH ?')
        .bind(q)
        .all()

      if (ftsResult.results.length > 0) {
        const ids = ftsResult.results.map((r: any) => r.rowid).join(',')
        sql += ` AND id IN (${ids})`
      } else {
        return []
      }
    }

    sql += ' ORDER BY published_at DESC, created_at DESC LIMIT ? OFFSET ?'
    bindings.push(limit, offset)

    const result = await this.db.prepare(sql).bind(...bindings).all()
    return result.results.map(this.parseArticle) as Article[]
  }

  // 記事取得（IDまたはslug）
  async get(idOrSlug: number | string): Promise<Article | null> {
    if (!this.db) {
      // ローカル開発用
      const article = typeof idOrSlug === 'number'
        ? localArticles.find(a => a.id === idOrSlug)
        : localArticles.find(a => a.slug === idOrSlug)
      return article || null
    }

    const column = typeof idOrSlug === 'number' ? 'id' : 'slug'
    const result = await this.db
      .prepare(`SELECT * FROM articles WHERE ${column} = ?`)
      .bind(idOrSlug)
      .first()

    return result ? this.parseArticle(result) : null
  }

  // 記事作成
  async create(input: ArticleCreateInput): Promise<Article> {
    const now = new Date().toISOString()
    const tags = input.tags ? JSON.stringify(input.tags) : null

    if (!this.db) {
      // ローカル開発用
      const article: Article = {
        id: nextId++,
        ...input,
        published: input.published || false,
        created_at: now,
        updated_at: now,
      }
      localArticles.push(article)
      return article
    }

    const result = await this.db
      .prepare(`
        INSERT INTO articles (title, slug, content, excerpt, category, tags, audio_url, published, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        input.title,
        input.slug,
        input.content,
        input.excerpt || null,
        input.category || null,
        tags,
        input.audio_url || null,
        input.published ? 1 : 0,
        input.published ? now : null,
        now,
        now
      )
      .run()

    const created = await this.get(result.meta.last_row_id)
    return created!
  }

  // 記事更新
  async update(input: ArticleUpdateInput): Promise<Article> {
    const now = new Date().toISOString()
    const tags = input.tags ? JSON.stringify(input.tags) : undefined

    if (!this.db) {
      // ローカル開発用
      const index = localArticles.findIndex(a => a.id === input.id)
      if (index === -1) throw new Error('Article not found')

      localArticles[index] = {
        ...localArticles[index],
        ...input,
        tags: input.tags || localArticles[index].tags,
        updated_at: now,
      }
      return localArticles[index]
    }

    const existing = await this.get(input.id)
    if (!existing) throw new Error('Article not found')

    const updates: string[] = []
    const bindings: any[] = []

    if (input.title !== undefined) {
      updates.push('title = ?')
      bindings.push(input.title)
    }
    if (input.slug !== undefined) {
      updates.push('slug = ?')
      bindings.push(input.slug)
    }
    if (input.content !== undefined) {
      updates.push('content = ?')
      bindings.push(input.content)
    }
    if (input.excerpt !== undefined) {
      updates.push('excerpt = ?')
      bindings.push(input.excerpt)
    }
    if (input.category !== undefined) {
      updates.push('category = ?')
      bindings.push(input.category)
    }
    if (tags !== undefined) {
      updates.push('tags = ?')
      bindings.push(tags)
    }
    if (input.audio_url !== undefined) {
      updates.push('audio_url = ?')
      bindings.push(input.audio_url)
    }
    if (input.published !== undefined) {
      updates.push('published = ?')
      bindings.push(input.published ? 1 : 0)
      if (input.published && !existing.published) {
        updates.push('published_at = ?')
        bindings.push(now)
      }
    }

    updates.push('updated_at = ?')
    bindings.push(now)
    bindings.push(input.id)

    await this.db
      .prepare(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...bindings)
      .run()

    const updated = await this.get(input.id)
    return updated!
  }

  // 記事削除
  async delete(id: number): Promise<void> {
    if (!this.db) {
      // ローカル開発用
      const index = localArticles.findIndex(a => a.id === id)
      if (index !== -1) {
        localArticles.splice(index, 1)
      }
      return
    }

    await this.db.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
  }

  // ヘルパー: DBレコードをArticle型に変換
  private parseArticle(record: any): Article {
    return {
      ...record,
      tags: record.tags ? JSON.parse(record.tags) : [],
      published: Boolean(record.published),
    }
  }
}
