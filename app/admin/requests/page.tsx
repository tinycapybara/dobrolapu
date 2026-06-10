import { supabaseAdmin } from "@/lib/supabase-admin"
import { ClipboardList, CalendarDays, Phone, Mail, PawPrint } from "lucide-react"
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

function MessageBlock({ message }: { message: string | null }) {
  if (!message) return null

  const lines = message.split(/\r?\n|\r/).filter(Boolean)
  const isQuestionnaire = lines.some((l) => /^[^:]+:\s/.test(l) && l.indexOf(":") < 30)

  if (isQuestionnaire) {
    return (
      <div className="space-y-1.5">
        {lines.map((line, i) => {
          const colonIdx = line.indexOf(": ")
          if (colonIdx > 0 && colonIdx < 30) {
            const label = line.slice(0, colonIdx)
            const value = line.slice(colonIdx + 2)
            return (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-stone-400 shrink-0 min-w-[140px]">{label}</span>
                <span className="text-stone-700 font-medium">{value}</span>
              </div>
            )
          }
          return <p key={i} className="text-sm text-stone-600">{line}</p>
        })}
      </div>
    )
  }

  return <p className="text-sm text-stone-600 whitespace-pre-wrap">{message}</p>
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

      {requests.length === 0 ? (
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm py-16 text-center text-stone-400">
          <ClipboardList className="size-8 mx-auto mb-3 text-stone-200" />
          <p>{showAll ? "Заявок нет" : "Новых заявок нет"}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl bg-white border border-stone-100 shadow-sm p-5 transition-opacity ${r.status_id !== 1 ? "opacity-70" : ""}`}
            >
              {/* Шапка карточки */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {r.type === "guardian"
                    ? <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100 border-0 text-xs">Опекун</Badge>
                    : <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-0 text-xs">Забрать домой</Badge>
                  }
                  {statusBadge(r.status_id, r.status)}
                  {r.animal_name && (
                    <span className="flex items-center gap-1 text-sm text-stone-500">
                      <PawPrint className="size-3.5" />
                      {r.animal_name}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-stone-400 whitespace-nowrap">
                  <CalendarDays className="size-3.5" />
                  {formatDate(r.created_at)}
                </span>
              </div>

              {/* Контакты + кнопки действий */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span className="font-semibold text-stone-800">{r.name}</span>
                  <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-sm text-[#D4849A] hover:underline">
                    <Phone className="size-3.5" />{r.phone}
                  </a>
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 text-sm text-stone-500 hover:text-[#D4849A] hover:underline transition-colors">
                      <Mail className="size-3.5" />{r.email}
                    </a>
                  )}
                </div>
                <StatusActions id={r.id} statusId={r.status_id} userId={r.user_id} />
              </div>

              {/* Анкета / комментарий */}
              {r.message && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Анкета / комментарий</p>
                  <MessageBlock message={r.message} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
