"use client"

import { useTransition } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toggleVisibility } from "./actions"

type Donation = {
  id: string
  donor_name: string | null
  amount: number
  comment: string | null
  status: string
  paid_at: string | null
  created_at: string
  is_visible: boolean
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
}

function formatAmount(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽"
}

function VisibilityToggle({ id, isVisible }: { id: string; isVisible: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleVisibility(id, isVisible))}
      disabled={isPending}
      title={isVisible ? "Скрыть на сайте" : "Показать на сайте"}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        isVisible
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          : "bg-stone-50 border-stone-200 text-stone-400 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
      }`}
    >
      {isVisible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      {isVisible ? "Видно" : "Скрыто"}
    </button>
  )
}

export function DonationsTable({ donations, total }: { donations: Donation[]; total: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Пожертвования</h1>
          <p className="text-sm text-stone-400 mt-0.5">{donations.length} пожертвований получено</p>
        </div>
        <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 px-5 py-3 text-right">
          <p className="text-xs text-stone-500">Всего собрано</p>
          <p className="text-xl font-bold text-[#D4849A]">{formatAmount(total)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Дата</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Донор</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Сумма</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Статус</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Комментарий</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">На сайте</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                  {formatDate(d.paid_at ?? d.created_at)}
                </td>
                <td className="px-4 py-3 font-medium text-stone-800">
                  {d.donor_name ?? <span className="text-stone-400">Анонимно</span>}
                </td>
                <td className="px-4 py-3 font-bold text-[#D4849A] whitespace-nowrap">{formatAmount(d.amount)}</td>
                <td className="px-4 py-3">
                  {d.status === "completed"
                    ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">Завершён</Badge>
                    : <Badge className="bg-stone-100 text-stone-500 hover:bg-stone-100 border-0 text-xs">Ожидание</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-stone-500 max-w-xs">
                  <p className="line-clamp-2">{d.comment ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  {d.status === "completed"
                    ? <VisibilityToggle id={d.id} isVisible={d.is_visible} />
                    : <span className="text-stone-300 text-xs">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {donations.length === 0 && (
          <div className="py-16 text-center text-stone-400 text-sm">Пожертвований пока нет</div>
        )}
      </div>

      <p className="text-xs text-stone-400">
        Кнопка «Видно / Скрыто» управляет отображением доната в блоке последних пожертвований на странице доната.
      </p>
    </div>
  )
}
