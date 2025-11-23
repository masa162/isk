import { Hono } from 'hono'
import type { Env } from './types'

// ルートのインポート
import { indexRoute } from './routes/index'
import { articlesRoute } from './routes/articles'
import { staticRoute } from './routes/static'
import { adminRoute } from './routes/admin'

const app = new Hono<{ Bindings: Env }>()

// 静的CSSの配信
app.get('/styles.css', (c) => {
  const css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 20px 0;
    }

    header h1 {
      font-size: 28px;
      margin-bottom: 5px;
    }

    header p {
      color: #666;
      font-size: 14px;
    }

    nav {
      margin-top: 15px;
    }

    nav a {
      margin-right: 20px;
      color: #0066cc;
      text-decoration: none;
    }

    nav a:hover {
      text-decoration: underline;
    }

    main {
      padding: 40px 0;
    }

    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .article-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .article-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .article-card h3 {
      margin-bottom: 10px;
      font-size: 20px;
    }

    .article-card a {
      color: #333;
      text-decoration: none;
    }

    .article-meta {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }

    .category {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-right: 8px;
    }

    .tag {
      display: inline-block;
      background: #f5f5f5;
      color: #666;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-right: 8px;
    }

    footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 20px 0;
      margin-top: 40px;
    }

    footer a {
      color: white;
      text-decoration: underline;
    }

    .prose {
      max-width: 800px;
      margin: 0 auto;
    }

    .prose h1 { font-size: 32px; margin: 30px 0 20px; }
    .prose h2 { font-size: 28px; margin: 25px 0 15px; }
    .prose h3 { font-size: 24px; margin: 20px 0 10px; }
    .prose p { margin-bottom: 15px; }
    .prose ul, .prose ol { margin-left: 30px; margin-bottom: 15px; }
    .prose blockquote {
      border-left: 4px solid #ddd;
      padding-left: 20px;
      color: #666;
      margin: 20px 0;
    }
    .prose code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
    .prose pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 20px 0;
    }
  `
  return c.text(css, 200, { 'Content-Type': 'text/css' })
})

// ルート登録
app.route('/', indexRoute)
app.route('/articles', articlesRoute)
app.route('/admin', adminRoute)
app.route('/', staticRoute)

export default app
