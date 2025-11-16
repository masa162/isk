import { Fragment } from 'react'
import Link from 'next/link'
import SearchBox from './SearchBox'
import Navigation from './Navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Site Branding */}
          <Link href="/" className="block mb-6" onClick={onClose}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">isuku</h1>
            <p className="text-sm text-gray-600">
              薬剤師による医学記事解説 + Podcast 🎧
            </p>
          </Link>

          {/* Search */}
          <SearchBox />

          {/* Navigation */}
          <div onClick={onClose}>
            <Navigation />
          </div>
        </div>
      </aside>
    </>
  )
}
