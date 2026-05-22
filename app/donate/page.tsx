export const dynamic = "force-dynamic"

import { Heart } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { DonateForm, type RecentDonation } from "./donate-form"

async function getRecentDonations(): Promise<RecentDonation[]> {
  const { data, error } = await supabaseAdmin
    .from("donations")
    .select("id, donor_name, amount, comment, paid_at")
    .eq("status", "completed")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) console.error("getRecentDonations error:", error)
  return (data ?? []) as RecentDonation[]
}

async function getTreatmentLabel(id: number): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("treatments")
    .select("disease, animals!animal_id(name)")
    .eq("id", id)
    .single()

  if (!data) return null
  const animalName = (data.animals as unknown as { name: string } | null)?.name
  return animalName ? `${animalName} — ${data.disease}` : data.disease
}

type Props = { searchParams: Promise<Record<string, string>> }

export default async function DonatePage({ searchParams }: Props) {
  const params = await searchParams
  const forId = params["for"] ? Number(params["for"]) : null
  const treatmentId = forId && Number.isInteger(forId) && forId > 0 ? forId : null

  const [recentDonations, treatmentLabel] = await Promise.all([
    getRecentDonations(),
    treatmentId ? getTreatmentLabel(treatmentId) : Promise.resolve(null),
  ])

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <Heart className="size-7 text-[#D4849A] fill-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Помочь приюту</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Любая сумма помогает нашим питомцам получить заботу, лечение и шанс найти дом
            </p>
          </div>

          <DonateForm
            recentDonations={recentDonations}
            treatmentId={treatmentId ?? undefined}
            treatmentLabel={treatmentLabel ?? undefined}
          />

        </div>
      </main>

      <Footer />
    </div>
  )
}
