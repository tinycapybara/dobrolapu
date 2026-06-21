import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { PawPrint, Home } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Уже нашли дом — Добрые лапки",
  description: "Питомцы, которые нашли любящих хозяев с помощью нашего приюта",
}

type AdoptedAnimal = {
  id: number
  name: string
  adopted_at: string | null
  description: string | null
  animal_photos: { photo_url: string; is_main: boolean }[]
  animal_types: { type: string } | null
}

async function getAdoptedAnimals(): Promise<AdoptedAnimal[]> {
  const { data } = await supabase
    .from("animals")
    .select("id, name, adopted_at, description, animal_photos(photo_url, is_main), animal_types(type)")
    .eq("status_id", 2)
    .order("adopted_at", { ascending: false })

  return (data ?? []) as unknown as AdoptedAnimal[]
}

export default async function AdoptedPage() {
  const animals = await getAdoptedAnimals()

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <Home className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Уже нашли дом</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              {animals.length > 0
                ? `${animals.length} ${plural(animals.length)} обрели любящих хозяев — и ты можешь стать чьим-то!`
                : "Истории питомцев, которые нашли свою семью"}
            </p>
          </div>

          {animals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-24 text-center">
              <PawPrint className="size-12 text-stone-300 mb-4" />
              <p className="text-stone-500 font-medium text-lg">Историй пока нет</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {animals.map((animal) => {
                const photos = animal.animal_photos ?? []
                const photo = photos.find((p) => p.is_main) ?? photos[0] ?? null

                return (
                  <Link
                    key={animal.id}
                    href={`/pets/${animal.id}`}
                    className="group flex flex-col rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      {photo ? (
                        <Image
                          src={photo.photo_url}
                          alt={animal.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <PawPrint className="size-10 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">
                          <Home className="size-3" />
                          Дома
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-1.5">
                      <p className="text-base font-bold text-stone-800 group-hover:text-[#D4849A] transition-colors">
                        {animal.name}
                      </p>
                      {animal.adopted_at && (
                        <p className="text-xs text-stone-400">
                          {new Date(animal.adopted_at).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      {animal.description && (
                        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mt-0.5">
                          {animal.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

function plural(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "питомец"
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "питомца"
  return "питомцев"
}
