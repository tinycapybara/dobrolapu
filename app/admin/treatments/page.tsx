import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Pill, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Treatment = {
  id: number
  disease: string
  description: string | null
  goal_amount: number | null
  is_active: boolean
  animals: { id: number; name: string } | null
}

async function getTreatments(): Promise<Treatment[]> {
  const { data, error } = await supabaseAdmin
    .from("treatments")
    .select("id, disease, description, goal_amount, is_active, animals!animal_id(id, name)")
    .order("created_at", { ascending: false })

  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Treatment[]
}

function formatAmount(n: number | null): string {
  if (!n) return "—"
  return n.toLocaleString("ru-RU") + " ₽"
}

export default async function AdminTreatmentsPage() {
  const treatments = await getTreatments()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Срочные сборы</h1>
          <p className="text-sm text-stone-400 mt-0.5">{treatments.filter((t) => t.is_active).length} активных сборов</p>
        </div>
        <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white gap-2">
          <Link href="/admin/treatments/new">
            <Plus className="size-4" />
            Добавить
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Питомец</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Диагноз</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Цель</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {treatments.map((t) => (
              <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-800">
                  {t.animals
                    ? <Link href={`/pets/${t.animals.id}`} className="hover:text-[#D4849A] transition-colors">{t.animals.name}</Link>
                    : <span className="text-stone-400">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-stone-700">{t.disease}</td>
                <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{formatAmount(t.goal_amount)}</td>
                <td className="px-4 py-3">
                  {t.is_active
                    ? <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 text-xs">Активный</Badge>
                    : <Badge className="bg-stone-100 text-stone-400 hover:bg-stone-100 border-0 text-xs">Закрыт</Badge>
                  }
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/treatments/${t.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-[#D4849A] transition-colors"
                  >
                    <Pencil className="size-3.5" />
                    Изменить
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {treatments.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <Pill className="size-8 mx-auto mb-3 text-stone-200" />
            <p>Сборов пока нет</p>
          </div>
        )}
      </div>
    </div>
  )
}
