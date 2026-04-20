export type TOCItem = {
  id: string
  text: string
  level: number
}

/**
 * HTML文字列から見出し（h2, h3, h4）を抽出してTOCアイテムを生成
 */
export function extractHeadings(html: string): TOCItem[] {
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi
  const items: TOCItem[] = []
  const idCount: Record<string, number> = {}
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const baseId = generateId(text)
    const count = idCount[baseId] ?? 0
    const id = count === 0 ? baseId : `${baseId}-${count}`
    idCount[baseId] = count + 1

    items.push({ id, text, level })
  }

  return items
}

/**
 * テキストからアンカー用のIDを生成
 */
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\s-]/g, '') // 日本語文字と英数字のみ
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) // 最大50文字
}

/**
 * Markdown HTMLに見出しIDを自動挿入
 */
export function addHeadingIds(html: string): string {
  const idCount: Record<string, number> = {}
  return html.replace(/<h([2-4])>(.*?)<\/h\1>/gi, (_match, level, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim()
    const baseId = generateId(text)
    const count = idCount[baseId] ?? 0
    const id = count === 0 ? baseId : `${baseId}-${count}`
    idCount[baseId] = count + 1
    return `<h${level} id="${id}">${content}</h${level}>`
  })
}
