/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['pub-YOUR_R2_SUBDOMAIN.r2.dev'], // R2のドメインを後で設定
  },
}

module.exports = nextConfig
