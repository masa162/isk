# Cloudflare Pages デプロイ設定

このプロジェクトを Cloudflare Pages にデプロイする手順です。

## Cloudflare Pages の設定

### 1. プロジェクトの作成

1. Cloudflare ダッシュボード (https://dash.cloudflare.com/) にログイン
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. GitHub リポジトリ `masa162/iskn` を選択

### 2. ビルド設定

**Framework preset:** なし（手動設定）

**Build command:**
```
npm install && npm run build
```

**Build output directory:**
```
dist
```

**Root directory:** (空欄)

**Node.js version:**
```
20
```

### 3. 環境変数

以下の環境変数を設定：

**本番環境 (Production):**
- `NODE_VERSION`: `20`
- `SITE_URL`: `https://isk.masa86.com`
- `R2_PUBLIC_URL`: `https://isk-media.masa86.com`

**秘密情報（Secrets）:**
- `ADMIN_USERNAME`: 管理画面のユーザー名
- `ADMIN_PASSWORD`: 管理画面のパスワード

### 4. バインディング設定

**D1 Database:**
- Variable name: `DB`
- D1 database: `isk-db` (既存のデータベース)
- Database ID: `cafa2521-13d3-4ecd-b2dc-99837877487d`

**R2 Bucket:**
- Variable name: `R2`
- R2 bucket: `isk-media` (既存のバケット)

### 5. カスタムドメイン設定

**ドメイン:** `isk.masa86.com`

Settings → Custom domains から設定

## デプロイフロー

1. `main` ブランチへの push で自動デプロイ
2. ビルドログで確認
3. デプロイ完了後、自動的にライブ環境に反映

## ローカル開発

```bash
# 開発サーバー起動
npm run dev

# http://localhost:8787 でアクセス
```

### ローカル環境変数

`.dev.vars` ファイルを作成（.gitignore で除外）：

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
SITE_URL=http://localhost:8787
R2_PUBLIC_URL=https://isk-media.masa86.com
```

## トラブルシューティング

### ビルドエラー

- Node.js バージョンを確認: `.node-version` ファイルで 20 を指定
- `npm install` が成功しているか確認
- ビルドログを確認

### バインディングエラー

- D1 データベースの ID が正しいか確認
- R2 バケット名が正しいか確認
- バインディングの変数名が `wrangler.toml` と一致しているか確認

### 認証エラー

- 環境変数 `ADMIN_USERNAME` と `ADMIN_PASSWORD` が設定されているか確認
- Secrets として設定されているか確認

## 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 ドキュメント](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 ドキュメント](https://developers.cloudflare.com/r2/)
- [Hono ドキュメント](https://hono.dev/)
