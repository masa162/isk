import TableOfContents from './TableOfContents'

interface RightSidebarProps {
  showTOC?: boolean
}

export default function RightSidebar({ showTOC = false }: RightSidebarProps) {
  if (!showTOC) return null

  return (
    <aside className="hidden xl:block xl:w-64 xl:flex-shrink-0">
      <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <TableOfContents />
        </div>
      </div>
    </aside>
  )
}
