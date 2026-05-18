import { supabaseAdmin } from "@/lib/supabase-admin"
import { ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProcessedToggle } from "./processed-toggle"

type AdoptionRequest = {
  id: number
  animal_name: string | null
  type: string
  name: string
  phone: string
  email: string | null
  message: string | null
  is_processed: boolean
  created_at: string
}

type Props = { searchParams: Promise<{ show?: string }> }

async function getRequests(showAll: boolean): Promise<AdoptionRequest[]> {
  let query = supabaseAdmin
    .from("adoption_requests")
    .select("id, animal_name, type, name, phone, email, message, is_processed, created_at")
    .order("created_at", { ascending: false })

  if (!showAll) query = query.eq("is_processed", false)

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data ?? []) as AdoptionRequest[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
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
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Дата</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Тип</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Питомец</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Имя</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Телефон</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Комментарий</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {requests.map((r) => (
              <tr key={r.id} className={`hover:bg-stone-50/50 transition-colors ${r.is_processed ? "opacity-50" : ""}`}>
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
                <td className="px-4 py-3">
                  <ProcessedToggle id={r.id} isProcessed={r.is_processed} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {requests.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <ClipboardList className="size-8 mx-auto mb-3 text-stone-200" />
            <p>{showAll ? "Заявок нет" : "Необработанных заявок нет"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
