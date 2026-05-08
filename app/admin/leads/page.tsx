import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 20

type Consultation = {
  id: string
  name: string
  email: string
  phone: string
  plan_selected: string | null
  payment_status: string
  razorpay_order_id: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  paid:      "bg-emerald-500/10 text-white border-emerald-500/30",
  completed: "bg-blue-500/10 text-white border-blue-500/30",
  pending:   "bg-yellow-500/10 text-white/60 border-yellow-500/30",
  failed:    "bg-brand/10 text-brand border-brand/20",
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))
  const offset = (page - 1) * PAGE_SIZE

  async function markComplete(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const supabase = await createServiceClient()
    await supabase
      .from("consultations")
      .update({ payment_status: "completed" })
      .eq("id", id)
    revalidatePath("/admin/leads")
  }

  const supabase = await createServiceClient()

  let query = supabase
    .from("consultations")
    .select("id, name, email, phone, plan_selected, payment_status, razorpay_order_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return <p className="text-red-400">Failed to load consultations: {error.message}</p>
  }

  const consultations = (data ?? []) as Consultation[]
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Consultations</h1>
          <p className="text-sm text-white/60 mt-0.5">{count ?? 0} total</p>
        </div>

        {/* Search */}
        <form method="GET" className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search name, email, phone…"
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
              href="/admin/leads"
              className="px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-white/60">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-white/60 font-medium">No consultations yet</p>
                    <p className="text-white/60 text-xs mt-1">Records will appear here once payments are made</p>
                  </td>
                </tr>
              ) : (
                consultations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-white/60">{row.email}</td>
                    <td className="px-6 py-4 text-white/60">{row.phone}</td>
                    <td className="px-6 py-4 text-white/60">{row.plan_selected ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[row.payment_status] ?? statusColors.pending}`}>
                        {row.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-xs whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {row.payment_status === "paid" && (
                        <form action={markComplete}>
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className="text-xs px-3 py-1 rounded-full border border-slate-700 text-white/60 hover:border-blue-500 hover:text-blue-400 transition-colors"
                          >
                            Mark complete
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-white/60">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <a
                  href={`/admin/leads?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
                  href={`/admin/leads?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
      </div>
    </div>
  )
}
