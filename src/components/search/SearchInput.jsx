import { Search } from 'lucide-react'
import { useApp } from '@context/AppContext'

export default function SearchInput({ inputRef }) {
  const { searchQuery, setSearch } = useApp()
  return (
    <div className="flex items-center gap-2 flex-1">
      <Search size={16} className="text-gold-500 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams, matches, stadiums..."
        className="flex-1 bg-transparent text-white text-sm placeholder-navy-500/60 outline-none"
      />
    </div>
  )
}
