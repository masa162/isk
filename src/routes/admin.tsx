import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import type { Env } from '../types'
import { ArticleRepository } from '../db/articles'

export const adminRoute = new Hono<{ Bindings: Env }>()

// Basic認証ミドルウェア
adminRoute.use('*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.ADMIN_USERNAME || 'admin',
    password: c.env.ADMIN_PASSWORD || 'password'
  })
  return auth(c, next)
})

// 管理画面トップ（記事一覧）
adminRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const articles = await repo.list({ limit: 100 })

  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>管理画面 - 医スク！</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header>
        <div class="container">
          <h1>医スク！管理画面</h1>
          <nav>
            <a href="/">サイトトップへ</a>
            <a href="/admin">記事一覧</a>
            <a href="/admin/articles/new">新規作成</a>
          </nav>
        </div>
      </header>
      <main>
        <div class="container">
          <h2>記事一覧</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; margin-top: 20px;">
            <thead>
              <tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">
                <th style="padding: 10px; text-align: left;">タイトル</th>
                <th style="padding: 10px; text-align: left;">カテゴリ</th>
                <th style="padding: 10px; text-align: center;">ステータス</th>
                <th style="padding: 10px; text-align: center;">作成日</th>
                <th style="padding: 10px; text-align: center;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(article => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">${article.title}</td>
                  <td style="padding: 10px;">${article.category || '-'}</td>
                  <td style="padding: 10px; text-align: center;">
                    <span style="background: ${article.published ? '#4caf50' : '#ff9800'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                      ${article.published ? '公開' : '下書き'}
                    </span>
                  </td>
                  <td style="padding: 10px; text-align: center;">
                    ${new Date(article.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td style="padding: 10px; text-align: center;">
                    <a href="/admin/articles/${article.id}/edit" style="color: #0066cc; margin-right: 10px;">編集</a>
                    <a href="/articles/${article.slug}" target="_blank" style="color: #666;">プレビュー</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${articles.length === 0 ? '<p>記事がまだありません。</p>' : ''}
        </div>
      </main>
    </body>
    </html>
  `
  return c.html(html)
})

// 新規記事作成フォーム
adminRoute.get('/articles/new', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>新規記事作成 - 管理画面</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header>
        <div class="container">
          <h1>新規記事作成</h1>
          <nav>
            <a href="/admin">← 記事一覧に戻る</a>
          </nav>
        </div>
      </header>
      <main>
        <div class="container">
          <form method="POST" action="/admin/articles" style="background: white; padding: 30px; border-radius: 8px; max-width: 800px;">
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">タイトル *</label>
              <input type="text" name="title" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">スラグ（URL）*</label>
              <input type="text" name="slug" required placeholder="article-slug" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <small style="color: #666;">半角英数字とハイフンのみ</small>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">カテゴリ</label>
              <input type="text" name="category" placeholder="例: 薬学" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">タグ（カンマ区切り）</label>
              <input type="text" name="tags" placeholder="例: 漢方, 免疫, 論文解説" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">抜粋</label>
              <textarea name="excerpt" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">本文（Markdown）*</label>
              <textarea name="content" required rows="20" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;"></textarea>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">音声ファイルURL</label>
              <input type="text" name="audio_url" placeholder="/audio/filename.mp3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: flex; align-items: center;">
                <input type="checkbox" name="published" value="1" style="margin-right: 8px;">
                公開する
              </label>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="submit" style="background: #0066cc; color: white; padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer;">保存</button>
              <a href="/admin" style="padding: 12px 30px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; display: inline-block;">キャンセル</a>
            </div>
          </form>
        </div>
      </main>
    </body>
    </html>
  `
  return c.html(html)
})

// 記事作成処理
adminRoute.post('/articles', async (c) => {
  const formData = await c.req.parseBody()
  const repo = new ArticleRepository(c.env.DB)

  const tags = formData.tags
    ? String(formData.tags).split(',').map(t => t.trim()).filter(Boolean)
    : []

  const article = await repo.create({
    title: String(formData.title),
    slug: String(formData.slug),
    content: String(formData.content),
    excerpt: formData.excerpt ? String(formData.excerpt) : undefined,
    category: formData.category ? String(formData.category) : undefined,
    tags,
    audio_url: formData.audio_url ? String(formData.audio_url) : undefined,
    published: formData.published === '1' ? 1 : 0
  })

  return c.redirect('/admin')
})

// TODO: 編集・削除機能は後で実装
adminRoute.get('/articles/:id/edit', (c) => {
  return c.text('編集機能は準備中です')
})
