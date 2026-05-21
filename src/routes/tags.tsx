import { Hono } from 'hono'
import type { Env } from '../types'
import { Layout } from '../components/Layout'
import { ArticleRepository } from '../db/articles'

export const tagsRoute = new Hono<{ Bindings: Env }>()

tagsRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  const tags = await repo.getTagsWithCount()

  // 使用数でグループ分け
  const frequent = tags.filter(t => t.count >= 3)
  const others = tags.filter(t => t.count < 3)

  return c.html(
    <Layout
      title="タグ一覧"
      description="医スク！のタグ一覧。テーマごとに記事を横断検索できます。"
      url="https://isk.masa86.com/tags"
      ga4MeasurementId={c.env.GA4_MEASUREMENT_ID}
    >
      <h2 style="margin-bottom: 8px;">🏷️ タグ一覧</h2>
      <p style="color: #666; font-size: 14px; margin-bottom: 32px;">
        タグをクリックすると関連記事を一覧表示します。
      </p>

      {frequent.length > 0 && (
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">よく使われるタグ</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            {frequent.map(({ tag, count }) => (
              <a
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                style={`
                  display: inline-flex; align-items: center; gap: 6px;
                  padding: 6px 14px; border-radius: 20px;
                  background: #f0f4ff; border: 1px solid #c7d2fe;
                  text-decoration: none; color: #3730a3;
                  font-size: ${Math.min(15, 12 + count)}px;
                  transition: all 0.15s;
                `}
                onmouseover="this.style.background='#3730a3';this.style.color='white'"
                onmouseout="this.style.background='#f0f4ff';this.style.color='#3730a3'"
              >
                #{tag}
                <span style="font-size: 11px; opacity: 0.7;">{count}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h3 style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">その他のタグ</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            {others.map(({ tag, count }) => (
              <a
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 16px; background: #f5f5f5; border: 1px solid #e5e5e5; text-decoration: none; color: #555; font-size: 12px; transition: all 0.15s;"
                onmouseover="this.style.background='#333';this.style.color='white'"
                onmouseout="this.style.background='#f5f5f5';this.style.color='#555'"
              >
                #{tag}
                <span style="font-size: 10px; opacity: 0.6;">{count}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
})
