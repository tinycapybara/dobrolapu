"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// ── Types ─────────────────────────────────────────────────────────────────────

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

type SimpleAnimal = {
  id: number
  name: string
  adopted_at: string | null
  animal_photos: { photo_url: string; is_main: boolean }[]
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n)

// Скролл на ширину одного слайда (читаем из DOM, не хардкодим пиксели)
function makeScroller(ref: React.RefObject<HTMLDivElement | null>) {
  return (dir: "left" | "right") => {
    const el = ref.current
    if (!el) return
    const slideWidth = el.clientWidth
    el.scrollBy({ left: dir === "right" ? slideWidth : -slideWidth, behavior: "smooth" })
  }
}

// ── TreatmentCard ─────────────────────────────────────────────────────────────

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const photos = treatment.animals?.animal_photos ?? []
  const photo = photos.find((p) => p.is_main) ?? photos[0] ?? null
  const animal = treatment.animals

  return (
    <Link href={`/treatments/${treatment.id}`} className="block h-full">
      <Card className="group overflow-hidden p-0 transition-shadow hover:shadow-lg h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          {photo ? (
            <Image
              src={photo.photo_url}
              alt={animal?.name ?? "Животное"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <PawPrint className="size-12 text-stone-300" />
            </div>
          )}
          <Badge className="absolute left-3 top-3 bg-red-500 hover:bg-red-500 text-white">
            СРОЧНО
          </Badge>
        </div>

        <CardContent className="p-4 flex flex-col gap-2 flex-1">
          <div>
            <h3 className="text-xl font-bold">{animal?.name ?? "—"}</h3>
            <p className="text-[#D4849A] font-semibold text-base">{treatment.disease}</p>
          </div>

          {treatment.description && (
            <p className="text-stone-500 text-sm leading-relaxed">{treatment.description}</p>
          )}

          {treatment.goal_amount != null && (
            <p className="font-bold text-stone-800 text-lg">
              Цель: {formatMoney(treatment.goal_amount)}
            </p>
          )}

          <Button asChild className="w-full mt-auto bg-[#D4849A] hover:bg-[#C4728A] text-white text-base">
            <span>Помочь</span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── UrgentCarousel ────────────────────────────────────────────────────────────

export function UrgentCarousel({ treatments }: { treatments: Treatment[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = makeScroller(ref)
  const items = treatments.slice(0, 6)

  return (
    <div className="relative">
      {items.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-[35%] -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
            aria-label="Предыдущий"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-[35%] -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
            aria-label="Следующий"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {items.map((t, i) => (
          <div
            key={i}
            // mobile: 1 карточка на всю ширину; sm: 2 карточки
            className="w-full shrink-0 snap-start sm:w-[calc(50%-8px)]"
          >
            <TreatmentCard treatment={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FoundHomeCard ─────────────────────────────────────────────────────────────

export function FoundHomeCard({ animal }: { animal: SimpleAnimal }) {
  const photos = animal.animal_photos ?? []
  const photo = photos.find((p) => p.is_main) ?? photos[0] ?? null

  return (
    <div className="group flex flex-col gap-2">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100">
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
      </div>
      <div>
        <p className="text-base font-bold text-stone-800">{animal.name}</p>
        <p className="text-sm font-medium text-[#D4849A]">Забрали домой</p>
        {animal.adopted_at && (
          <p className="text-sm text-stone-500">
            {new Date(animal.adopted_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  )
}

// ── FoundHomeCarousel ─────────────────────────────────────────────────────────

export function FoundHomeCarousel({ animals }: { animals: SimpleAnimal[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = makeScroller(ref)
  const items = animals.slice(0, 4)

  return (
    <div className="relative">
      {items.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-[40%] -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
            aria-label="Предыдущий"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-[40%] -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white transition-colors"
            aria-label="Следующий"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {items.map((animal) => (
          <div
            key={animal.id}
            className="w-full shrink-0 snap-start sm:w-[calc(50%-8px)]"
          >
            <FoundHomeCard animal={animal} />
          </div>
        ))}
      </div>
    </div>
  )
}
