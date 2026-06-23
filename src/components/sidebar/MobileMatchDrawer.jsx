import { useRef, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import { liveFixtures, todayFixtures } from '@utils/fixtures'
import MatchCard from '@components/match/MatchCard'
import LiveScoreWidget from './LiveScoreWidget'
import TodaysMatchesWidget from './TodaysMatchesWidget'

const SWIPE_THRESHOLD = 100

export default function MobileMatchDrawer() {
  const { fixtures, timezone } = useApp()
  const [expanded, setExpanded] = useState(false)
  const touchStartY = useRef(null)

  const live = liveFixtures(fixtures)
  const liveIds = live.map(f => f.matchNumber)
  const upcoming = todayFixtures(fixtures, timezone).filter(f => !liveIds.includes(f.matchNumber))

  const handleTouchStart = e => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = e => {
    if (touchStartY.current == null) return
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    touchStartY.current = null
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return 
    e.preventDefault()
    setExpanded(deltaY < 0) 
  }

  return (
    <div
      className={cn(
        'lg:hidden flex-shrink-0 bg-navy-950 border-t border-navy-700',
        'overflow-hidden transition-[max-height] duration-300',
        expanded ? 'max-h-[70vh] flex flex-col' : 'max-h-[140px]'
      )}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full flex flex-col items-center gap-1 py-1.5 flex-shrink-0 bg-gold-500 border-b border-navy-800"
      >
        <span className="w-10 h-1 bg-gold-600" />
      </button>

      {expanded ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          <LiveScoreWidget />
          <TodaysMatchesWidget />
        </div>
      ) : live.length > 0 ? (
        <div className="flex overflow-x-auto pb-2">
          {live.map(f => (
            <div key={f.matchNumber} className="w-full lg:w-72 flex-shrink-0 border-r border-navy-800">
              <MatchCard fixture={f} />
            </div>
          ))}
        </div>
      ) : (
        <div className="pb-2 ">
              <p className="text-xs text-navy-500 italic p-4 bg-navy-800 font-medium">No live matches</p>
        </div>
      )}
    </div>
  )
}