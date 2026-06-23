import { useState } from 'react'
import { X, Star, Search } from 'lucide-react'
import { useApp } from '@context/AppContext'
import TimezoneSelector from './TimezoneSelector'
import Flag from '@components/ui/Flag'
import { XCircle } from 'lucide-react'
import { cn } from '@utils/cn'

export default function SettingsDrawer({ isOpen, onClose }) {
  const { favoriteTeam, setFavorite, timezone, fontScale, setFontScale, teamByName } = useApp()

  const allTeams = Object.values(teamByName)
  const [teamSearch, setTeamSearch] = useState('')
  const filteredTeams = allTeams.filter(t =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase())
  )

  return (
    <div
      className={cn(
        'absolute inset-0 top-full h-[calc(100dvh-100%)] bg-navy-800 border-b border-navy-700 z-40 animate-slide-down overflow-y-auto',
        isOpen ? 'flex flex-col' : 'hidden'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-900">
        <span className="text-sm font-bold text-gold-500 uppercase tracking-wider">Preferences</span>
        {/* <button onClick={onClose} className="text-content-muted hover:text-white transition-colors">
          <X size={18} />
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-navy-900"> 
        <div className="border-b border-navy-900 md:border-b-0 ">
          <div className="px-4 py-3">
            <p className="text-base font-bold font-label uppercase tracking-widest text-content-muted mb-1">Timezone</p>
            <p className="text-xs text-gold-400">{timezone}</p>
          </div>
          <div className="px-4 pb-4">
            <TimezoneSelector inline />
          </div>
        </div>

        <div className="px-4 py-4 pt-0">
          <div className="py-3 px-1">
            <p className="text-base font-bold font-label uppercase tracking-wider text-content-muted mb-1">Favorite Team</p>
            <p className="text-xs text-navy-500">
              Your favorite team's matches are highlighted across the schedule.
            </p>
          </div>

          <div className="border border-navy-600 relative">
            <div className="flex items-center gap-2 border-b border-navy-600 px-3 bg-navy-900 h-11">
              <Search size={14} className="text-gold-400 flex-shrink-0" />
              <input
                type="text"
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                placeholder="Search team..."
                className="flex-1 bg-transparent py-2 text-sm text-white placeholder-content-muted outline-none"
              />
            </div>

            {favoriteTeam && (
              <div className="absolute inset-x-0 top-0 h-11 flex items-center gap-2 px-3 bg-navy-900 border-b border-gold-500/30 z-10">
                <Flag teamName={allTeams.find(t => t.code === favoriteTeam)?.name ?? ''} size={16} />
                <span className="text-sm font-bold text-gold-400 truncate">
                  {allTeams.find(t => t.code === favoriteTeam)?.name ?? favoriteTeam}
                </span>
                <button
                  onClick={() => setFavorite(null)}
                  className="ml-auto text-xs text-red-400 hover:text-red-500 transition-colors flex-shrink-0 leading-none"
                >
                  <XCircle size='1.5em' />
                </button>
              </div>
            )}

            <div className="overflow-y-auto max-h-[40vh] bg-black/10">
              {filteredTeams.length === 0 ? (
                <p className="px-3 py-3 text-xs text-content-muted italic">No teams found</p>
              ) : filteredTeams.map(t => (
                <button
                  key={t.code}
                  onClick={() => setFavorite(t.code)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2.5 border-b border-navy-800 last:border-0 transition-colors text-left',
                    favoriteTeam === t.code ? 'bg-gold-500/10 text-gold-400' : 'hover:bg-navy-700 text-white'
                  )}
                >
                  <Flag teamName={t.name} size={14} />
                  <span className="text-base tracking-wider font-display font-medium !leading-none break-words">{t.name}</span>
                  <span className="text-2xs text-navy-500">Group {t.group}</span>
                  {favoriteTeam === t.code && <Star size={11} fill="currentColor" className="text-gold-500 flex-shrink-0 -translate-y-[1px]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
     

      <div className="px-4 py-4 border-t border-navy-900">
        <p className="text-base font-bold font-label uppercase tracking-widest text-content-muted mb-3">Text Size</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'sm', label: 'S' },
            { id: 'md', label: 'M' },
            { id: 'lg', label: 'L' },
            { id: 'xl', label: 'XL' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFontScale(id)}
              className={cn(
                'py-2 font-label text-sm font-semibold border transition-colors',
                fontScale === id
                  ? 'bg-gold-500 text-navy-950 border-gold-500'
                  : 'bg-navy-900 text-content-muted border-navy-600 hover:border-gold-500 hover:text-gold-400'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-content-muted mt-2">Adjusts all interface text size</p>
      </div>

      <div className="px-4 py-4 border-t border-navy-900 mt-auto flex items-center justify-between flex-wrap gap-x-4">
        <p className="text-2xs text-navy-500/70">WC 2026 · Data: <a href="https://github.com/rezarahiminia/worldcup2026" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">worldcup26.ir</a> + <a href="https://www.thesportsdb.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">thesportsdb.com</a> + <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">wikipedia</a></p>
        <a href="https://dev-sumit.vercel.app/" className='text-2xs text-navy-500/80 undeline hover:text-gold-400 undeline'>&copy; Sumit Hillol Dey</a>
      </div>
    </div>
  )
}
