import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { AnimalForm } from "../animal-form"

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

export default async function NewAnimalPage() {
  const { types, statuses, guardianships } = await getLookups()

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
        <h1 className="text-2xl font-bold text-stone-800">Новое животное</h1>
        <p className="text-sm text-stone-400 mt-0.5">После создания можно будет добавить фотографии</p>
      </div>

      <AnimalForm types={types} statuses={statuses} guardianships={guardianships} />
    </div>
  )
}
