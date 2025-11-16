import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the document
    const elements = Array.from(document.querySelectorAll('h2, h3, h4'))
    const headingData = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName[1]),
    }))
    setHeadings(headingData)

    // Observe which heading is currently visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-1">
      <h3 className="text-sm font-bold text-gray-900 mb-3">目次</h3>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`block text-sm py-1 transition-colors ${
            activeId === heading.id
              ? 'text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(heading.id)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}
