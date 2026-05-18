import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimalGallery } from "./animal-gallery"
import { AdoptionButtons } from "./adoption-request-modal"
import { ArrowLeft, Heart, Pill } from "lucide-react"

type Treatment = {
  disease: string
  description: string | null
  goal_amount: number | null
}

type AnimalDetail = {
  id: number
  name: string
  gender: string
  breed: string | null
  age: number | null
  size: string
  description: string | null
  animal_photos: { photo_url: string; is_main: boolean }[]
  animal_types: { type: string } | null
  animal_statuses: { status: string } | null
  guardianship_statuses: { guardianship: string } | null
}

const SIZE_LABELS: Record<string, string> = {
  small: "Маленький",
  medium: "Средний",
  large: "Большой",
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n)

function formatAge(months: number | null): string {
  if (months === null) return "Возраст неизвестен"

  const pluralYears = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return "год"
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "года"
    return "лет"
  }
  const pluralMonths = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return "месяц"
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "месяца"
    return "месяцев"
  }

  const years = Math.floor(months / 12)
  const rem = months % 12

  if (years === 0) return `${months} ${pluralMonths(months)}`
  if (rem === 0) return `${years} ${pluralYears(years)}`
  return `${years} ${pluralYears(years)} ${rem} ${pluralMonths(rem)}`
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const { data } = await supabase
    .from("animals")
    .select("name")
    .eq("id", Number(id))
    .single()

  return {
    title: data ? `${data.name} | Добрые лапки` : "Животное | Добрые лапки",
  }
}

export default async function AnimalPage({ params }: Props) {
  const { id } = await params
  const numericId = Number(id)

  if (!Number.isInteger(numericId) || numericId <= 0) notFound()

  const [{ data, error }, { data: treatmentData }] = await Promise.all([
    supabase
      .from("animals")
      .select(`
        id, name, gender, breed, age, size, description,
        animal_photos(photo_url, is_main),
        animal_types(type),
        animal_statuses(status),
        guardianship_statuses(guardianship)
      `)
      .eq("id", numericId)
      .single(),
    supabase
      .from("treatments")
      .select("disease, description, goal_amount")
      .eq("animal_id", numericId)
      .eq("is_active", true)
      .maybeSingle(),
  ])

  if (error || !data) notFound()

  const animal = data as unknown as AnimalDetail
  const treatment = treatmentData as Treatment | null
  const hasGuardian = animal.guardianship_statuses?.guardianship === "Есть опекун"

  const characteristics = [
    { label: "Пол", value: animal.gender },
    { label: "Возраст", value: formatAge(animal.age) },
    animal.breed ? { label: "Порода", value: animal.breed } : null,
    { label: "Размер", value: SIZE_LABELS[animal.size] ?? animal.size },
    animal.animal_statuses ? { label: "Статус", value: animal.animal_statuses.status } : null,
    animal.guardianship_statuses ? { label: "Опекунство", value: animal.guardianship_statuses.guardianship } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* Навигация */}
          <Button asChild variant="ghost" className="mb-6 -ml-3 gap-2 text-stone-500 hover:text-stone-800">
            <Link href="/pets">
              <ArrowLeft className="size-4" />
              Назад к списку
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">

            {/* Галерея */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <AnimalGallery photos={animal.animal_photos} name={animal.name} />
            </div>

            {/* Информация */}
            <div className="flex flex-col gap-4">

              {/* Имя + бейджи */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">{animal.name}</h1>
                  {animal.animal_types && (
                    <Badge className="bg-[#FAF0F3] text-[#D4849A] hover:bg-[#FAF0F3] border border-[#D4849A]/20 text-sm">
                      {animal.animal_types.type}
                    </Badge>
                  )}
                  {hasGuardian && (
                    <Badge className="gap-1 bg-[#9B8EC4] hover:bg-[#9B8EC4] text-white text-xs font-semibold px-2.5 py-1">
                      <Heart className="size-3" />
                      Мне помогают
                    </Badge>
                  )}
                </div>
              </div>

              {/* Характеристики */}
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-4">
                  Характеристики
                </h2>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {characteristics.map((c) => (
                    <div key={c.label}>
                      <dt className="text-xs text-stone-400 mb-0.5">{c.label}</dt>
                      <dd className="text-sm font-semibold text-stone-800">{c.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Описание */}
              {animal.description && (
                <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">
                    О животном
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{animal.description}</p>
                </div>
              )}

              {/* Блок лечения */}
              {treatment && (
                <div className="rounded-2xl border border-[#D4849A]/20 bg-[#FAF0F3] p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Pill className="size-4 text-[#D4849A]" />
                    <span className="text-sm font-semibold text-[#D4849A]">Нуждается в лечении</span>
                    <Badge className="ml-auto bg-red-500 hover:bg-red-500 text-white text-xs font-semibold px-2.5 py-1">
                      СРОЧНО
                    </Badge>
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{treatment.disease}</p>
                    {treatment.description && (
                      <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                        {treatment.description}
                      </p>
                    )}
                  </div>
                  {treatment.goal_amount != null && (
                    <p className="text-sm font-semibold text-stone-700">
                      Цель сбора: {formatMoney(treatment.goal_amount)}
                    </p>
                  )}
                  <Button asChild className="w-full bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-xl">
                    <Link href="/donate">
                      <Heart className="mr-2 size-4" />
                      Помочь {animal.name}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Кнопки действий */}
              <AdoptionButtons
                animalId={animal.id}
                animalName={animal.name}
                hasGuardian={hasGuardian}
              />

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
