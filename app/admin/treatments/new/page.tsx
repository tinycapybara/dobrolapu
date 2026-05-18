import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { TreatmentForm } from "../treatment-form"

async function getAnimals() {
  const { data } = await supabaseAdmin
    .from("animals")
    .select("id, name")
    .order("name")
  return (data ?? []) as { id: number; name: string }[]
}

export default async function NewTreatmentPage() {
  const animals = await getAnimals()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/treatments"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Назад к сборам
        </Link>
        <h1 className="text-2xl font-bold text-stone-800">Новый сбор</h1>
      </div>

      <TreatmentForm animals={animals} />
    </div>
  )
}
