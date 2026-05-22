import Link from "next/link"
import { Pill, ArrowLeft, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Помочь с лекарствами | Добрые лапки",
  description: "Животные, которым прямо сейчас нужна ветеринарная помощь",
}

type Treatment = {
  id: number
  disease: string
  description: string | null
  goal_amount: number | null
  collected?: number
  animals: {
    id: number
    name: string
    animal_photos: { photo_url: string; is_main: boolean }[]
  } | null
}

async function getActiveTreatments(): Promise<Treatment[]> {
  const { data, error } = await supabase
    .from("treatments")
    .select("id, disease, description, goal_amount, animals!animal_id(id, name, animal_photos(photo_url, is_main))")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching treatments:", error)
    return []
  }

  const raw = (data ?? []) as unknown as Treatment[]
  const ids = raw.map((t) => t.id)
  if (ids.length === 0) return raw

  const { data: donationRows } = await supabaseAdmin
    .from("donations")
    .select("treatment_id, amount")
    .in("treatment_id", ids)
    .eq("status", "completed")

  const collectedMap: Record<number, number> = {}
  for (const row of donationRows ?? []) {
    const tid = row.treatment_id as number
    collectedMap[tid] = (collectedMap[tid] ?? 0) + (row.amount as number)
  }

  return raw.map((t) => ({ ...t, collected: collectedMap[t.id] ?? 0 }))
}

function getMainPhoto(treatment: Treatment): string | null {
  const photos = treatment.animals?.animal_photos ?? []
  const main = photos.find((p) => p.is_main)
  return main?.photo_url ?? photos[0]?.photo_url ?? null
}

export default async function MedicinePage() {
  const treatments = await getActiveTreatments()

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">

          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Назад к способам помочь
          </Link>

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-teal-100 mb-4">
              <Pill className="size-7 text-teal-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Помочь с лекарствами</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Эти животные нуждаются в лечении прямо сейчас — каждое пожертвование приближает их к выздоровлению
            </p>
          </div>

          {treatments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center">
              <Pill className="size-10 text-stone-300 mb-4" />
              <p className="text-lg font-semibold text-stone-800">Активных сборов нет</p>
              <p className="mt-1 text-sm text-stone-400">Все питомцы сейчас здоровы — загляните позже</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {treatments.map((treatment) => {
                const photo = getMainPhoto(treatment)
                return (
                  <Link
                    key={treatment.id}
                    href={`/treatments/${treatment.id}`}
                    className="group rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex gap-4 p-4"
                  >
                    {/* Фото */}
                    <div className="size-20 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={treatment.animals?.name ?? ""}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <Pill className="size-7 text-stone-300" />
                        </div>
                      )}
                    </div>

                    {/* Текст */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                          Нуждается в лечении
                        </span>
                      </div>
                      <p className="font-bold text-stone-800">
                        {treatment.animals?.name ?? "Питомец"}
                      </p>
                      <p className="text-sm text-stone-500 line-clamp-1">{treatment.disease}</p>
                      {treatment.description && (
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                          {treatment.description}
                        </p>
                      )}
                      {treatment.goal_amount != null && (() => {
                        const goal = treatment.goal_amount as number
                        const collected = treatment.collected ?? 0
                        const percent = Math.min(Math.round((collected / goal) * 100), 100)
                        const reached = collected >= goal
                        return reached ? (
                          <p className="text-sm font-semibold text-green-600 mt-auto">✓ Цель достигнута!</p>
                        ) : (
                          <div className="flex flex-col gap-1 mt-auto">
                            <div className="h-1.5 w-full rounded-full bg-teal-100 overflow-hidden">
                              <div className="h-full rounded-full bg-teal-500" style={{ width: `${percent}%` }} />
                            </div>
                            <p className="text-xs text-stone-400">
                              Собрано: <span className="font-semibold text-teal-600">{collected.toLocaleString("ru-RU")} ₽</span>
                              {" "}из {goal.toLocaleString("ru-RU")} ₽
                            </p>
                          </div>
                        )
                      })()}
                    </div>

                    <ArrowRight className="size-5 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0 self-center" />
                  </Link>
                )
              })}

              <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">Хотите увидеть все сборы?</p>
                  <p className="text-sm text-stone-500 mt-0.5">Перейдите в каталог срочных сборов</p>
                </div>
                <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white shrink-0">
                  <Link href="/treatments">
                    <Pill className="size-4 mr-2" />
                    Все сборы
                  </Link>
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
