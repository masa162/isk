import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { href: '/', label: 'ホーム' },
    { href: '/articles', label: '記事一覧' },
    { href: '/sitemap', label: 'サイトマップ' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = router.pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
