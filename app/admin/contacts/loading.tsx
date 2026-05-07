export default function ContactsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-9 w-64 bg-slate-800 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="h-3 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
