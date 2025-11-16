import Head from 'next/head'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - isuku</title>
        <meta name="description" content="isukuについて" />
      </Head>

      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About isuku</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">サイトについて</h2>
            <p className="text-gray-700 leading-relaxed">
              「isuku（医スク）」は、薬剤師による一般向け医学記事解説とPodcast配信を行うブログです。
              医学や薬学の専門知識を、わかりやすく解説することを目指しています。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">特徴</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>薬剤師による信頼性の高い医学情報</li>
              <li>一般の方にもわかりやすい解説</li>
              <li>記事の音声解説（Podcast）にも対応</li>
              <li>最新の医学・薬学トピックスを随時更新</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">免責事項</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトの情報は一般的な医学知識の提供を目的としており、個別の診断や治療の代わりとなるものではありません。
              健康に関する具体的な相談は、必ず医師や薬剤師などの専門家にご相談ください。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              サイトに関するお問い合わせは、各記事のコメント欄、
              またはSNSアカウントまでお気軽にどうぞ。
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
