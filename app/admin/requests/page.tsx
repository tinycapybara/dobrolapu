import { supabaseAdmin } from "@/lib/supabase-admin"
import { ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type AdoptionRequest = {
  id: number
  animal_name: string | null
  type: string
  name: string
  phone: string
  email: string | null
  message: string | null
  created_at: string
}

async function getRequests(): Promise<AdoptionRequest[]> {
  const { data, error } = await supabaseAdmin
    .from("adoption_requests")
    .select("id, animal_name, type, name, phone, email, message, created_at")
    .order("created_at", { ascending: false })

  if (error) { console.error(error); return [] }
  return (data ?? []) as AdoptionRequest[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
}

export default async function AdminRequestsPage() {
  const requests = await getRequests()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Заявки</h1>
        <p className="text-sm text-stone-400 mt-0.5">Запросы на опекунство и адопцию</p>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Дата</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Тип</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Питомец</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Имя</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Телефон</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Комментарий</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{formatDate(r.created_at)}</td>
                <td className="px-4 py-3">
                  {r.type === "guardian"
                    ? <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100 border-0 text-xs">Опекун</Badge>
                    : <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-0 text-xs">Забрать домой</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-stone-700">{r.animal_name ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-stone-800">{r.name}</td>
                <td className="px-4 py-3">
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
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <ClipboardList className="size-8 mx-auto mb-3 text-stone-200" />
            <p>Заявок пока нет</p>
          </div>
        )}
      </div>
    </div>
  )
}
