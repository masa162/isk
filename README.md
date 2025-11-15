# isuku - 医学記事解説ブログ + Podcast

薬剤師による一般向け医学記事解説サイト。Markdown形式での記事投稿と、MP3音声ファイルによるPodcast形式の解説に対応。

## 技術スタック

- **フロントエンド**: Next.js 16 (Pages Router) + TypeScript + Tailwind CSS
- **ホスティング**: Cloudflare Pages
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2 (音声ファイル・画像)
- **認証**: Basic認証 (Next.js Middleware)

## 機能

### 管理画面 (`/admin`)
- Basic認証 (ID: `mn`, Password: `39`)
- 記事の作成・編集・削除
- Markdownエディタ
- MP3音声ファイルアップロード
- カテゴリ・タグ管理
- 公開/下書き管理

### フロントエンド
- 記事一覧・詳細ページ
- カテゴリフィルター
- 記事検索 (全文検索)
- 音声プレイヤー (HTML5 audio)
- レスポンシブデザイン

## ローカル開発

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. 環境変数の設定

\`.env.local\` ファイルを作成:

\`\`\`env
ADMIN_USERNAME=mn
ADMIN_PASSWORD=39
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. 開発サーバー起動

\`\`\`bash
npm run dev
\`\`\`

http://localhost:3000 でアクセス可能

- フロントエンド: http://localhost:3000
- 管理画面: http://localhost:3000/admin

## Cloudflare デプロイ

### 1. D1 データベース作成

\`\`\`bash
npx wrangler d1 create isuku-db
\`\`\`

出力された `database_id` を `wrangler.toml` に設定:

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "isuku-db"
database_id = "YOUR_DATABASE_ID_HERE"
\`\`\`

### 2. スキーマ初期化

\`\`\`bash
npx wrangler d1 execute isuku-db --file=./db/schema.sql
\`\`\`

### 3. R2 バケット作成

\`\`\`bash
npx wrangler r2 bucket create isuku-media
\`\`\`

### 4. Cloudflare Pages デプロイ

1. GitHubリポジトリをCloudflare Pagesに連携
2. ビルド設定:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Node version**: 20

3. 環境変数を設定:
   - `ADMIN_USERNAME`: `mn`
   - `ADMIN_PASSWORD`: `39`
   - `NEXT_PUBLIC_SITE_URL`: あなたのドメイン

4. D1とR2のバインディングを設定
   - D1: `DB` → `isuku-db`
   - R2: `R2` → `isuku-media`

## プロジェクト構成

\`\`\`
/
├── src/
│   ├── components/       # Reactコンポーネント
│   │   ├── ArticleCard.tsx
│   │   └── AudioPlayer.tsx
│   ├── lib/             # ユーティリティ
│   │   └── db.ts        # データベースアクセス
│   ├── pages/           # Next.js Pages
│   │   ├── api/         # APIルート
│   │   ├── admin/       # 管理画面
│   │   ├── articles/    # 記事詳細ページ
│   │   └── index.tsx    # トップページ
│   ├── styles/          # CSS
│   ├── types/           # TypeScript型定義
│   └── middleware.ts    # Basic認証
├── db/
│   └── schema.sql       # D1スキーマ
├── public/              # 静的ファイル
├── wrangler.toml        # Cloudflare設定
└── package.json
\`\`\`

## ビルドについて

このプロジェクトは `@cloudflare/next-on-pages` を使用してCloudflare Pages向けにビルドされます:

- **ローカルビルド**: `npm run build` (通常のNext.jsビルド)
- **Cloudflare Pages用ビルド**: `npm run pages:build`
- **ローカルプレビュー**: `npm run preview` (wranglerを使用)

## 注意事項

- Cloudflare D1/R2のバインディングは `getRequestContext()` 経由でアクセスします
- ローカル開発では、D1/R2へのアクセスはモック実装となっています
- 本番環境では、Cloudflare Pagesの設定でD1/R2バインディングを必ず設定してください

## ライセンス

ISC
