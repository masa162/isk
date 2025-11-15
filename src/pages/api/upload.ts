import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import type { Env } from '@/types/env'

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
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => {
        // MP3, 画像のみ許可
        return mimetype?.includes('audio/') || mimetype?.includes('image/') || false
      },
    })

    const [fields, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileBuffer = fs.readFileSync(file.filepath)
    const fileName = `${Date.now()}-${file.originalFilename}`
    const fileKey = `media/${fileName}`

    if (env?.R2) {
      // 本番環境: Cloudflare R2にアップロード
      await env.R2.put(fileKey, fileBuffer, {
        httpMetadata: {
          contentType: file.mimetype || 'application/octet-stream',
        },
      })

      // R2の公開URLを返す
      const publicUrl = `https://pub-YOUR_R2_SUBDOMAIN.r2.dev/${fileKey}`
      return res.status(200).json({ url: publicUrl, key: fileKey })
    } else {
      // ローカル開発: public/uploadsに保存
      const uploadDir = 'public/uploads'
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const localPath = `${uploadDir}/${fileName}`
      fs.writeFileSync(localPath, fileBuffer)

      const localUrl = `/uploads/${fileName}`
      return res.status(200).json({ url: localUrl, key: fileKey })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Upload failed', message: error.message })
  }
}
