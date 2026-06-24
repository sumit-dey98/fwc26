import { X, Star } from 'lucide-react'
import { useApp } from '@context/AppContext'
import Flag from '@components/ui/Flag'
import Avatar from '@components/ui/Avatar'
import { teamFixtures } from '@utils/fixtures'
import { getDisplayName } from '@utils/teams'
import { useTeamSquad } from '@hooks/useSportsDb'
import { cn } from '@utils/cn'

const CONF_LABELS = {
  UEFA: 'UEFA', CONMEBOL: 'CONMEBOL', CAF: 'CAF',
  AFC: 'AFC', CONCACAF: 'CONCACAF', OFC: 'OFC',
}

export default function TeamModal({ team, onClose }) {
  const { fixtures, favoriteTeam, setFavorite } = useApp()
  const matches = teamFixtures(fixtures, team.name)
  const isFav = favoriteTeam === team.code
  const { squad, loading: squadLoading } = useTeamSquad(team.code, team.name)

  const POSITION_GROUPS = {
    Goalkeeper: squad.filter(p => p.position === 'Goalkeeper'),
    Defenders: squad.filter(p => p.position === 'Defenders'),
    Midfielders: squad.filter(p => p.position === 'Midfielders'),
    Forwards: squad.filter(p => p.position === 'Forwards'),
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] bg-navy-800 border border-navy-600 animate-slide-down flex flex-col mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700 flex-shrink-0 bg-gold-500">
          <span className="text-sm font-bold uppercase tracking-widest text-navy-900">Team Profile</span>
          <button onClick={onClose} className="text-navy-900 hover:text-navy-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body overflow-y-auto flex-1 min-h-0">
          <div className="px-5 py-5 border-b border-navy-700">
            <div className="flex items-center gap-4">
              <Flag teamName={team.name} size={52} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white font-display tracking-widest leading-none mt-1">
                  {getDisplayName(team.name)}
                </h2>
                <p className="text-sm text-gold-500 font-semibold">Group {team.group}</p>
                <p className="text-xs text-content-muted font-medium">{CONF_LABELS[team.confederation] ?? team.confederation}</p>
              </div>
              <div className="text-right">
                <p className="text-base text-content-muted font-label">FIFA Rank</p>
                <p className="text-2xl font-bold font-display text-gold-400">#{team.fifaRank}</p>
              </div>
            </div>
            <button
              onClick={() => { setFavorite(isFav ? null : team.code) }}
              className={cn(
                'mt-4 w-full py-2 text-2xs font-bold uppercase tracking-widest border transition-colors',
                isFav
                  ? 'border-gold-500 text-gold-500 bg-gold-500/10 hover:bg-gold-500/20'
                  : 'border-navy-600 text-content-muted hover:border-gold-500 hover:text-gold-400'
              )}
            >
              <span className="flex items-center justify-center gap-1.5 text-sm">
                <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'My Favorite Team' : 'Set as Favorite'}
              </span>
            </button>
          </div>

          <div className="px-5 py-4 border-b border-navy-700">
            <p className="text-sm underline underline-offset-2 font-bold uppercase tracking-widest text-gold-500 mb-3">Squad</p>
            {squadLoading ? (
              <p className="text-xs text-content-muted italic">Loading squad...</p>
            ) : squad.length === 0 ? (
              <p className="text-xs text-content-muted italic">Squad not yet announced</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(POSITION_GROUPS).map(([pos, players]) => (
                  <div key={pos} className="bg-navy-900/50 px-3 py-2 border border-navy-700">
                    <p className="text-sm text-content-muted mb-1.5">{pos}</p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {players.length === 0 ? (
                        <span className="text-2xs text-content-muted italic">—</span>
                      ) : players.map(p => (
                        <div key={p.name} className="flex items-center gap-2">
                          <Avatar name={p.name} src={p.photo} size={22} />
                          <span className="text-xs text-content-secondary truncate">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-b border-navy-700">
            <p className="text-sm underline underline-offset-2 font-bold uppercase tracking-widest text-gold-500 mb-3">Manager</p>
            <div className="flex items-center gap-3">
              <Avatar name="TBD" size={36} />
              <div>
                <p className="text-sm font-medium">TBD</p>
                <p className="text-2xs text-content-muted italic">Manager not yet confirmed</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm underline underline-offset-2 font-bold uppercase tracking-widest text-gold-500 mb-3">
              Tournament Schedule ({matches.length} matches)
            </p>
            {matches.map(f => {
              const isHome = f.homeTeam === team.name
              const opp = isHome ? f.awayTeam : f.homeTeam
              const gs = f.score
              const result = f.status === 'finished' && gs
                ? (isHome
                  ? (gs.home > gs.away ? 'W' : gs.home < gs.away ? 'L' : 'D')
                  : (gs.away > gs.home ? 'W' : gs.away < gs.home ? 'L' : 'D'))
                : null
              return (
                <div key={f.matchNumber} className="flex items-center gap-3 py-2 border-b border-navy-800 last:border-0">
                  <span className="text-xs text-content-muted w-20 flex-shrink-0">{f.date}</span>
                  <Flag teamName={opp} size={13} />
                  <span className="text-base tracking-wider font-display font-medium !leading-none break-words mt-1">
                    {getDisplayName(opp)}
                  </span>
                  {result && (
                    <span className={cn(
                      'text-xs font-bold mt-1 flex items-center justify-center',
                      result === 'W' ? 'text-emerald-400' : result === 'L' ? 'text-red-400' : 'text-content-secondary'
                    )}>
                      {result}
                    </span>
                  )}
                  {f.status === 'finished' && gs && (
                    <span className="text-xs tabular text-content-secondary mt-1">
                      {isHome ? `${gs.home}–${gs.away}` : `${gs.away}–${gs.home}`}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}