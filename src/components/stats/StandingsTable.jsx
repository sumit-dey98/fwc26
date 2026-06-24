import { computeGroupStandings } from '@utils/standings'
import Flag from '@components/ui/Flag'
import { cn } from '@utils/cn'

const COLS = ['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts']

const sticky = 'sticky z-10 bg-navy-600 transition-colors'

export default function StandingsTable({ fixtures }) {
  const rows = computeGroupStandings(fixtures)

  if (!rows.length) return (
    <div className="px-4 py-6 text-xs text-content-muted italic">No results yet</div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[560px]" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '28px' }} />   {/* # */}
          <col style={{ width: '28px' }} />   {/* Flag */}
          <col style={{ width: '140px' }} />  {/* Name */}
          {COLS.map(c => <col key={c} style={{ width: '48px' }} />)}
        </colgroup>

        <thead>
          <tr className="border-b border-navy-700 bg-navy-800">
            <th className={cn('px-2 py-2 font-label font-semibold uppercase tracking-widest text-content-muted left-0', sticky)} />
            <th className={cn('py-2 font-label font-semibold uppercase tracking-widest text-content-muted left-7', sticky)} />
            <th className="text-left px-2 py-2 font-label font-semibold uppercase tracking-widest text-content-muted bg-navy-600">
              Team
            </th>
            {COLS.map(c => (
              <th key={c} className={cn(
                'py-2 text-center font-label font-semibold uppercase tracking-widest',
                c === 'Pts' ? 'text-gold-500 bg-navy-600' : 'text-content-muted'
              )}>
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={row.team} className={cn(
              'border-b border-navy-800 group group-hover:bg-navy-700',
            )}>
              <td className={cn(
                'px-4 py-3 text-content-muted tabular left-0',
                sticky,
                i < 3 && 'shadow-[inset_2px_0_0_0_theme(colors.green.600)]',
                i === 3 && 'shadow-[inset_2px_0_0_0_theme(colors.yellow.600)]',
              )}>
                {i + 1}
              </td>
              <td className={cn('py-3 left-7 text-center', sticky)}>
                <Flag teamName={row.team} size='1.5em' className="flex-shrink-0" />
              </td>
              <td className="px-2 py-3 bg-navy-600">
                <span className="font-medium truncate block font-display tracking-wider text-base">{row.team}</span>
              </td>
              {COLS.map(c => (
                <td key={c} className={cn(
                  'py-3 tabular text-center',
                  c === 'Pts' && 'font-bold text-white bg-navy-600',
                  c !== 'Pts' && 'text-content-secondary',
                  c === 'GD' && row.GD > 0 && 'text-emerald-400',
                  c === 'GD' && row.GD < 0 && 'text-red-400',
                )}>
                  {c === 'GD' && row.GD > 0 ? `+${row.GD}` : row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}