import { cn } from '@utils/cn'
import { Timer } from 'lucide-react'

export default function LiveBadge({ minute, size = 'md' }) {
  const sm = size === 'sm'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-bold uppercase tracking-widest',
        'text-live animate-live-blink',
        sm ? 'text-2xs px-1 py-0.5' : 'text-xs px-1.5 py-0.5',
      )}
    >
      <Timer
        className="text-live animate-live-pulse flex-shrink-0 mb-0.5"
        size={sm ? 10 : 14}
      />
      {minute != null ? `${minute}'` : 'Live'}
    </span>
  )
}
