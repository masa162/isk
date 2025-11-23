import type { FC } from 'hono/jsx'

export const LeftSidebar: FC = () => {
  return (
    <aside class="left-sidebar">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h2><a href="/" style="color: #333; text-decoration: none;">医スク！</a></h2>
          <p class="sidebar-tagline">薬剤師による医学記事解説 + Podcast 🎧</p>
        </div>

        <nav class="sidebar-nav">
          <a href="/" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span class="nav-label">ホーム</span>
          </a>
          <a href="/articles" class="nav-item">
            <span class="nav-icon">📚</span>
            <span class="nav-label">記事一覧</span>
          </a>
          <a href="/profile" class="nav-item">
            <span class="nav-icon">👤</span>
            <span class="nav-label">プロフィール</span>
          </a>
          <a href="/sitemap" class="nav-item">
            <span class="nav-icon">🗺️</span>
            <span class="nav-label">サイトマップ</span>
          </a>
          <a href="/about" class="nav-item">
            <span class="nav-icon">ℹ️</span>
            <span class="nav-label">About</span>
          </a>
        </nav>
      </div>
    </aside>
  )
}
