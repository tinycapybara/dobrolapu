import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { PawPrint, Pill, ClipboardList, Users, Heart, ArrowRight } from "lucide-react"

async function getStats() {
  const [
    { count: animals },
    { count: treatments },
    { count: requests },
    { count: volunteers },
    { data: donations },
  ] = await Promise.all([
    supabaseAdmin.from("animals").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("treatments").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("adoption_requests").select("*", { count: "exact", head: true }).eq("is_processed", false),
    supabaseAdmin.from("volunteer_requests").select("*", { count: "exact", head: true }).eq("is_processed", false),
    supabaseAdmin.from("donations").select("amount").eq("status", "completed"),
  ])

  const total = (donations ?? []).reduce((sum, d) => sum + Number(d.amount), 0)

  return {
    animals: animals ?? 0,
    treatments: treatments ?? 0,
    requests: requests ?? 0,
    volunteers: volunteers ?? 0,
    total,
  }
}

async function getRecentRequests() {
  const { data } = await supabaseAdmin
    .from("adoption_requests")
    .select("id, name, animal_name, type, created_at")
    .eq("is_processed", false)
    .order("created_at", { ascending: false })
    .limit(5)
  return data ?? []
}

async function getRecentVolunteers() {
  const { data } = await supabaseAdmin
    .from("volunteer_requests")
    .select("id, name, activities, created_at")
    .eq("is_processed", false)
    .order("created_at", { ascending: false })
    .limit(5)
  return data ?? []
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

export default async function AdminDashboardPage() {
  const [stats, requests, volunteers] = await Promise.all([
    getStats(),
    getRecentRequests(),
    getRecentVolunteers(),
  ])

  const statCards = [
    { label: "Животных в приюте", value: stats.animals, icon: PawPrint, color: "bg-[#FAF0F3]", iconColor: "text-[#D4849A]", href: "/admin/animals" },
    { label: "Активных сборов", value: stats.treatments, icon: Pill, color: "bg-red-50", iconColor: "text-red-500", href: "/admin/treatments" },
    { label: "Новых заявок", value: stats.requests, icon: ClipboardList, color: "bg-purple-50", iconColor: "text-purple-500", href: "/admin/requests" },
    { label: "Анкет волонтёров", value: stats.volunteers, icon: Users, color: "bg-teal-50", iconColor: "text-teal-500", href: "/admin/volunteers" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Обзор</h1>
        <p className="text-sm text-stone-400 mt-0.5">Актуальное состояние приюта</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className={`${card.color} size-10 rounded-xl flex items-center justify-center`}>
              <card.icon className={`size-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-stone-800">{card.value}</p>
              <p className="text-sm text-stone-400 mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Всего собрано */}
      <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white flex items-center justify-center">
            <Heart className="size-5 text-[#D4849A]" />
          </div>
          <div>
            <p className="text-sm text-stone-500">Всего собрано пожертвований</p>
            <p className="text-2xl font-bold text-[#D4849A]">{stats.total.toLocaleString("ru-RU")} ₽</p>
          </div>
        </div>
        <Link href="/admin/donations" className="text-sm text-stone-400 hover:text-[#D4849A] transition-colors flex items-center gap-1">
          Подробнее <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Новые заявки */}
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-800">Необработанные заявки</h2>
            <Link href="/admin/requests" className="text-xs text-stone-400 hover:text-[#D4849A] transition-colors">
              Все заявки →
            </Link>
          </div>
          {requests.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">Новых заявок нет</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{r.name}</p>
                    <p className="text-xs text-stone-400">
                      {r.type === "guardian" ? "Опекун" : "Забрать домой"}{r.animal_name ? ` — ${r.animal_name}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{formatDate(r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Новые волонтёры */}
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-800">Новые анкеты волонтёров</h2>
            <Link href="/admin/volunteers" className="text-xs text-stone-400 hover:text-[#D4849A] transition-colors">
              Все анкеты →
            </Link>
          </div>
          {volunteers.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">Новых анкет нет</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {volunteers.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{v.name}</p>
                    <p className="text-xs text-stone-400 line-clamp-1">
                      {(v.activities as string[]).slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{formatDate(v.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
