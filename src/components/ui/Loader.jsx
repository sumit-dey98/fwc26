export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 h-full">
      <div className="flex gap-3">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-4 h-4 bg-navy-600 animate-loader-box"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="font-label text-xs font-semibold uppercase tracking-widest text-content-muted">
        {label}
      </p>
    </div>
  )
}