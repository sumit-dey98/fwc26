import { cn } from '@utils/cn'

/** Generates a deterministic background color from a name */
function colorFromName(name = '') {
  const COLORS = [
    'bg-blue-900  text-blue-300',
    'bg-emerald-900 text-emerald-300',
    'bg-violet-900 text-violet-300',
    'bg-amber-900  text-amber-300',
    'bg-rose-900   text-rose-300',
    'bg-cyan-900   text-cyan-300',
  ]
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(p => p[0] ?? '').join('').toUpperCase()
}

export default function Avatar({ name = '', src, size = 32, className = '' }) {
  const dim = `${size}px`
  const color = colorFromName(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: dim, height: dim }}
        className={cn('object-cover flex-shrink-0', className)}
      />
    )
  }

  return (
    <div
      style={{ width: dim, height: dim, fontSize: size * 0.38 }}
      className={cn(
        'flex-shrink-0 flex items-center justify-center font-semibold',
        'rounded-full',
        color,
        className
      )}
    >
      {initials(name)}
    </div>
  )
}
