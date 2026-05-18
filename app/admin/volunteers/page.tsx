import { supabaseAdmin } from "@/lib/supabase-admin"
import { Users } from "lucide-react"

type VolunteerRequest = {
  id: number
  name: string
  phone: string
  email: string
  age: number
  activities: string[]
  frequency: string | null
  days: string[]
  has_car: boolean | null
  has_pets: boolean | null
  prior_volunteer: boolean | null
  motivation: string | null
  created_at: string
}

async function getVolunteers(): Promise<VolunteerRequest[]> {
  const { data, error } = await supabaseAdmin
    .from("volunteer_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) { console.error(error); return [] }
  return (data ?? []) as VolunteerRequest[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
}

function yesNo(val: boolean | null): string {
  if (val === true) return "Да"
  if (val === false) return "Нет"
  return "—"
}

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Раз в неделю",
  several: "Несколько раз в неделю",
  sometimes: "По возможности",
}

export default async function AdminVolunteersPage() {
  const volunteers = await getVolunteers()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Волонтёры</h1>
        <p className="text-sm text-stone-400 mt-0.5">{volunteers.length} анкет получено</p>
      </div>

      {volunteers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm py-16 text-center text-stone-400">
          <Users className="size-8 mx-auto mb-3 text-stone-200" />
          <p>Анкет пока нет</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {volunteers.map((v) => (
            <div key={v.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-stone-800 text-base">{v.name}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <a href={`tel:${v.phone}`} className="text-sm text-[#D4849A] hover:underline">{v.phone}</a>
                    <a href={`mailto:${v.email}`} className="text-sm text-stone-500 hover:text-[#D4849A] hover:underline transition-colors">{v.email}</a>
                    <span className="text-sm text-stone-400">{v.age} лет</span>
                  </div>
                </div>
                <span className="text-xs text-stone-400">{formatDate(v.created_at)}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-stone-400 mb-1">Частота</p>
                  <p className="text-sm text-stone-700">{v.frequency ? FREQUENCY_LABELS[v.frequency] ?? v.frequency : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-1">Дни</p>
                  <p className="text-sm text-stone-700">{v.days.length > 0 ? v.days.join(", ") : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-1">Авто / Питомцы / Опыт</p>
                  <p className="text-sm text-stone-700">{yesNo(v.has_car)} / {yesNo(v.has_pets)} / {yesNo(v.prior_volunteer)}</p>
                </div>
              </div>

              {v.activities.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-stone-400 mb-1.5">Хочет помочь с</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.activities.map((a) => (
                      <span key={a} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-lg px-2.5 py-1">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {v.motivation && (
                <div className="mt-3 rounded-xl bg-stone-50 p-3">
                  <p className="text-xs text-stone-400 mb-1">Мотивация</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{v.motivation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
