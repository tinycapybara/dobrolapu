import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export type Animal = {
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
  isSick?: boolean
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

export function AnimalCard({ animal }: { animal: Animal }) {
  const hasGuardian = animal.guardianship_statuses?.guardianship === "Есть опекун"
  const isSick = animal.isSick ?? false
  const photos = animal.animal_photos ?? []
  const mainPhoto = photos.find((p) => p.is_main) ?? photos[0] ?? null

  return (
    <div className="group rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md flex flex-col">
      {/* Фото */}
      <Link href={`/pets/${animal.id}`} className="relative block aspect-[4/3] overflow-hidden shrink-0">
        {mainPhoto ? (
          <Image
            src={mainPhoto.photo_url}
            alt={animal.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-stone-100">
            <span className="text-stone-400 text-sm">Нет фото</span>
          </div>
        )}

        {hasGuardian && (
          <Badge className="absolute left-3 top-3 gap-1 bg-[#9B8EC4] hover:bg-[#9B8EC4] text-white text-xs font-semibold px-2.5 py-1">
            <Heart className="size-3" />
            Мне помогают
          </Badge>
        )}

        {isSick && (
          <Badge className="absolute right-3 top-3 bg-red-500 hover:bg-red-500 text-white text-xs font-semibold px-2.5 py-1">
            Нуждается в лечении
          </Badge>
        )}
      </Link>

      {/* Информация */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-lg font-bold text-stone-800">{animal.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1.5 text-sm text-stone-500">
            <span>{animal.gender}</span>
            <span>·</span>
            <span>{formatAge(animal.age)}</span>
            {animal.animal_types && (
              <>
                <span>·</span>
                <span>{animal.animal_types.type}</span>
              </>
            )}
          </div>
        </div>

        <Button asChild size="lg" className="w-full mt-auto bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-xl">
          <Link href={`/pets/${animal.id}`}>
            Познакомиться
          </Link>
        </Button>
      </div>
    </div>
  )
}
