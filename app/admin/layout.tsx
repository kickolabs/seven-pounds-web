import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white font-semibold">The Seven Pounds · Admin</span>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/admin/leads" className="hover:text-white transition-colors">Consultations</Link>
            <Link href="/admin/contacts" className="hover:text-white transition-colors">Contacts</Link>
          </nav>
        </div>
        <span className="text-xs text-slate-500">{user.email}</span>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  )
}
