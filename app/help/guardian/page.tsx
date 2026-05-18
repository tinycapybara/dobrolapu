import Link from "next/link"
import { Heart, ArrowLeft, Home, PawPrint, CheckCircle2, HelpCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Стать опекуном | Добрые лапки",
  description: "Узнайте, как стать опекуном питомца или взять его домой навсегда",
}

const guardianPerks = [
  "Вы помогаете конкретному питомцу — он знает вас и ждёт",
  "Можно навещать питомца в приюте в любое удобное время",
  "Вы покрываете часть расходов на его содержание и лечение",
  "Питомец живёт в приюте — вам не нужно менять свой быт",
  "Если когда-нибудь решите забрать его домой — вы уже знаете друг друга",
]

const adoptionSteps = [
  {
    num: "1",
    title: "Выберите питомца",
    description: "Посмотрите анкеты в каталоге или приходите познакомиться лично.",
  },
  {
    num: "2",
    title: "Пообщайтесь с нами",
    description: "Мы расскажем об особенностях питомца и ответим на все вопросы.",
  },
  {
    num: "3",
    title: "Подпишите договор",
    description: "Простое соглашение о том, что питомец будет в хороших руках.",
  },
  {
    num: "4",
    title: "Заберите домой",
    description: "Мы выдадим ветпаспорт, расскажем о питании и уходе и останемся на связи.",
  },
]

const faqs = [
  {
    q: "Что если питомец не приживётся?",
    a: "Мы всегда готовы помочь и принять питомца обратно. Главное — не оставлять его в беде.",
  },
  {
    q: "Можно взять животное в квартиру?",
    a: "Да. Мы учитываем жилищные условия при подборе питомца — подберём того, кто подойдёт именно вам.",
  },
  {
    q: "Есть ли ограничения по породе или возрасту?",
    a: "Нет. У нас живут разные питомцы — котята и пожилые кошки, щенки и взрослые собаки. Расскажите нам о себе, и мы поможем найти вашего.",
  },
]

export default function GuardianPage() {
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
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-rose-100 mb-4">
              <Heart className="size-7 text-rose-500" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Стать опекуном или забрать домой</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Дайте питомцу любовь и заботу — или просто помогайте ему прямо здесь, в приюте
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Опекунство */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Heart className="size-5 text-rose-500" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Что такое опекунство</h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Опекун — это человек, который помогает конкретному питомцу, пока тот живёт в приюте.
                Вы приходите, общаетесь, участвуете в его жизни и помогаете оплачивать уход.
              </p>
              <ul className="flex flex-col gap-2.5">
                {guardianPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-rose-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-stone-600">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Взять домой */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Home className="size-5 text-rose-500" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Взять питомца домой</h2>
              </div>
              <div className="flex flex-col gap-4">
                {adoptionSteps.map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="size-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 font-bold text-rose-500 text-sm">
                      {step.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{step.title}</p>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="size-5 text-rose-500" />
                </div>
                <h2 className="text-lg font-bold text-stone-800">Частые вопросы</h2>
              </div>
              <div className="flex flex-col gap-4">
                {faqs.map((faq) => (
                  <div key={faq.q}>
                    <p className="text-sm font-semibold text-stone-800">{faq.q}</p>
                    <p className="text-sm text-stone-500 leading-relaxed mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="font-bold text-stone-800 text-lg">Готовы познакомиться?</p>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  Посмотрите анкеты наших питомцев или напишите нам — мы поможем найти вашего.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
                >
                  <Link href="/pets">
                    <PawPrint className="size-4 mr-2" />
                    Смотреть питомцев
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-stone-200"
                >
                  <Link href="/contacts">
                    Написать нам
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
