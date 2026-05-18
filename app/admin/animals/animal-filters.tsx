"use client"

import { useRouter, useSearchParams } from "next/navigation"

type LookupItem = { id: number; label: string }

export function AnimalFilters({
  types,
  statuses,
}: {
  types: LookupItem[]
  statuses: LookupItem[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentType = searchParams.get("type") ?? ""
  const currentStatus = searchParams.get("status") ?? ""

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/admin/animals?${params.toString()}`)
  }

  function reset() {
    router.push("/admin/animals")
  }

  const hasFilters = currentType || currentStatus

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={currentType}
        onChange={(e) => update("type", e.target.value)}
        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
      >
        <option value="">Все виды</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>

      <select
        value={currentStatus}
        onChange={(e) => update("status", e.target.value)}
        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
      >
        <option value="">Все статусы</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={reset}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Сбросить
        </button>
      )}
    </div>
  )
}
