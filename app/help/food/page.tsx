import Link from "next/link"
import { ShoppingCart, ArrowLeft, MapPin, Heart, CheckCircle2, Package } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Помочь с кормом | Добрые лапки",
  description: "Узнайте, какой корм нужен приюту и как его доставить",
}

const dryFood = [
  "Сухой корм для кошек — взрослый и для котят",
  "Сухой корм для собак — взрослый и для щенков",
  "Диетический корм для животных после операций",
]

const wetFood = [
  "Консервы для кошек (паштет, кусочки в желе)",
  "Консервы для собак (паштет, рагу)",
  "Пресервы для пожилых животных",
]

const other = [
  "Лакомства для дрессировки (собаки)",
  "Витаминные добавки для шерсти и суставов",
  "Кормушки и миски (пластик, нержавейка)",
]

export default function FoodPage() {
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
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-amber-100 mb-4">
              <ShoppingCart className="size-7 text-amber-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Помочь с кормом</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Питомцы приюта нуждаются в качественном питании каждый день — ваша помощь очень важна
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Что нужно */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Package className="size-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Что сейчас нужно</h2>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Сухой корм</p>
                  <ul className="flex flex-col gap-2">
                    {dryFood.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Влажный корм</p>
                  <ul className="flex flex-col gap-2">
                    {wetFood.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Прочее</p>
                  <ul className="flex flex-col gap-2">
                    {other.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Как привезти */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Как привезти корм</h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Вы можете привезти корм в приют лично — мы принимаем его каждый день с 10:00 до 18:00.
                Позвоните заранее, чтобы убедиться, что кто-то из сотрудников будет на месте.
              </p>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex flex-col gap-1">
                <p className="text-sm font-semibold text-stone-800">Адрес приюта</p>
                <p className="text-sm text-stone-600">г. Москва, ул. Примерная, д. 1</p>
                <p className="text-sm text-stone-500">Пн–Вс, 10:00 – 18:00</p>
              </div>
            </div>

            {/* Пожертвовать деньги */}
            <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <Heart className="size-5 text-[#D4849A]" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Или пожертвуйте деньги на корм</h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Если нет возможности привезти корм — вы можете сделать денежное пожертвование.
                Мы сами купим то, что нужно питомцам прямо сейчас.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
              >
                <Link href="/donate">
                  <Heart className="size-4 mr-2" />
                  Пожертвовать на корм
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
