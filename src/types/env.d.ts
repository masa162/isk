export interface Env {
  DB: D1Database
  R2: R2Bucket
  NEXT_PUBLIC_SITE_URL: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
}

// Augment CloudflareEnv type for @cloudflare/next-on-pages
declare module '@cloudflare/next-on-pages' {
  interface CloudflareEnv extends Env {}
}
