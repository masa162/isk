import { Hono } from 'hono'
import type { Env } from '../types'
import { ArticleRepository } from '../db/articles'

export const feedRoute = new Hono<{ Bindings: Env }>()

feedRoute.get('/', async (c) => {
  const repo = new ArticleRepository(c.env.DB)
  
  // 公開済みの記事を取得
  const allArticles = await repo.list({
    published: true,
    limit: 100 // 最新100件を取得
  })

  // 音声ファイルがある記事のみをフィルタリング
  const podcastEpisodes = allArticles.filter(article => article.audio_url)

  const siteUrl = 'https://isk.masa86.com'
  const feedUrl = `${siteUrl}/feed.xml`
  const lastBuildDate = new Date().toUTCString()

  // RSS XMLの構築
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>医スク！ Podcast</title>
    <link>${siteUrl}</link>
    <description>薬剤師による最新の医学記事解説。医スク！の記事を音声でお届けします。</description>
    <language>ja</language>
    <copyright>Copyright ${new Date().getFullYear()} 医スク！</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <itunes:author>医スク！</itunes:author>
    <itunes:summary>薬剤師による最新の医学記事解説。医スク！の記事を音声でお届けします。</itunes:summary>
    <itunes:owner>
      <itunes:name>医スク！</itunes:name>
      <itunes:email>info@isk.masa86.com</itunes:email>
    </itunes:owner>
    <itunes:category text="Health &amp; Fitness">
      <itunes:category text="Medicine"/>
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${siteUrl}/podcast-cover.jpg"/>
    
    ${podcastEpisodes.map(episode => {
      const episodeUrl = `${siteUrl}/articles/${episode.slug}`
      const audioUrl = episode.audio_url?.startsWith('http') 
        ? episode.audio_url 
        : `${c.env.R2_PUBLIC_URL}${episode.audio_url}`
      const pubDate = new Date(episode.created_at).toUTCString()
      
      return `
    <item>
      <title><![CDATA[${episode.title}]]></title>
      <link>${episodeUrl}</link>
      <guid isPermaLink="true">${episodeUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${episode.excerpt || episode.title}]]></description>
      <enclosure url="${audioUrl}" length="0" type="audio/mpeg"/>
      <itunes:duration>0</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
    </item>`
    }).join('')}
  </channel>
</rss>`

  return c.text(rss, 200, {
    'Content-Type': 'application/xml; charset=UTF-8'
  })
})
