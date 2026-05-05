"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Photo = { photo_url: string; is_main: boolean }

export function AnimalGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const initialIndex = Math.max(photos.findIndex((p) => p.is_main), 0)
  const [index, setIndex] = useState(initialIndex)

  const hasManyPhotos = photos.length > 1
  const current = photos[index] ?? null

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex((i) => (i + 1) % photos.length)

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        {current ? (
          <Image
            src={current.photo_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-muted-foreground">Нет фото</span>
          </div>
        )}

        {hasManyPhotos && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Следующее фото"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {hasManyPhotos && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md transition-opacity",
                i === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={photo.photo_url}
                alt={`Фото ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
