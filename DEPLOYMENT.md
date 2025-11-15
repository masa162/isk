# Cloudflare Pages デプロイガイド

## 前提条件

- Cloudflareアカウント (Account ID: `c677241d7d66ff80103bab9f142128ab`)
- wrangler CLIインストール済み
- GitHubリポジトリ: https://github.com/masa162/isk

## 1. D1データベースのセットアップ

### データベース作成

```bash
npx wrangler d1 create isuku-db
```

出力例:
```
✅ Successfully created DB 'isuku-db'!

[[d1_databases]]
binding = "DB"
database_name = "isuku-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### wrangler.tomlの更新

出力された `database_id` を `wrangler.toml` に設定:

```toml
[[d1_databases]]
binding = "DB"
database_name = "isuku-db"
database_id = "ここにdatabase_idを貼り付け"
```

### スキーマの適用

```bash
npx wrangler d1 execute isuku-db --remote --file=./db/schema.sql
```

## 2. R2ストレージのセットアップ

### R2バケット作成

```bash
npx wrangler r2 bucket create isuku-media
```

### 公開URL設定

Cloudflare Dashboardで:
1. R2 → `isuku-media` バケットを開く
2. Settings → Public Access → Allow Access を有効化
3. 公開ドメインを確認 (例: `https://pub-xxxxx.r2.dev`)

### next.config.jsの更新

`next.config.js` の `images.domains` を更新:

```js
images: {
  domains: ['pub-xxxxx.r2.dev'], // 実際のR2ドメインに変更
},
```

## 3. Cloudflare Pagesプロジェクト作成

### GitHubリポジトリ連携

1. Cloudflare Dashboard → Pages → Create a project
2. Connect to Git → GitHub → `masa162/isk` を選択
3. ビルド設定:

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Node version: 20
```

### 環境変数設定

Settings → Environment variables:

**Production & Preview 両方に設定:**

| 変数名 | 値 |
|--------|-----|
| `ADMIN_USERNAME` | `mn` |
| `ADMIN_PASSWORD` | `39` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.pages.dev` |
| `NODE_VERSION` | `20` |

### バインディング設定

Settings → Functions → **Bindings**:

**D1 Database Bindings:**
- Variable name: `DB`
- D1 database: `isuku-db`

**R2 Bucket Bindings:**
- Variable name: `R2`
- R2 bucket: `isuku-media`

## 4. デプロイ

### 初回デプロイ

GitHubにpushすると自動的にデプロイが開始されます:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### デプロイ確認

Cloudflare Dashboard → Pages → `isk` プロジェクト → Deployments

デプロイが完了すると、以下のURLでアクセス可能:
- `https://isk.pages.dev` (または設定したカスタムドメイン)

## 5. カスタムドメイン設定 (オプション)

1. Pages → `isk` → Custom domains
2. Set up a custom domain
3. ドメイン名を入力 (例: `isuku.com`)
4. DNS設定をCloudflareに従って更新

## 6. 動作確認

### フロントエンド確認
- トップページ: `https://your-domain.pages.dev`
- 記事一覧が表示されることを確認

### 管理画面確認
1. `https://your-domain.pages.dev/admin` にアクセス
2. Basic認証プロンプトが表示される
3. ID: `mn`, Password: `39` でログイン
4. 管理画面が表示されることを確認

### テスト記事作成
1. 管理画面 → 新規記事作成
2. 以下の内容でテスト:
   - タイトル: テスト記事
   - スラッグ: test-article
   - カテゴリ: テスト
   - タグ: サンプル
   - 本文: Markdown形式で記述
   - 公開チェック
3. 保存後、トップページに表示されることを確認

## トラブルシューティング

### ビルドエラー

**エラー**: `Module not found`
→ `npm install` の実行を確認

**エラー**: `D1 binding not found`
→ バインディング設定を確認

### 管理画面にアクセスできない

- Basic認証の資格情報を確認
- ミドルウェアが正しく動作しているか確認
- ブラウザキャッシュをクリア

### 音声ファイルがアップロードできない

- R2バケットのバインディングを確認
- ファイルサイズ制限 (50MB) を確認
- R2の公開設定を確認

## メンテナンス

### データベースバックアップ

```bash
npx wrangler d1 export isuku-db --remote --output=backup.sql
```

### データベースリストア

```bash
npx wrangler d1 execute isuku-db --remote --file=backup.sql
```

### ログ確認

Cloudflare Dashboard → Pages → `isk` → Functions logs

## 次のステップ

- [ ] カスタムドメイン設定
- [ ] Google Analytics 設定
- [ ] RSS フィード追加
- [ ] サイトマップ生成
- [ ] OGP画像設定
