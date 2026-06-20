import { Building2 } from 'lucide-react'
import { useSearch } from '@hooks/useSearch'
import { useApp } from '@context/AppContext'
import Flag from '@components/ui/Flag'
import { cn } from '@utils/cn'

export default function SearchResults({ onClose }) {
  const { results, hasResults, searchQuery } = useSearch()
  const { setTab, setGroup, openModal, openTeamModal, goToStadium } = useApp()

  if (searchQuery.length < 2) {
    return <div className="px-4 py-6 text-xs text-navy-500/60 italic">Type at least 2 characters to search</div>
  }

  if (!hasResults) {
    return <div className="px-4 py-6 text-xs text-navy-500/60 italic">No results for "{searchQuery}"</div>
  }

  return (
    <div>
      {results.teams.length > 0 && (
        <Section label="Teams">
          {results.teams.map(t => (
            <ResultRow
              key={t.code}
              icon={<Flag teamName={t.name} size={15} />}
              primary={t.name}
              secondary={`Group ${t.group} · FIFA #${t.fifaRank}`}
              onClick={() => { setTab('teams'); openTeamModal(t.code); onClose() }}
            />
          ))}
        </Section>
      )}

      {results.matches.length > 0 && (
        <Section label="Matches">
          {results.matches.map(f => (
            <ResultRow
              key={f.matchNumber}
              icon={<span className="text-content-muted text-xs">M{f.matchNumber}</span>}
              primary={`${f.homeTeam} vs ${f.awayTeam}`}
              secondary={`${f.date} · ${f.stadium}`}
              onClick={() => { setTab(f.stage === 'group-stage' ? 'group' : 'r32'); openModal(f.matchNumber); onClose() }}

            />
          ))}
        </Section>
      )}

      {results.stadiums.length > 0 && (
        <Section label="Stadiums">
          {results.stadiums.map(s => (
            <ResultRow
              key={s.id}
              icon={<Building2 size={14} className="text-content-muted" />}
              primary={s.name}
              secondary={`${s.city} · ${s.capacity.toLocaleString()} cap.`}
              onClick={() => { goToStadium(s.id); onClose() }}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div>
      <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-navy-800 bg-gold-500 border-b border-navy-700">
        {label}
      </div> 
      {children}
    </div>
  )
}

function ResultRow({ icon, primary, secondary, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 border-b border-navy-800 hover:bg-navy-700 transition-colors text-left gloss"
    >
      <div className="flex-shrink-0 w-6 flex items-center justify-center">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{primary}</p>
        <p className="text-2xs text-content-muted truncate">{secondary}</p>
      </div>
    </button>
  )
}
