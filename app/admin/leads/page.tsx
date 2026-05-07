import { redirect } from "next/navigation"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

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
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default async function LeadsPage() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect("/admin/login")

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("consultations")
    .select("id, name, email, phone, plan_selected, payment_status, razorpay_order_id, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return <p className="text-red-400">Failed to load consultations: {error.message}</p>
  }

  const consultations = (data ?? []) as Consultation[]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Consultations</h1>
        <span className="text-sm text-slate-500">{consultations.length} total</span>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No consultations yet</td>
                </tr>
              ) : (
                consultations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-slate-400">{row.email}</td>
                    <td className="px-6 py-4 text-slate-400">{row.phone}</td>
                    <td className="px-6 py-4 text-slate-400">{row.plan_selected ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[row.payment_status] ?? statusColors.pending}`}>
                        {row.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(row.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
