import { useEffect, useRef } from 'react'
import { useApp } from '@context/AppContext'
import { X } from 'lucide-react'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'

export default function SearchModal() {
  const { toggleSearch } = useApp()
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
    const onKey = e => e.key === 'Escape' && toggleSearch()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleSearch])

  return (
    <div className="absolute inset-0 top-full h-[calc(100dvh-100%)] bg-navy-800 border-b border-navy-700 z-40 animate-slide-down flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-700 flex-shrink-0 bg-navy-900">
        <SearchInput inputRef={ref} />
      </div>
      <div className="overflow-y-auto flex-1 min-h-0">
        <SearchResults onClose={toggleSearch} />
      </div>
    </div>
  )
}