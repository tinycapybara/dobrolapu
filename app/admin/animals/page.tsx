import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { PawPrint, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Animal = {
  id: number
  name: string
  gender: string
  age: number | null
  size: string
  animal_types: { type: string } | null
  animal_statuses: { status: string } | null
  guardianship_statuses: { guardianship: string } | null
  animal_photos: { photo_url: string; is_main: boolean }[]
}

async function getAnimals(): Promise<Animal[]> {
  const { data, error } = await supabaseAdmin
    .from("animals")
    .select("id, name, gender, age, size, animal_types(type), animal_statuses(status), guardianship_statuses(guardianship), animal_photos(photo_url, is_main)")
    .order("id", { ascending: false })

  if (error) { console.error(error); return [] }
  return (data ?? []) as unknown as Animal[]
}

function getMainPhoto(photos: { photo_url: string; is_main: boolean }[]): string | null {
  return photos.find((p) => p.is_main)?.photo_url ?? photos[0]?.photo_url ?? null
}

const SIZE_LABELS: Record<string, string> = { small: "Маленький", medium: "Средний", large: "Большой" }

export default async function AdminAnimalsPage() {
  const animals = await getAnimals()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Животные</h1>
          <p className="text-sm text-stone-400 mt-0.5">{animals.length} питомцев в базе</p>
        </div>
        <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white gap-2">
          <Link href="/admin/animals/new">
            <Plus className="size-4" />
            Добавить
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
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
              return (
                <tr key={animal.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="size-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      {photo
                        ? <img src={photo} alt={animal.name} className="size-full object-cover" />
                        : <div className="size-full flex items-center justify-center"><PawPrint className="size-4 text-stone-300" /></div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-800">{animal.name}</td>
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
                    <Link
                      href={`/admin/animals/${animal.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-[#D4849A] transition-colors"
                    >
                      <Pencil className="size-3.5" />
                      Изменить
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {animals.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <PawPrint className="size-8 mx-auto mb-3 text-stone-200" />
            <p>Животных пока нет</p>
          </div>
        )}
      </div>
    </div>
  )
}
