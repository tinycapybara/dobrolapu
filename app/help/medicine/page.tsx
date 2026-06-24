import Link from "next/link"
import { Pill, ArrowLeft, MapPin, Heart, CheckCircle2, Syringe } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Помочь с лекарствами | Добрые лапки",
  description: "Узнайте, какие препараты нужны приюту и как их передать",
}

const antiparasitic = [
  "Капли от блох и клещей (для кошек и собак)",
  "Антигельминтные таблетки (Мильбемакс, Дронтал)",
  "Ошейники от паразитов",
]

const vitamins = [
  "Витамины для шерсти и кожи (Омега-3)",
  "Кальций и витамин D для щенков и котят",
  "Иммуностимуляторы (Гамавит, Фоспренил)",
]

const surgical = [
  "Бинты, вата, пластырь, марля",
  "Хлоргексидин, перекись водорода, йод",
  "Одноразовые шприцы (1 мл, 5 мл, 10 мл)",
  "Послеоперационные попоны и воротники",
]

export default function MedicinePage() {
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
              Ветеринарные препараты — одна из главных статей расходов приюта. Ваша помощь жизненно важна
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Что нужно */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <Syringe className="size-5 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Что сейчас нужно</h2>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Антипаразитарные средства</p>
                  <ul className="flex flex-col gap-2">
                    {antiparasitic.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-teal-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Витамины и иммунитет</p>
                  <ul className="flex flex-col gap-2">
                    {vitamins.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-teal-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Перевязочные и расходники</p>
                  <ul className="flex flex-col gap-2">
                    {surgical.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-teal-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Как передать */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Как передать препараты</h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Вы можете привезти лекарства в приют лично — мы принимаем их каждый день с 10:00 до 18:00.
                Позвоните заранее, чтобы убедиться, что кто-то из сотрудников будет на месте.
              </p>
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 flex flex-col gap-1">
                <p className="text-sm font-semibold text-stone-800">Адрес приюта</p>
                <p className="text-sm text-stone-600">г. Санкт-Петербург, ул. Животноводческая, д. 12</p>
                <p className="text-sm text-stone-500">Пн–Вс, 10:00 – 18:00</p>
              </div>
            </div>

            {/* Пожертвовать деньги */}
            <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <Heart className="size-5 text-[#D4849A]" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Или пожертвуйте деньги на лечение</h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                Если нет возможности купить препараты — вы можете сделать денежное пожертвование.
                Мы сами приобретём всё необходимое для питомцев прямо сейчас.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
              >
                <Link href="/donate">
                  <Heart className="size-4 mr-2" />
                  Пожертвовать на лечение
                </Link>
              </Button>
            </div>

            {/* Ссылка на срочные сборы */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-stone-800">Срочные сборы на лечение</p>
                <p className="text-sm text-stone-500 mt-0.5">Помогите конкретному животному, которое сейчас болеет</p>
              </div>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 shrink-0">
                <Link href="/treatments">
                  <Pill className="size-4 mr-2" />
                  Смотреть сборы
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
