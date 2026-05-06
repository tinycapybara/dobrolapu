import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  const photos = animal.animal_photos ?? []
  const mainPhoto = photos.find((p) => p.is_main) ?? photos[0] ?? null

  return (
    <Card className="group overflow-hidden p-0 transition-shadow hover:shadow-lg">
      {/* Фото */}
      <Link href={`/pets/${animal.id}`} className="relative block aspect-[4/3] overflow-hidden">
        {mainPhoto ? (
          <Image
            src={mainPhoto.photo_url}
            alt={animal.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">Нет фото</span>
          </div>
        )}

        {/* Плашка "Мне помогают" */}
        {hasGuardian && (
          <Badge className="absolute left-3 top-3 gap-1 bg-green-500 hover:bg-green-500">
            <Heart className="size-3" />
            Мне помогают
          </Badge>
        )}
      </Link>
      
      {/* Информация */}
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-bold">{animal.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-sm font-medium text-stone-600">
            <span>{animal.gender}</span>
            <span>·</span>
            <span>{formatAge(animal.age)}</span>
          </div>
        </div>
        
        <Button asChild className="w-full text-base">
          <Link href={`/pets/${animal.id}`}>
            Познакомиться
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}