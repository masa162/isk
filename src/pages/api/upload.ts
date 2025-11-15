import { NextApiRequest, NextApiResponse } from 'next'
import type { Env } from '@/types/env'

export const runtime = 'edge'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getEnv = (req: NextApiRequest): Env | undefined => {
  return (req as any).env
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const env = getEnv(req)

  try {
    // Edge Runtimeではformidableが使えないため、Request APIを使用
    const contentType = req.headers['content-type'] || ''

    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' })
    }

    // FormDataとして解析
    const formData = await (req as any).formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // ファイルサイズチェック (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 50MB limit' })
    }

    // MIMEタイプチェック
    if (!file.type.includes('audio/') && !file.type.includes('image/')) {
      return res.status(400).json({ error: 'Only audio and image files are allowed' })
    }

    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    const fileKey = `media/${fileName}`

    if (env?.R2) {
      // 本番環境: Cloudflare R2にアップロード
      await env.R2.put(fileKey, fileBuffer, {
        httpMetadata: {
          contentType: file.type || 'application/octet-stream',
        },
      })

      // R2の公開URLを返す
      const publicUrl = `https://isk-media.masa86.com/${fileKey}`
      return res.status(200).json({ url: publicUrl, key: fileKey })
    } else {
      // Edge環境ではローカルファイルシステムにアクセスできないため、
      // 開発環境ではR2を使用するか、別のストレージサービスを利用する必要があります
      return res.status(501).json({
        error: 'File upload requires R2 configuration',
        message: 'Please configure Cloudflare R2 for file uploads'
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Upload failed', message: error.message })
  }
}
