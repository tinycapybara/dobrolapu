import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { PawPrint, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimalFilters } from "./animal-filters"
import { FoundHomeButton } from "./animals-actions-client"

type Animal = {
  id: number
  name: string
  gender: string
  age: number | null
  size: string
  adopted_at: string | null
  animal_types: { type: string } | null
  animal_statuses: { status: string } | null
  guardianship_statuses: { guardianship: string } | null
  animal_photos: { photo_url: string; is_main: boolean }[]
}

type Props = { searchParams: Promise<{ type?: string; status?: string }> }

async function getLookups() {
  const [{ data: types }, { data: statuses }] = await Promise.all([
    supabaseAdmin.from("animal_types").select("id, type").order("id"),
    supabaseAdmin.from("animal_statuses").select("id, status").order("id"),
  ])
  return {
    types: (types ?? []).map((t) => ({ id: t.id, label: t.type })),
    statuses: (statuses ?? []).map((s) => ({ id: s.id, label: s.status })),
  }
}

async function getAnimals(typeId?: string, statusId?: string): Promise<Animal[]> {
  let query = supabaseAdmin
    .from("animals")
    .select("id, name, gender, age, size, adopted_at, animal_types(type), animal_statuses(status), guardianship_statuses(guardianship), animal_photos(photo_url, is_main)")
    .order("id", { ascending: false })

  if (typeId) query = query.eq("type_id", typeId)
  if (statusId) query = query.eq("status_id", statusId)

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Animal[]
}

function getMainPhoto(photos: { photo_url: string; is_main: boolean }[]): string | null {
  return photos.find((p) => p.is_main)?.photo_url ?? photos[0]?.photo_url ?? null
}

const SIZE_LABELS: Record<string, string> = { small: "Маленький", medium: "Средний", large: "Большой" }

export default async function AdminAnimalsPage({ searchParams }: Props) {
  const { type, status } = await searchParams
  const [animals, { types, statuses }] = await Promise.all([
    getAnimals(type, status),
    getLookups(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Животные</h1>
          <p className="text-sm text-stone-400 mt-0.5">{animals.length} питомцев</p>
        </div>
        <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white gap-2">
          <Link href="/admin/animals/new">
            <Plus className="size-4" />
            Добавить
          </Link>
        </Button>
      </div>

      <AnimalFilters types={types} statuses={statuses} />

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-semibold text-stone-500 w-12"></th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Кличка</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Вид</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Пол</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Размер</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Статус</th>
              <th className="text-left px-4 py-3 font-semibold text-stone-500">Опекунство</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {animals.map((animal) => {
              const photo = getMainPhoto(animal.animal_photos)
              const hasGuardian = animal.guardianship_statuses?.guardianship === "Есть опекун"
              const isSick = animal.animal_statuses?.status === "Нуждается в лечении"
              const foundHome = !!animal.adopted_at
              return (
                <tr key={animal.id} className={`hover:bg-stone-50/50 transition-colors ${foundHome ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="size-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      {photo
                        ? <img src={photo} alt={animal.name} className="size-full object-cover" />
                        : <div className="size-full flex items-center justify-center"><PawPrint className="size-4 text-stone-300" /></div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-800">
                    {animal.name}
                    {foundHome && <span className="ml-2 text-xs text-green-600 font-normal">Нашёл дом</span>}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{animal.animal_types?.type ?? "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{animal.gender}</td>
                  <td className="px-4 py-3 text-stone-600">{SIZE_LABELS[animal.size] ?? animal.size}</td>
                  <td className="px-4 py-3">
                    {isSick
                      ? <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 text-xs">Лечение</Badge>
                      : <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">Здоров</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {hasGuardian
                      ? <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100 border-0 text-xs">Есть опекун</Badge>
                      : <span className="text-stone-400 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/animals/${animal.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-[#D4849A] transition-colors"
                      >
                        <Pencil className="size-3.5" />
                        Изменить
                      </Link>
                      {!foundHome && <FoundHomeButton animalId={animal.id} />}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
        {animals.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <PawPrint className="size-8 mx-auto mb-3 text-stone-200" />
            <p>Животных не найдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
