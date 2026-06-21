import { X } from 'lucide-react'

export default function Drawer({ open, onClose, title, children }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy-950/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-navy-700 transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-navy-800 bg-gold-500">
          <span className="text-sm font-label font-bold uppercase tracking-widest text-navy-800 leading-none">{title}</span>
          <button onClick={onClose} className="text-navy-800 hover:text-navy-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">{children}</div>
      </div>
    </>
  )
}