interface AudioPlayerProps {
  audioUrl: string
  title: string
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎧</span>
        <h3 className="text-lg font-semibold text-gray-900">音声解説</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        この記事の内容を音声で解説しています
      </p>
      <audio
        controls
        className="w-full"
        preload="metadata"
        style={{ maxWidth: '100%' }}
      >
        <source src={audioUrl} type="audio/mpeg" />
        お使いのブラウザは音声再生に対応していません。
      </audio>
      <p className="text-xs text-gray-500 mt-2">
        {title} - Podcast形式
      </p>
    </div>
  )
}
