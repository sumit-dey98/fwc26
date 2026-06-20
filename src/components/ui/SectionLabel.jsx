export default function SectionLabel({ children, className = '' }) {
  return (
    <div className={`px-4 py-2 text-2xs font-bold uppercase tracking-widest text-gold-500 border-b border-navy-700 ${className}`}>
      {children}
    </div>
  )
}
