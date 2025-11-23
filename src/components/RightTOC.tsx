import type { FC } from 'hono/jsx'
import type { TOCItem } from '../utils/toc'

type RightTOCProps = {
  items: TOCItem[]
}

export const RightTOC: FC<RightTOCProps> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <aside class="right-toc">
      <div class="toc-content">
        <h3 class="toc-title">目次</h3>
        <nav class="toc-nav">
          {items.map(item => (
            <a
              href={`#${item.id}`}
              class={`toc-item toc-level-${item.level}`}
              style={`padding-left: ${(item.level - 2) * 16}px`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
