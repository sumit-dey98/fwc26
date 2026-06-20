import { useState, useEffect } from 'react'
import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import { useStadiumImage } from '@hooks/useStadiumImage'
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react'

const COUNTRIES = [
  { key: 'USA', label: 'USA', flagClass: 'fi fi-us' },
  { key: 'Mexico', label: 'Mexico', flagClass: 'fi fi-mx' },
  { key: 'Canada', label: 'Canada', flagClass: 'fi fi-ca' },
]

export default function StadiumsView() {
  const { fixtures, stadiums = [], targetStadiumId, clearStadiumTarget } = useApp()
  const [country, setCountry] = useState('USA')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!targetStadiumId || stadiums.length === 0) return
    const target = stadiums.find(s => s.id === targetStadiumId)
    if (!target) { clearStadiumTarget(); return }

    const siblings = stadiums.filter(s => s.country === target.country)
    const targetIdx = siblings.findIndex(s => s.id === target.id)

    setCountry(target.country)
    setIdx(targetIdx >= 0 ? targetIdx : 0)
    clearStadiumTarget()
  }, [targetStadiumId, stadiums, clearStadiumTarget])

  const countryStadiums = stadiums.filter(s => s.country === country)
  const stadium = countryStadiums[idx] ?? countryStadiums[0]

  const prev = () => setIdx(i => (i - 1 + countryStadiums.length) % countryStadiums.length)
  const next = () => setIdx(i => (i + 1) % countryStadiums.length)

  const switchCountry = (c) => { setCountry(c); setIdx(0) }

  const matches = fixtures.filter(f => f.stadium === stadium?.name)

  const { imageUrl, loading: imageLoading } = useStadiumImage(stadium?.name)

  return (
    <div className="animate-fade-in">
      <div className="flex border-b border-navy-700">
        {COUNTRIES.map(c => (
          <button
            key={c.key}
            onClick={() => switchCountry(c.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5',
              'font-label text-base font-bold uppercase tracking-widest transition-colors border-b-2',
              country === c.key ? 'text-gold-500 border-gold-500' : 'text-content-muted border-transparent hover:text-gold-400'
            )}
          >
            <span className={cn(c.flagClass, 'fi')} style={{ fontSize: 14 }} />
            {c.label}
          </button>
        ))}
      </div>

      {countryStadiums.length === 0 && (
        <div className="px-4 py-12 text-center text-content-muted text-sm">Loading stadiums...</div>
      )}

      {stadium && (
        <div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-navy-700">
            <button onClick={prev} disabled={countryStadiums.length <= 1}
              className="p-1 text-content-muted hover:text-gold-400 disabled:opacity-30 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="font-label text-xs font-semibold text-content-secondary tracking-widest uppercase">
              {idx + 1} / {countryStadiums.length}
            </span>
            <button onClick={next} disabled={countryStadiums.length <= 1}
              className="p-1 text-content-muted hover:text-gold-400 disabled:opacity-30 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex justify-center gap-1.5 py-2">
            {countryStadiums.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={cn('w-1.5 h-1.5 rounded-full transition-colors',
                  i === idx ? 'bg-gold-500' : 'bg-navy-600 hover:bg-navy-500')} />
            ))}
          </div>

          <div className="animate-fade-in flex flex-col 2xl:flex-row" key={stadium.id}>
           
            <div className="md:h-[80vh] !aspect-video max-w-6xl bg-navy-700 border-b border-navy-600 relative overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={stadium.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Building2 size={40} className={imageLoading ? 'animate-pulse text-navy-600' : 'text-content-muted'} />
                  <span className="font-label text-xs text-navy-600 uppercase tracking-widest">
                    {imageLoading ? 'Loading...' : stadium.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="p-4 sm:p-5 border-b border-navy-700">
                <h3 className="font-display text-4xl text-gold-500 tracking-wider mb-1">{stadium.name}</h3>
                <p className="text-xl text-white mb-0.5">
                  {stadium.city}{stadium.state ? `, ${stadium.state}` : ''}
                </p>
                {/* <p className="text-base text-white/80">{stadium.country}</p> */}
                {/* {stadium.officialName && (
                  <p className="text-sm text-white/80 mt-1 italic">FIFA NAME: {stadium.officialName}</p>
                )} */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="bg-navy-800 border border-navy-600 px-3 py-2">
                    <p className="font-label text-sm font-semibold uppercase tracking-widest text-content-muted mb-0.5">Capacity</p>
                    <p className="font-display text-xl text-white tracking-wider">{stadium.capacity.toLocaleString()}</p>
                  </div>
                  <div className="bg-navy-800 border border-navy-600 px-3 py-2">
                    <p className="font-label text-sm font-semibold uppercase tracking-widest text-content-muted mb-0.5">Matches</p>
                    <p className="font-display text-xl text-white tracking-wider">{matches.length}</p>
                  </div>
                </div>
              </div>

              {matches.length > 0 && (
                <div className="p-4 sm:p-5">
                  <p className="text-sm underline underline-offset-2 font-bold uppercase tracking-widest text-gold-500 mb-3">Schedule</p>
                  <div className="space-y-1 overflow-y-auto pr-1">
                    {matches.map(f => (
                      <div key={f.matchNumber} className="flex items-center gap-3 py-1.5 border-b border-navy-800 last:border-0">
                        <span className="text-xs text-content-muted w-20 flex-shrink-0">{f.date}</span>
                        <span className="text-sm text-content-secondary flex-1 truncate">
                          {f.homeTeam} vs {f.awayTeam}
                        </span>
                        {f.status === 'finished' && f.score && (
                          <span className="text-xs tabular text-content-muted">
                            {f.score.home}–{f.score.away}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}