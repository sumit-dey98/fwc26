import { WifiOff } from 'lucide-react'
import { useApp } from '@context/AppContext'

export default function OfflineBanner() {
  const { isOffline, usingCachedData } = useApp()
  if (!isOffline && !usingCachedData) return null

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border-b border-red-500/30 text-xs text-red-400 flex-shrink-0">
      <WifiOff size='1.4em' />
      {isOffline
        ? "You're offline. Showing last saved schedule"
        : 'Live data unavailable. Showing last saved schedule'}
    </div>
  )
}