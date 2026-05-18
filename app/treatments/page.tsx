import Link from "next/link"
import { Pill } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { TreatmentCard } from "@/app/home-carousels"

export const metadata = {
  title: "Срочные сборы | Добрые лапки",
  description: "Животные, которым нужна помощь прямо сейчас",
}

type Treatment = {
  id: number
  disease: string
  description: string | null
  goal_amount: number | null
  animals: {
    id: number
    name: string
    animal_photos: { photo_url: string; is_main: boolean }[]
  } | null
}

async function getTreatments(): Promise<Treatment[]> {
  const { data, error } = await supabase
    .from("treatments")
    .select("id, disease, description, goal_amount, animals!animal_id(id, name, animal_photos(photo_url, is_main))")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching treatments:", error)
    return []
  }

  return (data ?? []) as unknown as Treatment[]
}

export default async function TreatmentsPage() {
  const treatments = await getTreatments()

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <Pill className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Срочные сборы</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Этим животным нужна помощь прямо сейчас — каждое пожертвование важно
            </p>
          </div>

          {treatments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center">
              <Pill className="size-10 text-stone-300 mb-4" />
              <p className="text-lg font-semibold text-stone-800">Активных сборов нет</p>
              <p className="mt-1 text-sm text-stone-400">Загляните позже</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
