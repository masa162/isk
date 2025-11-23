/**
 * ランダムな英数字のスラグを生成
 * @param length スラグの長さ（デフォルト: 5）
 * @returns ランダムな英数字文字列（例: a7k3m）
 */
export function generateRandomSlug(length: number = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let slug = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    slug += chars[randomIndex]
  }

  return slug
}
