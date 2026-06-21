import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { AnimalsGrid } from "@/components/animals-grid"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Animal } from "@/components/animal-card"
import type { FilterValues } from "@/components/animals-filter"
import { PawPrint, Sparkles } from "lucide-react"

export const metadata = {
  title: "Наши питомцы | Добрые лапки",
  description: "Найдите своего нового друга среди наших питомцев",
}

type SearchParams = Promise<{
  type?: string
  size?: string
  age?: string
  health?: string
  quiz?: string
  special?: string
}>

async function getAnimals(): Promise<Animal[]> {
  const { data, error } = await supabase
    .from("animals")
    .select(`
      id, name, gender, breed, age, size, description,
      animal_photos(photo_url, is_main),
      animal_types(type),
      animal_statuses(status),
      guardianship_statuses(guardianship)
    `)
    .eq("status_id", 1)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching animals:", error)
    return []
  }

  return (data ?? []) as unknown as Animal[]
}

async function getSickAnimalIds(): Promise<number[]> {
  const { data, error } = await supabase
    .from("treatments")
    .select("animal_id")
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching treatments:", error)
    return []
  }

  return (data ?? []).map((row) => row.animal_id)
}

export default async function PetsPage({ searchParams }: { searchParams?: SearchParams }) {
  const sp = searchParams ? await searchParams : {}
  const fromQuiz = sp.quiz === "1"
  const isSpecial = sp.special === "1"

  const initialFilters: Partial<FilterValues> = {}
  if (sp.type) initialFilters.type = sp.type
  if (sp.size) initialFilters.size = sp.size
  if (sp.age) initialFilters.age = sp.age
  if (sp.health) initialFilters.health = sp.health

  const [animals, sickAnimalIds] = await Promise.all([getAnimals(), getSickAnimalIds()])

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <PawPrint className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Наши питомцы</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Каждый из них ждёт свою семью. Возможно, именно вы станете для кого-то из них лучшим другом.
            </p>
          </div>

          {!fromQuiz && (
            <div className="mb-8 rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/15 p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="size-11 rounded-xl bg-[#D4849A]/15 flex items-center justify-center shrink-0">
                <Sparkles className="size-5 text-[#D4849A]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-stone-800">Не знаешь, кого выбрать?</p>
                <p className="text-sm text-stone-500 mt-0.5">
                  Пройди короткий тест — подберём питомца под твой характер и образ жизни
                </p>
              </div>
              <Button asChild className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white shrink-0">
                <Link href="/quiz">
                  Пройти тест
                </Link>
              </Button>
            </div>
          )}

          <AnimalsGrid
            animals={animals}
            sickAnimalIds={sickAnimalIds}
            initialFilters={initialFilters}
            fromQuiz={fromQuiz}
            isSpecial={isSpecial}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
