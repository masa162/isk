import { Hono } from 'hono'
import type { Env } from './types'

// ルートのインポート
import { indexRoute } from './routes/index'
import { articlesRoute } from './routes/articles'
import { staticRoute } from './routes/static'
import { adminRoute } from './routes/admin'

const app = new Hono<{ Bindings: Env }>()

// 静的CSSの配信
// 静的CSSの配信はWrangler Assetsによって行われます
// app.get('/styles.css', ...) は削除されました

// ルート登録
app.route('/', indexRoute)
app.route('/articles', articlesRoute)
app.route('/admin', adminRoute)
app.route('/', staticRoute)

export default app
