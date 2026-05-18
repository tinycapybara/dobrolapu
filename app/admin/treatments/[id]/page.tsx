import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { TreatmentForm } from "../treatment-form"

async function getAnimals() {
  const { data } = await supabaseAdmin
    .from("animals")
    .select("id, name")
    .order("name")
  return (data ?? []) as { id: number; name: string }[]
}

type Props = { params: Promise<{ id: string }> }

export default async function EditTreatmentPage({ params }: Props) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) notFound()

  const [{ data: treatment }, animals] = await Promise.all([
    supabaseAdmin
      .from("treatments")
      .select("id, animal_id, disease, description, goal_amount, is_active")
      .eq("id", numericId)
      .single(),
    getAnimals(),
  ])

  if (!treatment) notFound()

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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-800">{treatment.disease}</h1>
          <Link
            href={`/treatments/${numericId}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#D4849A] transition-colors"
          >
            <ExternalLink className="size-3.5" />
            На сайте
          </Link>
        </div>
      </div>

      <TreatmentForm
        treatment={{
          id: treatment.id,
          animal_id: treatment.animal_id,
          disease: treatment.disease,
          description: treatment.description,
          goal_amount: Number(treatment.goal_amount),
          is_active: treatment.is_active,
        }}
        animals={animals}
      />
    </div>
  )
}
