import type { Env } from '@/types/env'

export const runtime = 'edge'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: Request, context: { env: Env }) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const env = context.env

  try {
    const contentType = req.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return Response.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
    }

    // FormDataとして解析
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // ファイルサイズチェック (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return Response.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    // MIMEタイプチェック
    if (!file.type.includes('audio/') && !file.type.includes('image/')) {
      return Response.json({ error: 'Only audio and image files are allowed' }, { status: 400 })
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
      return Response.json({ url: publicUrl, key: fileKey }, { status: 200 })
    } else {
      // Edge環境ではローカルファイルシステムにアクセスできないため、
      // 開発環境ではR2を使用するか、別のストレージサービスを利用する必要があります
      return Response.json({
        error: 'File upload requires R2 configuration',
        message: 'Please configure Cloudflare R2 for file uploads'
      }, { status: 501 })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed', message: error.message }, { status: 500 })
  }
}
