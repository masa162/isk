export interface Env {
  DB: D1Database
  R2: R2Bucket
  NEXT_PUBLIC_SITE_URL: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
}

// Augment CloudflareEnv in global scope for @cloudflare/next-on-pages
declare global {
  interface CloudflareEnv extends Env {}
}
