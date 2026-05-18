import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { AnimalForm } from "../animal-form"
import { PhotoManager } from "../photo-manager"

async function getLookups() {
  const [{ data: types }, { data: statuses }, { data: guardianships }] = await Promise.all([
    supabaseAdmin.from("animal_types").select("id, type").order("id"),
    supabaseAdmin.from("animal_statuses").select("id, status").order("id"),
    supabaseAdmin.from("guardianship_statuses").select("id, guardianship").order("id"),
  ])

  return {
    types: (types ?? []).map((t) => ({ id: t.id, label: t.type })),
    statuses: (statuses ?? []).map((s) => ({ id: s.id, label: s.status })),
    guardianships: (guardianships ?? []).map((g) => ({ id: g.id, label: g.guardianship })),
  }
}

type Props = { params: Promise<{ id: string }> }

export default async function EditAnimalPage({ params }: Props) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) notFound()

  const [{ data: animal }, { types, statuses, guardianships }] = await Promise.all([
    supabaseAdmin
      .from("animals")
      .select("id, name, gender, breed, age, size, type_id, status_id, guardianship_id, description, animal_photos(id, photo_url, is_main)")
      .eq("id", numericId)
      .single(),
    getLookups(),
  ])

  if (!animal) notFound()

  const photos = (animal.animal_photos as { id: number; photo_url: string; is_main: boolean }[]) ?? []

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/animals"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Назад к списку
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-800">{animal.name}</h1>
          <Link
            href={`/pets/${numericId}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#D4849A] transition-colors"
          >
            <ExternalLink className="size-3.5" />
            На сайте
          </Link>
        </div>
      </div>

      <AnimalForm
        animal={{
          id: animal.id,
          name: animal.name,
          gender: animal.gender,
          breed: animal.breed ?? null,
          age: animal.age ?? null,
          size: animal.size,
          type_id: animal.type_id,
          status_id: animal.status_id,
          guardianship_id: animal.guardianship_id,
          description: animal.description ?? null,
        }}
        types={types}
        statuses={statuses}
        guardianships={guardianships}
      />

      <PhotoManager animalId={numericId} photos={photos} />
    </div>
  )
}
