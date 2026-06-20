import { Globe, Check } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@context/AppContext'

const COMMON_TZ = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (ET)', value: 'America/New_York' },
  { label: 'Los Angeles (PT)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CT)', value: 'America/Chicago' },
  { label: 'Denver (MT)', value: 'America/Denver' },
  { label: 'Toronto (ET)', value: 'America/Toronto' },
  { label: 'Vancouver (PT)', value: 'America/Vancouver' },
  { label: 'Mexico City (CT)', value: 'America/Mexico_City' },
  { label: 'London (BST)', value: 'Europe/London' },
  { label: 'Paris (CEST)', value: 'Europe/Paris' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Riyadh (AST)', value: 'Asia/Riyadh' },
  { label: 'Dhaka (BST)', value: 'Asia/Dhaka' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Lagos (WAT)', value: 'Africa/Lagos' },
]

export default function TimezoneSelector({ inline = false }) {
  const { timezone, setTimezone } = useApp()
  const [selected, setSelected] = useState(timezone)

  const content = (
    <div className={inline ? '' : 'fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 animate-fade-in'}>
      <div className={`bg-navy-800 border border-navy-600 w-full ${inline ? '' : 'max-w-sm mx-4 animate-slide-down'}`}>
        <div className="flex items-center gap-2 pl-4 py-3 bg-navy-900 border-b border-navy-600 h-11 overflow-hidden">
          <Globe size={16} className="text-gold-500" />
          <span className="text-sm font-bold text-gold-500 uppercase tracking-wider">Select Timezone</span>
          <button
            onClick={() => setTimezone(selected)}
            className="ms-auto w-fit px-6 py-2.5 h-11 flex items-center bg-gold-500 text-navy-950 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors"
          >
            Confirm
          </button>
        </div>
        <div className="overflow-y-auto max-h-[40vh] bg-black/10">
          {COMMON_TZ.map(tz => (
            <button
              key={tz.value}
              onClick={() => setSelected(tz.value)}
              className={`w-full px-4 py-2.5 text-left text-xs transition-colors border-b border-navy-800 ${selected === tz.value ? 'text-gold-500 font-bold bg-navy-700' : 'text-white hover:bg-navy-700'
                }`}
            >
              {tz.label}
              {selected === tz.value && <Check size={12} className="float-right mt-0.5 text-gold-500" />}
            </button>
          ))}
        </div>

      </div>
    </div>
  )

  return content
}
