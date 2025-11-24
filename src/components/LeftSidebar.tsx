import type { FC } from 'hono/jsx'

export const LeftSidebar: FC = () => {
  return (
    <aside class="left-sidebar sticky top-5 h-fit bg-white rounded-lg p-5 shadow-sm max-lg:fixed max-lg:top-0 max-lg:-left-[280px] max-lg:h-screen max-lg:w-[260px] max-lg:z-[1000] max-lg:transition-[left] max-lg:duration-300 max-lg:overflow-y-auto [&.mobile-open]:max-lg:left-0">
      <div class="flex flex-col gap-[5px]">
        <div class="mb-[5px]">
          <h2 class="text-2xl mb-[5px]"><a href="/" class="text-[#333] no-underline">医スク！</a></h2>
          <p class="text-[13px] text-[#666] mb-[25px]">薬剤師による医学記事解説 + Podcast 🎧</p>
        </div>

        <nav class="flex flex-col gap-[5px]">
          <a href="/articles" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">📚</span>
            <span class="text-[15px]">記事一覧</span>
          </a>
          <a href="/profile" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">👤</span>
            <span class="text-[15px]">プロフィール</span>
          </a>
          <a href="/sitemap" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">🗺️</span>
            <span class="text-[15px]">サイトマップ</span>
          </a>
          <a href="/payment" class="flex items-center gap-[10px] px-3 py-[10px] rounded-md text-[#333] no-underline transition-colors hover:bg-[#f5f5f5]">
            <span class="text-lg">📝</span>
            <span class="text-[15px]">お申し込み</span>
          </a>
        </nav>
      </div>
    </aside>
  )
}
