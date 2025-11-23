# 医スク！(isuku) - 要件定義書

## プロジェクト概要

薬剤師による医学記事解説ブログ + Podcast 配信サイト

- **サイト名**: 医スク！(isuku)
- **URL**: https://isk.masa86.com
- **管理者**: 中山正之（薬剤師・メディカルライター）

## 技術スタック

### フレームワーク・インフラ
- **Webフレームワーク**: Hono (TypeScript)
- **ランタイム**: Cloudflare Workers
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2 (音声ファイル・画像)
- **デプロイ**: Cloudflare Pages / Workers
- **バージョン管理**: Git / GitHub

### フロントエンド
- **テンプレート**: Hono JSX
- **スタイリング**: 素の CSS（シンプル・軽量）
- **Markdown**: markdown-it または marked
- **シンタックスハイライト**: highlight.js (必要に応じて)

### 開発環境
- **言語**: TypeScript
- **パッケージマネージャー**: npm
- **ローカル開発**: wrangler dev
- **リポジトリ**: https://github.com/masa162/iskn

## 機能要件

### 1. フロントエンド（公開側）

#### 1.1 トップページ (`/`)
- 公開記事の一覧表示（カード形式）
- カテゴリ別フィルター機能
- 全文検索機能（タイトル・本文から検索）
- 音声解説の有無をアイコンで表示（🎧）
- レスポンシブデザイン（スマホ・タブレット・PC対応）

**表示情報:**
- 記事タイトル
- カテゴリ
- タグ
- 投稿日
- 抜粋（excerpt）
- 音声解説の有無

#### 1.2 記事詳細ページ (`/articles/:slug`)
- Markdown 形式の記事本文をHTMLレンダリング
- 目次 (TOC) の自動生成（H2, H3, H4から生成）
- カテゴリ・タグの表示
- 投稿日の表示
- 音声プレイヤー（音声ファイルがある場合）
- HTML5 `<audio>` タグで再生
- 記事一覧へ戻るリンク

**Markdown サポート機能:**
- 見出し（H1～H6）
- リスト（順序付き・順序なし）
- 引用（blockquote）
- コードブロック
- 太字・斜体・打ち消し線
- リンク
- 画像（R2経由）

#### 1.3 プロフィールページ (`/profile`)
- 管理者（中山正之）の自己紹介
- 経歴・ミッション・提供価値の説明
- 固定コンテンツ

#### 1.4 免責事項・利用規約ページ (`/disclaimer`)
- 医療行為ではないことの明示
- 医療機関の受診について
- 医薬品・サプリメントの提案について
- 情報の正確性と学術的根拠
- 損害賠償の免責

#### 1.5 Aboutページ (`/about`)
- サイトの概要・目的
- 薬剤師によるエビデンスベースの解説
- 固定コンテンツ

#### 1.6 サイトマップページ (`/sitemap`)
- メインページへのリンク一覧
- 記事一覧（カテゴリ別）
- HTML形式のサイトマップ

#### 1.7 共通要素
- **ヘッダー**:
  - サイトロゴ・タイトル
  - ナビゲーションメニュー（ホーム・記事一覧・プロフィール・サイトマップ・About）
  - 検索ボックス（モバイルは折りたたみ可能）

- **フッター**:
  - 著作権表示
  - 免責事項へのリンク
  - シンプルなデザイン

### 2. 管理画面（`/admin/*`）

#### 2.1 認証
- Basic認証（ユーザー名・パスワード）
- 環境変数で認証情報を管理
- 認証成功後、管理画面へアクセス可能

**認証情報:**
- ユーザー名: `ADMIN_USERNAME`（環境変数）
- パスワード: `ADMIN_PASSWORD`（環境変数）

#### 2.2 記事管理 (`/admin/articles`)

**記事一覧:**
- 全記事の一覧表示（公開・下書き含む）
- ステータス表示（公開/下書き）
- 編集・削除ボタン
- 新規記事作成ボタン

**記事作成・編集 (`/admin/articles/new`, `/admin/articles/:id/edit`):**
- タイトル入力
- スラグ（URL）入力（自動生成も可能）
- カテゴリ選択・入力
- タグ入力（カンマ区切り）
- 本文入力（Markdownエディタ）
  - シンプルなテキストエリア
  - プレビュー機能（任意）
- 抜粋（excerpt）入力
- 音声ファイルアップロード（R2へアップロード）
- 公開/下書きの選択
- 保存ボタン・キャンセルボタン

