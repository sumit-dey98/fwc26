import MatchRow from './MatchRow'
import MatchDropdownCard from './MatchDropdownCard'
import { useApp } from '@context/AppContext'

export default function MatchList({ fixtures, label }) {
  const { expandedMatchId } = useApp()

  if (!fixtures?.length) {
    return (
      <div className="px-4 py-12 text-center text-content-muted text-sm">
        No matches in this stage yet.
      </div>
    )
  }

  return (
    <div>
      {label && (
        <div className="px-4 py-2 text-2xs font-bold uppercase tracking-widest text-gold-500 border-b border-navy-700">
          {label}
        </div>
      )}
      {fixtures.map(f => (
        <div key={f.matchNumber}>
          <MatchRow fixture={f} />
          {expandedMatchId === f.matchNumber && (
            <MatchDropdownCard fixture={f} />
          )}
        </div>
      ))}
    </div>
  )
}
