import Link from "next/link"
import { ShoppingCart, Pill, Heart, Users, Gift, ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Как помочь | Добрые лапки",
  description: "Способы помочь приюту — корм, лекарства, волонтёрство, опекунство и пожертвования",
}

const ways = [
  {
    icon: <ShoppingCart className="size-7 text-amber-600" />,
    iconBg: "bg-amber-100",
    title: "Помочь с кормом",
    description: "Питомцы приюта нуждаются в качественном питании каждый день. Узнайте, какой корм нужен прямо сейчас.",
    href: "/help/food",
    color: "border-amber-200 hover:border-amber-400",
  },
  {
    icon: <Pill className="size-7 text-teal-600" />,
    iconBg: "bg-teal-100",
    title: "Помочь с лекарствами",
    description: "Многие наши питомцы нуждаются в лечении. Здесь — список животных которым нужна помощь прямо сейчас.",
    href: "/help/medicine",
    color: "border-teal-200 hover:border-teal-400",
  },
  {
    icon: <Users className="size-7 text-purple-600" />,
    iconBg: "bg-purple-100",
    title: "Стать волонтёром",
    description: "Помогайте кормить и выгуливать питомцев, участвуйте в жизни приюта — даже несколько часов в неделю важны.",
    href: "/help/volunteer",
    color: "border-purple-200 hover:border-purple-400",
  },
  {
    icon: <Heart className="size-7 text-rose-500" />,
    iconBg: "bg-rose-100",
    title: "Стать опекуном или забрать домой",
    description: "Опекун помогает конкретному питомцу пока тот живёт в приюте. Или заберите питомца домой навсегда.",
    href: "/help/guardian",
    color: "border-rose-200 hover:border-rose-400",
  },
  {
    icon: <Gift className="size-7 text-orange-500" />,
    iconBg: "bg-orange-100",
    title: "Пожертвовать",
    description: "Любая сумма идёт напрямую на корм, лечение и уход за нашими питомцами.",
    href: "/donate",
    color: "border-orange-200 hover:border-orange-400",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          <div className="mb-12 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <Heart className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Как помочь приюту</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Даже если вы не можете взять питомца домой — вы всё равно можете изменить чью-то жизнь
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ways.map((way) => (
              <Link
                key={way.href}
                href={way.href}
                className={`group rounded-2xl bg-white border-2 ${way.color} shadow-sm p-6 flex flex-col gap-4 transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className={`${way.iconBg} size-14 rounded-xl flex items-center justify-center`}>
                  {way.icon}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h2 className="text-lg font-bold text-stone-800">{way.title}</h2>
                  <p className="text-sm text-stone-500 leading-relaxed">{way.description}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-stone-400 group-hover:text-stone-600 transition-colors">
                  Подробнее
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
