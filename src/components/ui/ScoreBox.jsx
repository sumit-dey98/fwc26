import { cn } from '@utils/cn'

export default function ScoreBox({ value, isLive }) {
  return (
    <div
      className={cn(
        'w-7 h-7 flex items-center justify-center tabular',
        'border border-navy-600 bg-navy-800',
        'font-display text-lg tracking-wider',
        isLive  ? 'text-white animate-live-blink' : 'text-finished'
      )}
    >
      {value ?? '-'}
    </div>
  )
}
