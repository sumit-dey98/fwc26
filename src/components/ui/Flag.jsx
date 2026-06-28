import { useApp } from '@context/AppContext'
import { cn } from '@utils/cn'
import { flagClass } from '@utils/teams'

function parseSize(size) {
  if (typeof size === 'number') return { value: size, unit: 'px' }
  const match = String(size).match(/^(-?[\d.]+)(\D*)$/)
  if (!match) return { value: 20, unit: 'px' }
  return { value: parseFloat(match[1]), unit: match[2] || 'px' }
}

export default function Flag({ teamName, size = 20, className = '' }) {
  const { teamByName } = useApp()
  const team = teamByName[teamName]
  const { value, unit } = parseSize(size)
  const width = `${value}${unit}`
  const height = `${value * 0.6}${unit}`

  if (team?.flag) {
    return (
      <img
        src={team.flag}
        alt={teamName}
        crossOrigin="anonymous"
        style={{ width, height, objectFit: 'cover' }}
        className={cn('flex-shrink-0', className)}
      />
    )
  }

  // Fallback to flag-icons CSS sprites (mock mode)
  const cls = flagClass(teamName)
  return (
    <span
      className={cn('fi', cls, 'flex-shrink-0', className)}

      style={{ fontSize: width, lineHeight: 1 }}
      title={teamName}
    />
  )
}