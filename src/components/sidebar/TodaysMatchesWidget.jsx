import { useApp } from '@context/AppContext'
import MatchCard from '@components/match/MatchCard'
import Loader from '@components/ui/Loader'
import { todayFixtures, liveFixtures } from '@utils/fixtures'

export default function TodaysMatchesWidget() {
  const { fixtures, timezone, isLoading } = useApp()
  const live  = liveFixtures(fixtures).map(f => f.matchNumber)
  const today = todayFixtures(fixtures, timezone).filter(f => !live.includes(f.matchNumber))

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-3 py-2 flex items-center gap-2 border-b border-navy-700 flex-shrink-0 bg-navy-600">
        <span className="text-lg font-bold font-label uppercase text-gold-500">Today's Matches</span>
        {today.length > 0 && (
          <span className="ml-auto text-xs bg-navy-900 p-1 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold !leading-none">{today.length}</span>
        )}
      </div>
      {isLoading ? (
        <Loader label="Loading..." />
      ) : today.length === 0 ? (
          <div className="px-3 py-4 text-xs text-navy-500/80 italic">No more matches today</div>
      ) : (
        <div className="overflow-y-auto flex-1 pb-2">
          {today.map(f => <MatchCard key={f.matchNumber} fixture={f} />)}
        </div>
      )}
    </div>
  )
}
