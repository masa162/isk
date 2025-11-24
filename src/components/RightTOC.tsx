import type { FC } from 'hono/jsx'
import type { TOCItem } from '../utils/toc'

type RightTOCProps = {
  items: TOCItem[]
}

export const RightTOC: FC<RightTOCProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <aside class="right-toc sticky top-5 h-fit w-[240px] bg-white rounded-lg p-5 shadow-sm max-lg:hidden">
      <div>
        <h3 class="text-base font-bold mb-[15px] pb-[10px] border-b-2 border-[#e0e0e0]">目次</h3>
        <nav class="flex flex-col gap-2">
          {items.map(item => (
            <a
              href={`#${item.id}`}
              class={`block text-sm text-[#666] no-underline py-[6px] border-l-2 border-transparent pl-3 transition-all duration-200 hover:text-[#0066cc] hover:border-[#0066cc] ${item.level === 3 ? 'text-[13px]' : item.level === 4 ? 'text-xs text-[#999]' : ''}`}
              style={`padding-left: ${(item.level - 2) * 16 + 12}px`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
