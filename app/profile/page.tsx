"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import {
  ClipboardList,
  Heart,
  CheckSquare,
  LogOut,
  Loader2,
  PawPrint,
  CheckCircle2,
  Circle,
} from "lucide-react"

type Tab = "requests" | "donations" | "checklist"

type AdoptionRequest = {
  id: number
  animal_name: string | null
  type: string
  created_at: string
  status_id: number
  status: string
}

type Donation = {
  id: string
  amount: number
  comment: string | null
  created_at: string
  status: string
  treatment_name: string | null
}

type ChecklistItem = {
  id: number
  item_name: string
  completed: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function StatusBadge({ statusId, status }: { statusId: number; status: string }) {
  const cls =
    statusId === 2
      ? "bg-green-100 text-green-700"
      : statusId === 3
      ? "bg-rose-100 text-rose-700"
      : "bg-stone-100 text-stone-600"
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("requests")

  const [requests, setRequests] = useState<AdoptionRequest[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [donationTotal, setDonationTotal] = useState(0)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [hasApproved, setHasApproved] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        setAuthLoading(false)
      }
    })
  }, [router])

  const fetchData = useCallback(async (currentUser: User) => {
    setDataLoading(true)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }

      const [reqRes, donRes, chkRes] = await Promise.all([
        fetch("/api/profile/requests", { headers }),
        fetch("/api/profile/donations", { headers }),
        fetch("/api/profile/checklist", { headers }),
      ])

      if (reqRes.ok) {
        const data = await reqRes.json()
        setRequests(data.requests ?? [])
        setHasApproved(data.hasApproved ?? false)
      }
      if (donRes.ok) {
        const data = await donRes.json()
        setDonations(data.donations ?? [])
        setDonationTotal(data.total ?? 0)
      }
      if (chkRes.ok) {
        const data = await chkRes.json()
        setChecklist(data.checklist ?? [])
      }
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchData(user)
  }, [user, fetchData])

  async function toggleChecklist(item: ChecklistItem) {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) return

    // Оптимистичное обновление
    setChecklist((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, completed: !i.completed } : i))
    )

    const res = await fetch(`/api/profile/checklist/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !item.completed }),
    })

    if (!res.ok) {
      // Откат при ошибке
      setChecklist((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, completed: item.completed } : i))
      )
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#D4849A]" />
      </div>
    )
  }

  const completedCount = checklist.filter((i) => i.completed).length
  const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "requests", label: "Мои заявки", icon: ClipboardList },
    { key: "donations", label: "Мои пожертвования", icon: Heart },
    { key: "checklist", label: "Чек-лист подготовки", icon: CheckSquare },
  ]

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10 flex flex-col gap-8">
        {/* Шапка профиля */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Личный кабинет</h1>
            <p className="text-sm text-stone-400 mt-0.5">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 rounded-xl border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="size-4" />
            Выйти
          </Button>
        </div>

        {/* Вкладки */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                tab === key
                  ? "bg-[#D4849A] border-[#D4849A] text-white"
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Содержимое вкладок */}
        {dataLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-[#D4849A]" />
          </div>
        ) : (
          <>
            {/* Вкладка: заявки */}
            {tab === "requests" && (
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
                {requests.length === 0 ? (
                  <div className="py-16 text-center text-stone-400">
                    <ClipboardList className="size-8 mx-auto mb-3 text-stone-200" />
                    <p>Заявок пока нет</p>
                    <Link
                      href="/pets"
                      className="inline-block mt-4 text-sm text-[#D4849A] hover:underline"
                    >
                      Посмотреть питомцев →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-50">
                    {requests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-stone-800 truncate">
                              {r.animal_name ?? "Животное не указано"}
                            </span>
                            <span className="text-xs text-stone-400 shrink-0">
                              {r.type === "guardian" ? "Опекунство" : "Забрать домой"}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400">{formatDate(r.created_at)}</span>
                        </div>
                        <StatusBadge statusId={r.status_id} status={r.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Вкладка: пожертвования */}
            {tab === "donations" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
                  {donations.length === 0 ? (
                    <div className="py-16 text-center text-stone-400">
                      <Heart className="size-8 mx-auto mb-3 text-stone-200" />
                      <p>Пожертвований пока нет</p>
                      <Link
                        href="/donate"
                        className="inline-block mt-4 text-sm text-[#D4849A] hover:underline"
                      >
                        Пожертвовать →
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-50">
                      {donations.map((d) => (
                        <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-4">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-semibold text-stone-800">
                              {d.treatment_name ? `На лечение: ${d.treatment_name}` : "Общий сбор"}
                            </span>
                            {d.comment && (
                              <span className="text-xs text-stone-500 truncate">{d.comment}</span>
                            )}
                            <span className="text-xs text-stone-400">{formatDate(d.created_at)}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-stone-800">
                              {Number(d.amount).toLocaleString("ru-RU")} ₽
                            </p>
                            <span
                              className={`text-xs ${
                                d.status === "completed" ? "text-green-600" : "text-stone-400"
                              }`}
                            >
                              {d.status === "completed" ? "Завершено" : "В обработке"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {donations.length > 0 && (
                  <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 px-5 py-4 flex items-center justify-between">
                    <span className="text-sm text-stone-600">Всего пожертвовано</span>
                    <span className="text-xl font-bold text-[#D4849A]">
                      {donationTotal.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Вкладка: чек-лист */}
            {tab === "checklist" && (
              <div className="flex flex-col gap-4">
                {!hasApproved ? (
                  <div className="rounded-2xl bg-white border border-stone-100 shadow-sm py-16 text-center text-stone-400">
                    <PawPrint className="size-8 mx-auto mb-3 text-stone-200" />
                    <p className="font-medium text-stone-600">Чек-лист пока недоступен</p>
                    <p className="text-sm mt-2 max-w-xs mx-auto">
                      Он появится после того, как ваша заявка будет одобрена
                    </p>
                  </div>
                ) : checklist.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-stone-100 shadow-sm py-16 text-center text-stone-400">
                    <CheckSquare className="size-8 mx-auto mb-3 text-stone-200" />
                    <p>Чек-лист пуст</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
                      <div className="divide-y divide-stone-50">
                        {checklist.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleChecklist(item)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone-50 transition-colors"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="size-5 text-[#D4849A] shrink-0" />
                            ) : (
                              <Circle className="size-5 text-stone-300 shrink-0" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                item.completed ? "line-through text-stone-400" : "text-stone-700"
                              }`}
                            >
                              {item.item_name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Прогресс */}
                    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm px-5 py-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-600">Готовность</span>
                        <span className="font-bold text-stone-800">
                          {completedCount} / {checklist.length} ({progressPct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4849A] rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
