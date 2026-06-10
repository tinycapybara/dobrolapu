import { supabaseAdmin } from "@/lib/supabase-admin"
import { ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatusActions } from "./status-actions"

type AdoptionRequest = {
  id: number
  animal_name: string | null
  type: string
  name: string
  phone: string
  email: string | null
  message: string | null
  status_id: number
  status: string
  user_id: string | null
  created_at: string
}

type Props = { searchParams: Promise<{ show?: string }> }

async function getRequests(showAll: boolean): Promise<AdoptionRequest[]> {
  let query = supabaseAdmin
    .from("adoption_requests")
    .select("id, animal_name, type, name, phone, email, message, status_id, user_id, created_at, request_statuses(status)")
    .order("created_at", { ascending: false })

  if (!showAll) query = query.eq("status_id", 1)

  const { data, error } = await query
  if (error) { console.error(error); return [] }

  return (data ?? []).map((r) => ({
    id: r.id,
    animal_name: r.animal_name,
    type: r.type,
    name: r.name,
    phone: r.phone,
    email: r.email,
    message: r.message,
    status_id: r.status_id,
    status: (r.request_statuses as unknown as { status: string } | null)?.status ?? "—",
    user_id: r.user_id,
    created_at: r.created_at,
  }))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
}

function statusBadge(statusId: number, status: string) {
  const cls =
    statusId === 2
      ? "bg-green-100 text-green-600 hover:bg-green-100 border-0"
      : statusId === 3
      ? "bg-rose-100 text-rose-600 hover:bg-rose-100 border-0"
      : "bg-stone-100 text-stone-500 hover:bg-stone-100 border-0"
  return <Badge className={`text-xs ${cls}`}>{status}</Badge>
}

export default async function AdminRequestsPage({ searchParams }: Props) {
  const { show } = await searchParams
  const showAll = show === "all"
  const requests = await getRequests(showAll)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Заявки</h1>
          <p className="text-sm text-stone-400 mt-0.5">Запросы на опекунство и передачу в семью</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/requests"
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${!showAll ? "bg-[#D4849A] border-[#D4849A] text-white" : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"}`}
          >
            Новые
          </a>
          <a
            href="/admin/requests?show=all"
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${showAll ? "bg-[#D4849A] border-[#D4849A] text-white" : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"}`}
          >
            Все
          </a>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Дата</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Тип</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Питомец</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Имя</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Телефон</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Комментарий</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {requests.map((r) => (
                <tr key={r.id} className={`hover:bg-stone-50/50 transition-colors ${r.status_id !== 1 ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    {r.type === "guardian"
                      ? <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100 border-0 text-xs">Опекун</Badge>
                      : <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-0 text-xs">Забрать домой</Badge>
                    }
                  </td>
                  <td className="px-4 py-3 text-stone-700">{r.animal_name ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-stone-800">{r.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`tel:${r.phone}`} className="text-[#D4849A] hover:underline">{r.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {r.email
                      ? <a href={`mailto:${r.email}`} className="hover:text-[#D4849A] hover:underline transition-colors">{r.email}</a>
                      : <span className="text-stone-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-stone-500 max-w-xs">
                    <p className="line-clamp-2">{r.message ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">{statusBadge(r.status_id, r.status)}</td>
                  <td className="px-4 py-3">
                    <StatusActions id={r.id} statusId={r.status_id} userId={r.user_id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {requests.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <ClipboardList className="size-8 mx-auto mb-3 text-stone-200" />
            <p>{showAll ? "Заявок нет" : "Новых заявок нет"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
