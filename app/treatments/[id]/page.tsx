import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Heart, Pill } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimalGallery } from "@/app/pets/[id]/animal-gallery"

const formatMoney = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n)

export default async function TreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data } = await supabase
    .from("treatments")
    .select(
      "id, disease, description, goal_amount, animals!animal_id(id, name, gender, breed, age, description, animal_photos(photo_url, is_main))"
    )
    .eq("id", id)
    .single()

  if (!data) notFound()

  const animal = data.animals as unknown as {
    id: number
    name: string
    gender: string | null
    breed: string | null
    age: string | null
    description: string | null
    animal_photos: { photo_url: string; is_main: boolean }[]
  } | null

  const photos = animal?.animal_photos ?? []

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          <Button asChild variant="ghost" className="mb-6 -ml-3 gap-2 text-stone-500 hover:text-stone-800">
            <Link href="/treatments">
              <ArrowLeft className="size-4" />
              Назад к сборам
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

            {/* Галерея */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 relative">
              <Badge className="absolute top-9 left-9 z-10 bg-red-500 hover:bg-red-500 text-white text-sm px-3 py-1">
                СРОЧНО
              </Badge>
              {photos.length > 0 ? (
                <AnimalGallery photos={photos} name={animal?.name ?? "Животное"} />
              ) : (
                <div className="aspect-[4/3] w-full rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                  Нет фото
                </div>
              )}
            </div>

            {/* Боковая колонка */}
            <div className="flex flex-col gap-4">

              {/* Имя и болезнь */}
              <div className="flex flex-col gap-1">
                {animal && (
                  <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 flex items-center gap-2">
                    <Pill className="size-6 text-[#D4849A] shrink-0" />
                    {animal.name}
                  </h1>
                )}
                <p className="text-base font-semibold text-[#D4849A] pl-8">{data.disease}</p>
              </div>

              {/* Описание */}
              {data.description && (
                <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-3">
                  <h2 className="font-bold text-stone-800 text-lg">О ситуации</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{data.description}</p>
                </div>
              )}

              {/* Сумма сбора */}
              {data.goal_amount != null && (
                <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-6 flex flex-col gap-1">
                  <p className="text-sm text-stone-500">Необходимая сумма</p>
                  <p className="text-3xl font-bold text-stone-800">{formatMoney(data.goal_amount)}</p>
                </div>
              )}

              {/* Кнопки */}
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-xl text-base"
                >
                  <Link href="/donate">
                    <Heart className="mr-2 size-4" />
                    Помочь сейчас
                  </Link>
                </Button>

                {animal && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10"
                  >
                    <Link href={`/pets/${animal.id}`}>Забрать домой</Link>
                  </Button>
                )}
              </div>

              {/* Пометка о безопасности */}
              <div className="rounded-2xl bg-white border border-stone-100 p-5 text-center">
                <p className="text-xs text-stone-400 leading-relaxed">
                  Оплата защищена. Переводы обрабатываются через&nbsp;Robokassa — безопасно и&nbsp;надёжно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
