export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-brand animate-bounce" />
      </div>
    </div>
  )
}
