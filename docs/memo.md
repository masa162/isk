/Users/nakayamamasayuki/Documents/github/iskn

#　免責
https://isk.masa86.com/disclaimer
ドラフトをもとに作成お願いします
/Users/nakayamamasayuki/Documents/github/iskn/docs/memo免責事項ドラフト.md

#　プロフィール
https://isk.masa86.com/profile


/Users/nakayamamasayuki/Documents/github/iskn/docs/memoprof.md
もとにお願いします


***
#　HERO画像
/Users/nakayamamasayuki/Documents/github/iskn/temp/Generated Image November 24, 2025 - 11_34AM.webp
置きました。

やり取りでわたすため、
/Users/nakayamamasayuki/Documents/github/iskn/temp
をつくりましたが、これは
gitignoreにいれておいて

hero画像、正しいディレクトリに格納、リネームなどしてください


***

https://isk.masa86.com/
表示されてない、
自分でアクセスしてデバックして


***

左のサイドナビは最優先でどこでも表示したい、
TOP
https://isk.masa86.com/
のメイン領域に表示
  2. タイトルと説明文をオーバーレイしたHERO
****

新しいサイトマップの追加
https://isk.masa86.com/
送信されたサイトマップ
サイトマップ	型	送信	最終読み込み日時	ステータス	検出されたページ数	検出された動画数	
/sitemap	不明	2025/11/24	2025/11/24	1 件のエラー	0	0	
/sitemap.xml	不明	2025/11/24		取得できませんでした	0	0


肝心の個人コンサル申し込み
エンゲージメントまでのフローと
お申し込みページの作成など進めましょう、

必要だったら、ヒアリングしてください


回答
＞Stripeのアカウントあり
たしか、自分のgoogleアカウントで、副業イラスト販売用を意識して作ってある。投げ銭$5用の商品でたしかすでに使ってる。
このアカウントでいいのかな？


コミュニケーションツール:
＞LINE公式が良さそうですね、とくにこだわりありません

価格設定の腹積もり:
上記で完璧です、自分のイメージ通りです


stripe開きました。

dashboardがEnglishで操作しています、
createですかね？


漢方薬局だと、30000円／月
のコンサルは一般的です、商品としては、
月課金で商品を作成できました。
つづいて、これを作っておくと良いでしょうかね？


***

微調整します、
#　左ナビの「ホーム」
は削除


#　左ナビの「About」
は削除

#　「申し込み」ページ作成

＞各商品の決済ページ（stripe）
へのボタンを設置してリンク

パーソナル健康コンサルティング（相談 60分）
 (￥30,000 / 月)
https://buy.stripe.com/9B69AVdf837bbXZcnH3VC00


スポット健康相談（単発）
(￥30,000)
https://buy.stripe.com/fZu3cx1wqcHL1jl0EZ3VC01

***

お申し込み
signupにすると、ログイン機能のように感じるので、
paymentがいいですね


メールアドレス
個人のgoogleメール
以外に専用を用意すべきか悩みますね、
line公式でメインやりとりするとは思うのですが、
masa86.com
のカスタムドメインで
info@masa86.com
を発行して運用するのがいいのかな、

サブドメインで
isk.masa86.com
としてるのですが、
メールも
info@isk.masa86.com
とかで運用できるのでしょうか？
namecheapでレジストリ

DNSはcloudflare

メールサーバはlolipopを
契約して使ってます

SMtpkey
[REMOVED - シークレット情報のため削除]


***

設定できました。
でも、これでgmailを
個人のbelong2jazz
と
info@isk.masa86.com
で送信するか、
理解できていません、

受信自体は
belong2jazz@gmail.com
に届きますよね
これに返信したら、
belong2jazz@gmail.com
から返信してるようになる？


***

ごめん、書き間違えただけです、
info@masa86.com
で登録できてます


OK、設定できた。
info@masa86.com
から送信できるようになりました。

質問です

特定商取引法ページ作りましょうかね

販売業者
[あなたのお名前]
（屋号：ISK Consulting）

とありますが、実際個人事業主として登録してる屋号を使うべき？
→クリーンチェア
が個人事業名義です


# 特商法ページ
作成します。
/Users/nakayamamasayuki/Documents/github/iskn/docs/memo特商法.md
をもとに作成してください

slugはtokushouとしましょうか

フッタ、免責事項・利用規約　の横にリンクをつけてください


***
免責事項
https://isk.masa86.com/disclaimer

こことはページ、
URL、slugを分けておいたほうが良いでしょうか？



ここまでデプロイできました。

2. 接客準備：ヒアリングシート（問診票）の作成
以降は来週以降やっていきましょうか、
まずは、
OK,課金システムができたのは、
０→１
にしたのに等しい、

そして、もうこの最小限のシステムがオンラインに実装されています。

今晩から、ユーザーはわたしの商品を買うことができるのです


***

brevo


メールボックスをこれまで、lolipopのレンタルサーバに付帯している、メールサーバ機能を使ってたんですが、あんまつかってないのに、
200円／月
固定であることにもやもやしてて、
今回cloudflareとbrevoで自分のgmailで管理する方法を組んでみました。

メリット。デメリットあるなと感じました。

イニシャル連絡、正式連絡はメールかも知んないけどニュアンスのやり取りとかは、line公式でやるし、

メールはそんなに件数が多くない、わたしの今のプロジェクトだと、brevoでいいなと思えました。

その一方でメールボックスが別であるということは、
物理的、心理的にボックスがよくも悪くも全く分けて置けるのはいいですよね