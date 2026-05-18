import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { AnimalsGrid } from "@/components/animals-grid"
import { supabase } from "@/lib/supabase"
import type { Animal } from "@/components/animal-card"
import { PawPrint } from "lucide-react"

export const metadata = {
  title: "Наши питомцы | Добрые лапки",
  description: "Найдите своего нового друга среди наших питомцев",
}

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

export default async function PetsPage() {
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

          <AnimalsGrid animals={animals} sickAnimalIds={sickAnimalIds} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
