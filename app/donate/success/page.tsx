import crypto from "crypto"
import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Heart, PawPrint } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const metadata = {
  title: "Спасибо! | Добрые лапки",
}

async function confirmDonation(invId: string, outSum: string, signature: string) {
  const pass1 = process.env.ROBOKASSA_PASS1!
  const expected = crypto
    .createHash("md5")
    .update(`${outSum}:${invId}:${pass1}`)
    .digest("hex")
    .toLowerCase()

  if (signature.toLowerCase() !== expected) return

  await supabaseAdmin
    .from("donations")
    .update({ status: "completed", paid_at: new Date().toISOString() })
    .eq("inv_id", Number(invId))
    .eq("status", "pending")
}

type Props = { searchParams: Promise<Record<string, string>> }

export default async function DonateSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const invId = params["InvId"]
  const outSum = params["OutSum"]
  const signature = params["SignatureValue"]

  if (invId && outSum && signature) {
    await confirmDonation(invId, outSum, signature)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
          <div className="relative">
            <div className="size-28 rounded-full bg-[#FAF0F3] flex items-center justify-center">
              <Heart className="size-14 text-[#D4849A] fill-[#D4849A]" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-9 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">
              Спасибо за вашу помощь!
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Ваше пожертвование поможет нашим питомцам стать счастливее
            </p>
          </div>

          <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 px-6 py-5 text-stone-600 text-sm leading-relaxed space-y-2">
            <p>
              Каждый рубль идёт напрямую на корм, лечение и уход за нашими питомцами. Вы — часть
              большой команды людей, которые делают мир добрее.
            </p>
            <p className="flex items-center justify-center gap-2 font-medium text-[#D4849A]">
              <PawPrint className="size-4" />
              Мы очень вам благодарны
              <PawPrint className="size-4" />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild size="lg" variant="outline" className="flex-1 rounded-xl border-stone-200">
              <Link href="/">Вернуться на главную</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
            >
              <Link href="/pets">Посмотреть питомцев</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
