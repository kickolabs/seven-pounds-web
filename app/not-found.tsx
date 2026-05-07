import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-4">404</p>
      <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 mb-4">
        Page not found.
      </h1>
      <p className="text-slate-400 text-lg mb-10">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-brand text-white text-sm font-semibold tracking-wide hover:bg-brand-600 transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  )
}
