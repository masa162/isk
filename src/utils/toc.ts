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
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim() // タグを除去
    const id = generateId(text)

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
  return html.replace(/<h([2-4])>(.*?)<\/h\1>/gi, (match, level, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim()
    const id = generateId(text)
    return `<h${level} id="${id}">${content}</h${level}>`
  })
}
