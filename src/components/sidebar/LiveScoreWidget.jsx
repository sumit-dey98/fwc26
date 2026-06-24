import { useApp } from '@context/AppContext'
import MatchCard from '@components/match/MatchCard'
import Loader from '@components/ui/Loader'
import { liveFixtures } from '@utils/fixtures'

export default function LiveScoreWidget() {
  const { fixtures, isLoading } = useApp()
  const live = liveFixtures(fixtures)

  return (
    <div className="flex flex-col border-b border-navy-700 flex-1 lg:h-[27dvh]" style={{ flex: live.length ? '0 0 auto' : '0 0 60px' }}>
      <div className="px-3 py-2 flex items-center gap-2 border-b border-navy-700 flex-shrink-0 bg-navy-600">
        <span className="w-3 h-3 rounded-full bg-live animate-live-pulse flex-shrink-0 mt-1" />
        <span className="text-lg font-bold font-label uppercase text-gold-500">Live Now</span>
        {/* {live.length > 0 && (
          <span className="ml-auto text-2xs font-bold text-live animate-live-blink">{live.length}</span>
        )} */}
      </div>
      {isLoading ? (
        <Loader label="Loading..." />
      ) : live.length === 0 ? (
        <div className="px-3 py-4 text-xs text-navy-500/80 italic">No live matches</div>
      ) : (
        <div className="overflow-y-auto">
          {live.map(f => <MatchCard key={f.matchNumber} fixture={f} />)}
        </div>
      )}
    </div>
  )
}
