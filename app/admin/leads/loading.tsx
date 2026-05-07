export default function LeadsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-9 w-64 bg-slate-800 rounded-xl animate-pulse" />
      </div>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex gap-6">
          {[120, 160, 96, 80, 64, 96, 80].map((w, i) => (
            <div key={i} className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-800/50 flex gap-6 items-center">
            {[120, 160, 96, 80, 64, 96, 80].map((w, j) => (
              <div key={j} className="h-4 bg-slate-800 rounded animate-pulse" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
