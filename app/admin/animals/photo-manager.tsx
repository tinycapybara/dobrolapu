"use client"

import { useState, useTransition, useRef } from "react"
import { Loader2, Star, Trash2, Upload, ImagePlus } from "lucide-react"
import { deletePhoto, setMainPhoto, addPhoto } from "./actions"

type Photo = {
  id: number
  photo_url: string
  is_main: boolean
}

export function PhotoManager({ animalId, photos }: { animalId: number; photos: Photo[] }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? "Ошибка загрузки")
        return
      }

      const isFirst = photos.length === 0
      startTransition(async () => {
        await addPhoto(animalId, data.url, isFirst)
      })
    } catch {
      setError("Ошибка соединения")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  function handleDelete(photoId: number) {
    startTransition(async () => {
      await deletePhoto(photoId, animalId)
    })
  }

  function handleSetMain(photoId: number) {
    startTransition(async () => {
      await setMainPhoto(photoId, animalId)
    })
  }

  const busy = isPending || uploading

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-800">Фотографии</h2>
        <label className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border cursor-pointer transition-colors ${
          busy
            ? "opacity-50 pointer-events-none bg-stone-50 border-stone-200 text-stone-400"
            : "bg-white border-stone-200 text-stone-700 hover:border-[#D4849A] hover:text-[#D4849A]"
        }`}>
          {uploading
            ? <><Loader2 className="size-4 animate-spin" />Загружаем...</>
            : <><Upload className="size-4" />Загрузить фото</>
          }
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={busy}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {photos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 py-12 flex flex-col items-center gap-2 text-stone-400">
          <ImagePlus className="size-8 text-stone-300" />
          <p className="text-sm">Фотографий пока нет</p>
          <p className="text-xs">Загрузите первую фотографию</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-stone-100">
              <img
                src={photo.photo_url}
                alt=""
                className="size-full object-cover"
              />

              {photo.is_main && (
                <div className="absolute top-2 left-2 bg-[#D4849A] rounded-lg px-2 py-0.5 flex items-center gap-1">
                  <Star className="size-3 text-white fill-white" />
                  <span className="text-xs text-white font-semibold">Главное</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!photo.is_main && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(photo.id)}
                    disabled={busy}
                    title="Сделать главным"
                    className="size-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Star className="size-4 text-amber-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={busy}
                  title="Удалить"
                  className="size-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                >
                  <Trash2 className="size-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-stone-400">
        Наведите на фото чтобы удалить или сделать главным. Первое загруженное фото становится главным автоматически.
      </p>
    </div>
  )
}