**記事削除:**
- 確認ダイアログ表示
- 削除実行

#### 2.3 音声ファイル管理
- R2バケットへのアップロード
- 対応形式: MP3, AAC, M4A
- アップロード後、記事に紐付け

### 3. データベース（D1）

#### 3.1 テーブル構成

**articles テーブル:**
```sql
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags TEXT,  -- JSON配列として保存 ["tag1", "tag2"]
  audio_url TEXT,  -- R2のパス
  published INTEGER DEFAULT 0,  -- 0: 下書き, 1: 公開
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_category ON articles(category);
```

**全文検索テーブル（FTS5）:**
```sql
CREATE VIRTUAL TABLE articles_fts USING fts5(
  title,
  content,
  content=articles,
  content_rowid=id
);
```

### 4. ストレージ（R2）

#### 4.1 バケット構成
- **バケット名**: `isk-media`
- **音声ファイルパス**: `/audio/:filename.mp3`
- **画像ファイルパス**: `/images/:filename` (将来対応)

#### 4.2 公開URL
- `https://isk-media.masa86.com/audio/:filename.mp3`

### 5. 環境変数

**必須環境変数:**
```
ADMIN_USERNAME=<管理者ユーザー名>
ADMIN_PASSWORD=<管理者パスワード>
SITE_URL=https://isk.masa86.com
R2_PUBLIC_URL=https://isk-media.masa86.com
```

**Cloudflare バインディング:**
- `DB`: D1データベース（`isk-db`）
- `R2`: R2バケット（`isk-media`）

## 非機能要件

### パフォーマンス
- ページ読み込み時間: 3秒以内（モバイル）
- Time to First Byte (TTFB): 200ms以内
- Cloudflare Workers の Edge ロケーションで配信

### セキュリティ
- 管理画面は Basic 認証で保護
- XSS 対策（ユーザー入力のサニタイズ）
- SQL インジェクション対策（プリペアドステートメント）
- HTTPS 必須

### SEO
- 適切な `<title>` タグ
- メタディスクリプション
- セマンティック HTML
- レスポンシブデザイン
- Google Analytics 4 (GA4) 対応（既存設定継承）

### アクセシビリティ
- セマンティック HTML タグの使用
- alt属性の適切な設定
- キーボード操作可能

### ブラウザ対応
- Chrome, Firefox, Safari, Edge（最新版）
- iOS Safari, Android Chrome（モバイル）

## UI/UX 要件

### デザイン方針
- **シンプル・読みやすさ重視**
- 素の CSS で軽量に実装
- 必要に応じて自然言語で調整可能
- モバイルファースト

### カラースキーム（参考）
- プライマリカラー: ブルー系（医療・信頼感）
- テキスト: ダークグレー（読みやすさ）
- 背景: ホワイト・ライトグレー

### タイポグラフィ
- システムフォント使用（読み込み速度優先）
- 本文: 16px以上
- 行間: 1.6-1.8

## 移行計画

### 既存サイト（Next.js）からのデータ移行
1. **D1データベース**: 既存のデータベースをそのまま使用
   - データベースID: `cafa2521-13d3-4ecd-b2dc-99837877487d`
   - テーブルスキーマは互換性あり

2. **R2ストレージ**: 既存の音声ファイルをそのまま使用
   - バケット名: `isk-media`

3. **静的コンテンツ**: プロフィール・免責事項などのテキストを再利用

### デプロイ手順
1. Hono プロジェクトの開発・テスト
2. Cloudflare Workers にデプロイ
3. カスタムドメイン設定（`isk.masa86.com`）
4. 動作確認
5. 旧サイト（Next.js）からの切り替え

## 成功指標

- デプロイエラーゼロ
- ページ読み込み速度向上
- 管理画面からの記事投稿が問題なく動作
- 既存記事が正常に表示される
- 音声プレイヤーが正常に動作

## 将来の拡張性

### Phase 2（将来対応）
- RSS フィード
- コメント機能
- 記事のお気に入り機能
- タグクラウド
- 関連記事の表示
- OGP画像の自動生成
- Podcast RSS フィード配信

## 参考資料

- Hono 公式ドキュメント: https://hono.dev/
- Cloudflare Workers ドキュメント: https://developers.cloudflare.com/workers/
- Cloudflare D1 ドキュメント: https://developers.cloudflare.com/d1/
- Cloudflare R2 ドキュメント: https://developers.cloudflare.com/r2/
