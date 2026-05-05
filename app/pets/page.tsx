import { Header } from "@/components/ui/header"
import { AnimalsGrid } from "@/components/animals-grid"
import { supabase } from "@/lib/supabase"
import type { Animal } from "@/components/animal-card"

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
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Наши питомцы</h1>
          <p className="mt-2 text-muted-foreground">
            Каждый из них ждёт свою семью. Возможно, именно вы станете для кого-то из них лучшим другом.
          </p>
        </div>

        <AnimalsGrid animals={animals} sickAnimalIds={sickAnimalIds} />
      </main>
    </>
  )
}