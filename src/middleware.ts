import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 管理画面のパスチェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    const auth = authHeader.split(' ')[1]
    const [username, password] = Buffer.from(auth, 'base64').toString().split(':')

    // 環境変数から認証情報を取得（デフォルト値: id=mn, pass=39）
    const validUsername = process.env.ADMIN_USERNAME || 'mn'
    const validPassword = process.env.ADMIN_PASSWORD || '39'

    if (username !== validUsername || password !== validPassword) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
