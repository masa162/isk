広く、一般寄りに向きながらの医学記事解説
自身の、薬剤師としてのキャリアを半分活かしたい
「isuku」
ブログを開発します、

https://github.com/masa162/isk
にて新規リポジトリをつくりました。

/Users/nakayamamasayuki/Documents/github/isk
にてクロンしてあります、

nextjsのフルスタックフレームワーク
cloudflare　環境
pages/workers/R2/D1
を利用
Belong2jazz@gmail.com's Account
ID
c677241d7d66ff80103bab9f142128ab

記事更新の管理画面
basic認証でwebから記事更新する
id mn
pass 39

まず要件定義を詰めていきましょう
他に決めておくべきことヒアリングしてください

シンプルなもので構いません、
ただ、記事更新に加えて、
音声での解説、mp3uploadしたい、
記事にpodcast形式でのメディアをつけたい


フロントカスタムドメイン
https://isk.masa86.com/

R2カスタムドメイン
isk-media.masa86.com

それぞれ設定しました。


デプロイ反映されました。
https://isk.masa86.com/admin/articles/new
フィードバックします

スラッグ (URL) *
は自動発番してほしい

aac形式（m4a）の音源をupできない


保存に失敗しました
と表示される

デプロイ反映されました。
https://isk.masa86.com/admin/articles/new
フィードバックします

aac形式（m4a）の音源を選べるようになりました
”アップロードに失敗しました”
とｍでます

保存押すと
”保存に失敗しました: Internal Server Error”
とでます


デプロイ反映されました。
https://isk.masa86.com/admin/articles/new
フィードバックします

記事保存できました。
しかし、フロントに表示できません。
TOPにタイトルはあるが、
記事詳細ページが開かない

音源
アップロードに失敗しました: File upload requires R2 configuration

デプロイ反映されました。
https://isk.masa86.com/admin
フィードバックします


音源uploadできました。

記事保存できましたが、
記事詳細ページにアクセスできません


デプロイ反映されました。
https://isk.masa86.com/admin
フィードバックします

記事公開にチェックしました。

しかし、フロントで記事詳細ページにいかないですね

cloudflareに
Workers & Pages

にpagesはデプロイされてるけど、
バックエンドがまだworkersにデプロイされてないようですね、
デプロイお願いします
wrangler CLI許可します