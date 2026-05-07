import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in — render children only (login page). Middleware handles the redirect.
  if (!user) return <>{children}</>

  async function logout() {
    "use server"
    const client = await createClient()
    await client.auth.signOut()
    const { redirect } = await import("next/navigation")
    redirect("/admin/login")
  }

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
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-full px-3 py-1.5 transition-colors"
            >
              <LogOut size={13} />
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  )
}
