import type { FC } from 'hono/jsx'

export const LeftSidebar: FC = () => {
  return (
    <aside class="left-sidebar fixed top-0 -left-[280px] h-screen w-[260px] z-[1000] transition-[left] duration-300 overflow-y-auto bg-white p-5 shadow-sm [&.mobile-open]:left-0 lg:sticky lg:top-5 lg:left-auto lg:h-fit lg:w-auto lg:z-auto lg:transition-none lg:overflow-visible lg:rounded-lg">
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
