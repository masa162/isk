import type { FC } from 'hono/jsx'

const SERIES = [
  {
    label: '植物学',
    category: '植物学',
    img: 'https://img.tokyo86.com/7cccfc.webp',
  },
  {
    label: '漢方学',
    category: '漢方学',
    img: 'https://img.tokyo86.com/8b3973.webp',
  },
  {
    label: '薬理学',
    category: '薬理学',
    img: 'https://img.tokyo86.com/unbw7f/002.webp',
  },
  {
    label: '基礎栄養学',
    category: '基礎栄養学',
    img: 'https://img.tokyo86.com/unbw7f/001.webp',
  },
  {
    label: 'たなおろし医療時評',
    category: 'たなおろし医療時評',
    img: 'https://img.tokyo86.com/0d5424.webp',
  },
  {
    label: '論文クラシックス',
    category: '論文クラシックス',
    img: 'https://img.tokyo86.com/bd051b.webp',
  },
  {
    label: '限界日本医療',
    category: '限界日本医療',
    img: 'https://img.tokyo86.com/b3377e.webp',
  },
]

export const LeftSidebar: FC = () => {
  return (
    <aside class="left-sidebar fixed top-0 -left-[280px] h-screen w-[260px] z-[1000] transition-[left] duration-300 overflow-y-auto bg-white p-5 shadow-sm [&.mobile-open]:left-0 lg:sticky lg:top-5 lg:left-auto lg:h-fit lg:w-auto lg:z-auto lg:transition-none lg:overflow-visible lg:rounded-lg">
      <div class="flex flex-col gap-[5px]">
        <div class="mb-[5px]">
          <h2 class="text-2xl mb-[5px]"><a href="/" class="text-[#333] no-underline">医スク！</a></h2>
          <p class="text-[13px] text-[#666] mb-[15px]">薬剤師による医学記事解説 + Podcast 🎧</p>
        </div>

        <nav class="flex flex-col gap-[5px]">
          <a href="/articles" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">📚</span>
            <span class="text-[15px]">記事一覧</span>
          </a>
          <a href="/tags" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">🏷️</span>
            <span class="text-[15px]">タグ一覧</span>
          </a>
          <a href="/profile" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">👤</span>
            <span class="text-[15px]">プロフィール</span>
          </a>
          <a href="/payment" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">📝</span>
            <span class="text-[15px]">お申し込み</span>
          </a>
        </nav>

        <div style="margin-top: 16px; position: relative;">
          <div style="display: flex; gap: 6px;">
            <input
              id="sidebar-search"
              type="text"
              placeholder="記事を検索..."
              autocomplete="off"
              style="flex: 1; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none;"
            />
            <button
              type="button"
              style="padding: 8px 10px; background: #333; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;"
            >🔍</button>
          </div>
          <div id="search-dropdown" style="display:none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; margin-top: 4px; overflow: hidden;"></div>
        </div>

        <div id="today-section" style="margin-top: 24px; display: none;">
          <p class="text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-2 px-1" id="today-label">今日の記事</p>
          <div id="today-list"></div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          // カテゴリトグル
          let catLoaded = false;
          function toggleCat() {
            const list = document.getElementById('cat-list');
            const arrow = document.getElementById('cat-arrow');
            const isOpen = list.style.display !== 'none';
            if (isOpen) {
              list.style.display = 'none';
              arrow.style.transform = '';
            } else {
              list.style.display = 'block';
              arrow.style.transform = 'rotate(90deg)';
              if (!catLoaded) {
                catLoaded = true;
                fetch('/api/categories-public').then(r => r.json()).then(data => {
                  const pills = document.getElementById('cat-pills');
                  pills.innerHTML = data.categories.map(cat => \`
                    <a href="/articles?category=\${encodeURIComponent(cat)}"
                       style="font-size:11px;padding:3px 8px;border:1px solid #ddd;border-radius:12px;text-decoration:none;color:#555;white-space:nowrap;"
                       onmouseover="this.style.background='#333';this.style.color='white'"
                       onmouseout="this.style.background='';this.style.color='#555'"
                    >\${cat}</a>
                  \`).join('');
                }).catch(() => {});
              }
            }
          }

          // インクリメンタルサーチ
          (function() {
            const input = document.getElementById('sidebar-search');
            const dropdown = document.getElementById('search-dropdown');
            let timer;

            input.addEventListener('input', function() {
              clearTimeout(timer);
              const q = this.value.trim();
              if (q.length < 2) { dropdown.style.display = 'none'; return; }
              timer = setTimeout(async () => {
                const res = await fetch('/api/search?q=' + encodeURIComponent(q));
                const data = await res.json();
                if (!data.articles.length) { dropdown.style.display = 'none'; return; }
                dropdown.innerHTML = data.articles.map(a => \`
                  <a href="/articles/\${a.slug}" style="display:flex;align-items:center;gap:8px;padding:8px 10px;text-decoration:none;color:#333;border-bottom:1px solid #f0f0f0;font-size:12px;transition:background 0.15s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">
                    <img src="\${a.image_url || 'https://img.tokyo86.com/7cccfc.webp'}" style="width:36px;height:36px;object-fit:cover;border-radius:4px;flex-shrink:0;" onerror="this.src='https://img.tokyo86.com/7cccfc.webp'" />
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${a.title}</span>
                  </a>
                \`).join('');
                dropdown.style.display = 'block';
              }, 300);
            });

            document.addEventListener('click', function(e) {
              if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
              }
            });
          })();

          // 今日はなんの日
          (async function() {
            try {
              const res = await fetch('/api/today');
              const data = await res.json();
              if (!data.articles.length) return;
              const section = document.getElementById('today-section');
              const label = document.getElementById('today-label');
              const list = document.getElementById('today-list');
              label.textContent = data.isToday ? '📅 今日公開の記事' : '🎲 おすすめの記事';
              // 1件だけ表示
          const a = data.articles[0];
          list.innerHTML = \`
                <a href="/articles/\${a.slug}" style="display:block;text-decoration:none;color:#333;border-radius:6px;overflow:hidden;border:1px solid #eee;">
                  <img src="\${a.image_url || 'https://img.tokyo86.com/7cccfc.webp'}" style="width:100%;height:80px;object-fit:cover;display:block;" onerror="this.src='https://img.tokyo86.com/7cccfc.webp'" />
                  <div style="padding:8px;font-size:12px;line-height:1.5;color:#333;font-weight:500;">\${a.title}</div>
                </a>
              \`;
              section.style.display = 'block';
            } catch(e) {}
          })();
        `}} />


        <div style="margin-top: 48px;">
          <button
            id="cat-toggle"
            onclick="toggleCat()"
            style="display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:0 2px;"
          >
            <span style="font-size:13px;">📁</span>
            <span style="font-size:13px;color:#555;font-weight:600;">カテゴリ</span>
            <span id="cat-arrow" style="font-size:10px;color:#999;transition:transform 0.2s;margin-left:2px;">▶</span>
          </button>
          <div id="cat-list" style="display:none;margin-top:8px;">
            <div id="cat-pills" style="display:flex;flex-wrap:wrap;gap:6px;padding:0 2px;"></div>
          </div>
        </div>

        <div style="margin-top: 48px;">
          <p class="text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-2 px-1">Podcast</p>
          <div class="flex flex-col gap-[4px]">
            <a
              href="https://www.amazon.co.jp/医スク！-Podcast/dp/B0G4W3BLNP"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]"
            >
              <span class="text-lg">🎧</span>
              <span class="text-[13px]">Amazon Music</span>
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PL9Dcp97v0C204zYwp2RNFQqInCGrmcJP7"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-[10px] px-3 py-[8px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]"
            >
              <span class="text-lg">▶️</span>
              <span class="text-[13px]">YouTube</span>
            </a>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <p class="text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-2 px-1">連載シリーズ</p>
          <div class="flex flex-col" style="gap: 12px;">
            {SERIES.map(s => (
              <a
                href={`/articles?category=${encodeURIComponent(s.category)}`}
                class="no-underline"
                style="display: block; border-radius: 6px; overflow: hidden; height: 44px;"
              >
                <img
                  src={s.img}
                  alt={s.label}
                  style="width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.2s;"
                  onmouseover="this.style.opacity='0.85'"
                  onmouseout="this.style.opacity='1'"
                  onerror={`this.src='https://img.tokyo86.com/7cccfc.webp'`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
