import { redirect } from "next/navigation"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export default async function ContactsPage() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect("/admin/login")

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, email, phone, message, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return <p className="text-red-400">Failed to load contacts: {error.message}</p>
  }

  const contacts = (data ?? []) as Contact[]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Contact Messages</h1>
        <span className="text-sm text-slate-500">{contacts.length} total</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.length === 0 ? (
          <p className="text-slate-500 py-12 text-center">No messages yet</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-medium">{contact.name}</p>
                  <p className="text-slate-400 text-sm">{contact.email}</p>
                  {contact.phone && <p className="text-slate-500 text-sm">{contact.phone}</p>}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(contact.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{contact.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
