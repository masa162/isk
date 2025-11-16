import Link from 'next/link'
import SearchBox from './SearchBox'
import Navigation from './Navigation'

export default function LeftSidebar() {
  return (
    <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
      <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Site Branding */}
          <Link href="/" className="block mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">isuku</h1>
            <p className="text-sm text-gray-600">
              薬剤師による医学記事解説 + Podcast 🎧
            </p>
          </Link>

          {/* Search */}
          <SearchBox />

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </aside>
  )
}
