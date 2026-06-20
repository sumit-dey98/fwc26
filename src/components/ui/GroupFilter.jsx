import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import { Star, CalendarDays } from 'lucide-react'
import { localDate } from '@utils/dateTime'

const GROUPS = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function GroupFilter() {
  const { selectedGroup, setGroup, favoriteTeam, timezone } = useApp()

  const goToToday = () => {
    const headers = Array.from(document.querySelectorAll('[data-date-header]'))
    if (headers.length === 0) return

    const today = localDate(new Date(), timezone)
    const dates = headers.map(el => el.getAttribute('data-date-header')).sort()

    const target = dates.find(d => d >= today) ?? dates[dates.length - 1]
    const el = headers.find(h => h.getAttribute('data-date-header') === target)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex gap-1.5 flex-wrap px-4 py-3 border-b border-navy-700">
      {GROUPS.map(g => (
        <button
          key={g}
          onClick={() => setGroup(g)}
          className={cn(
            'w-9 h-8 font-label text-sm font-semibold uppercase tracking-widest transition-colors duration-150 gloss',
            'border',
            selectedGroup === g
              ? 'bg-gold-500 text-navy-950 border-gold-500'
              : 'bg-navy-800 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
          )}
        >
          {g}
        </button>
      ))}
      {favoriteTeam && (
        <button
          onClick={() => setGroup('Fav')}
          aria-label="Filter by favorite team"
          className={cn(
            'w-9 h-8 flex items-center justify-center transition-colors duration-150 gloss border',
            selectedGroup === 'Fav'
              ? 'bg-gold-500 text-navy-950 border-gold-500'
              : 'bg-navy-800 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
          )}
        >
          <Star size={14} fill={selectedGroup === 'Fav' ? 'currentColor' : 'none'} />
        </button>
      )}
      <button
        onClick={goToToday}
        aria-label="Jump to today"
        className="w-9 h-8 flex items-center justify-center transition-colors duration-150 gloss border bg-navy-800 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400"
      >
        <CalendarDays size={14} />
      </button>
    </div>
  )
}