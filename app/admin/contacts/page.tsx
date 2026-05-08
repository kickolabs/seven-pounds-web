import { createServiceClient } from "@/lib/supabase/server"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createServiceClient()

  let query = supabase
    .from("contacts")
    .select("id, name, email, phone, message, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return <p className="text-red-400">Failed to load contacts: {error.message}</p>
  }

  const contacts = (data ?? []) as Contact[]
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Contact Messages</h1>
          <p className="text-sm text-white/60 mt-0.5">{count ?? 0} total</p>
        </div>

        {/* Search */}
        <form method="GET" className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search name, email, message…"
              className="pl-8 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-brand w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white/80 hover:text-white hover:border-slate-600 transition-colors"
          >
            Search
          </button>
          {q && (
            <a
              href="/admin/contacts"
              className="px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      {contacts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-white/60 font-medium">No messages yet</p>
          <p className="text-white/60 text-xs mt-1">Contact form submissions will appear here</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-white/60 text-sm">{contact.email}</p>
                    {contact.phone && <p className="text-white/60 text-sm">{contact.phone}</p>}
                  </div>
                  <span className="text-xs text-white/60 whitespace-nowrap">
                    {formatDate(contact.created_at)}
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{contact.message}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-white/60">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <a
                    href={`/admin/contacts?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-white/60 hover:text-white hover:border-slate-500 text-xs transition-colors"
                  >
                    <ChevronLeft size={13} /> Previous
                  </a>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 text-white/30 text-xs cursor-not-allowed">
                    <ChevronLeft size={13} /> Previous
                  </span>
                )}
                {page < totalPages ? (
                  <a
                    href={`/admin/contacts?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-white/60 hover:text-white hover:border-slate-500 text-xs transition-colors"
                  >
                    Next <ChevronRight size={13} />
                  </a>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 text-white/30 text-xs cursor-not-allowed">
                    Next <ChevronRight size={13} />
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
