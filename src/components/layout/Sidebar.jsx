import LiveScoreWidget from '@components/sidebar/LiveScoreWidget'
import TodaysMatchesWidget from '@components/sidebar/TodaysMatchesWidget'

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-sidebar flex-shrink-0 border-l border-navy-700 bg-navy-950 overflow-hidden">
      <LiveScoreWidget />
      <TodaysMatchesWidget />
    </aside>
  )
}
