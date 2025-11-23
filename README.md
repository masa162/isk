# 医スク！(iskn) - 薬剤師による医学記事解説サイト

Hono + Cloudflare Workers で構築された医学記事解説ブログ + Podcast 配信サイト

## 技術スタック

- **Webフレームワーク**: [Hono](https://hono.dev/)
- **ランタイム**: Cloudflare Workers
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2
- **言語**: TypeScript
- **Markdown**: markdown-it

## セットアップ

### 必要な環境

- Node.js 20+
- npm
- Cloudflare アカウント
- wrangler CLI

### インストール

```bash
npm install
```

### ローカル開発

```bash
npm run dev
```

http://localhost:8787 でアクセス可能

### デプロイ

```bash
npm run deploy
```

## 環境変数の設定

### ローカル開発用

`.dev.vars` ファイルを作成（gitignore対象）：

```
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
SITE_URL=http://localhost:8787
R2_PUBLIC_URL=https://isk-media.masa86.com
```

### 本番環境用

Wrangler で秘密情報を設定：

```bash
wrangler secret put ADMIN_USERNAME
wrangler secret put ADMIN_PASSWORD
```

## プロジェクト構造

```
src/
├── index.tsx              # アプリエントリーポイント
├── types.ts               # 型定義
├── routes/                # ルート定義
│   ├── index.tsx          # トップページ
│   ├── articles.tsx       # 記事関連
│   ├── admin.tsx          # 管理画面
│   └── static.tsx         # 静的ページ
├── db/                    # データベース操作
│   └── articles.ts        # 記事リポジトリ
└── components/            # UIコンポーネント
    └── Layout.tsx         # 共通レイアウト
```

## 機能

### フロントエンド（公開側）

- トップページ（記事一覧・カテゴリフィルター）
- 記事詳細ページ（Markdown表示・音声プレイヤー）
- プロフィールページ
- 免責事項ページ
- Aboutページ
- サイトマップ

### 管理画面 (`/admin`)

- Basic認証で保護
- 記事一覧・作成・編集・削除
- Markdownエディタ
- カテゴリ・タグ管理
- 公開/下書き管理

## データベース

既存の D1 データベース (`isk-db`) を使用：

- `articles` テーブル: 記事データ
- `articles_fts` テーブル: 全文検索インデックス

## ストレージ

既存の R2 バケット (`isk-media`) を使用：

- 音声ファイル: `/audio/*.mp3`
- 公開URL: https://isk-media.masa86.com

## 管理画面へのアクセス

https://isk.masa86.com/admin

## ライセンス

ISC

## 作成者

中山正之（薬剤師・メディカルライター）
