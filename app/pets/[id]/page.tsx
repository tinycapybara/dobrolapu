import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimalGallery } from "./animal-gallery"
import { ArrowLeft, Heart } from "lucide-react"

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

  const { data, error } = await supabase
    .from("animals")
    .select(`
      id, name, gender, breed, age, size, description,
      animal_photos(photo_url, is_main),
      animal_types(type),
      animal_statuses(status),
      guardianship_statuses(guardianship)
    `)
    .eq("id", numericId)
    .single()

  if (error || !data) notFound()

  const animal = data as unknown as AnimalDetail
  const hasGuardian = animal.guardianship_statuses?.guardianship === "Есть опекун"

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 -ml-3 gap-2">
          <Link href="/pets">
            <ArrowLeft className="size-4" />
            Назад к списку
          </Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-2">
          <AnimalGallery photos={animal.animal_photos} name={animal.name} />

          <div className="flex flex-col gap-6">
            {/* Название + бейджи */}
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {animal.animal_types && (
                  <Badge variant="secondary">{animal.animal_types.type}</Badge>
                )}
                {hasGuardian && (
                  <Badge className="gap-1 bg-green-500 hover:bg-green-500">
                    <Heart className="size-3" />
                    Мне помогают
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{animal.name}</h1>
            </div>

            {/* Характеристики */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Пол</dt>
                <dd className="mt-0.5 font-medium">{animal.gender}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Возраст</dt>
                <dd className="mt-0.5 font-medium">{formatAge(animal.age)}</dd>
              </div>
              {animal.breed && (
                <div>
                  <dt className="text-muted-foreground">Порода</dt>
                  <dd className="mt-0.5 font-medium">{animal.breed}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Размер</dt>
                <dd className="mt-0.5 font-medium">
                  {SIZE_LABELS[animal.size] ?? animal.size}
                </dd>
              </div>
              {animal.animal_statuses && (
                <div>
                  <dt className="text-muted-foreground">Статус</dt>
                  <dd className="mt-0.5 font-medium">{animal.animal_statuses.status}</dd>
                </div>
              )}
              {animal.guardianship_statuses && (
                <div>
                  <dt className="text-muted-foreground">Опекунство</dt>
                  <dd className="mt-0.5 font-medium">
                    {animal.guardianship_statuses.guardianship}
                  </dd>
                </div>
              )}
            </dl>

            {/* Описание */}
            {animal.description && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  О животном
                </h2>
                <p className="leading-relaxed text-sm">{animal.description}</p>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {hasGuardian ? (
                <Badge className="flex h-11 flex-1 items-center justify-center gap-1 bg-green-500 text-sm hover:bg-green-500">
                  <Heart className="size-4" />
                  Есть опекун
                </Badge>
              ) : (
                <Button size="lg" variant="outline" className="flex-1">
                  Стать опекуном
                </Button>
              )}
              <Button size="lg" className="flex-1">
                Забрать домой
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
