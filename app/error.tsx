"use client"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-white">
      <h2 className="text-2xl font-semibold text-slate-900">Something went wrong</h2>
      <p className="text-slate-400 text-center max-w-sm text-sm leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
