import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Heart, MessageCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Контакты | Добрые лапки",
  description: "Адрес, телефон и режим работы приюта «Добрые лапки»",
}

const contacts = [
  {
    icon: MapPin,
    title: "Адрес",
    lines: ["ул. Животноводческая, 12", "г. Санкт-Петербург, 196105"],
    bg: "bg-[#FAF0F3]",
    iconColor: "text-[#D4849A]",
  },
  {
    icon: Phone,
    title: "Телефон",
    lines: ["+7 (495) 123-45-67", "Ежедневно с 10:00 до 19:00"],
    bg: "bg-[#F0F5FA]",
    iconColor: "text-[#7A9FD4]",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["help@dobryelapki.ru", "Ответим в течение суток"],
    bg: "bg-[#F0FAF5]",
    iconColor: "text-[#6BBF9A]",
  },
  {
    icon: Clock,
    title: "Режим работы",
    lines: ["Пн–Пт: 10:00 – 19:00", "Сб–Вс: 11:00 – 18:00"],
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
]

const faq = [
  {
    q: "Можно ли приехать посмотреть на животных?",
    a: "Да, мы рады гостям! Приезжайте в часы работы приюта. Рекомендуем заранее позвонить, чтобы мы могли вас встретить.",
  },
  {
    q: "Как забрать животное домой?",
    a: "Найдите питомца в каталоге, нажмите «Хочу забрать домой» и заполните анкету. Мы свяжемся с вами для знакомства.",
  },
  {
    q: "Как стать волонтёром?",
    a: "Заполните форму на странице «Стать волонтёром» — расскажите о себе и удобном времени. Мы напишем вам в ближайшее время.",
  },
  {
    q: "Принимаете ли вы вещи и корм?",
    a: "Да! Принимаем корм, лежанки, игрушки, пелёнки и ветпрепараты. Уточните актуальный список по телефону или email.",
  },
]

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#FDF8F3] via-[#FAF0F3] to-[#FAE8DC] py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-white/60 mb-6">
              <MessageCircle className="size-8 text-[#D4849A]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-4">Контакты</h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Мы всегда рады ответить на ваши вопросы — пишите, звоните или приезжайте лично
            </p>
          </div>
        </section>

        {/* Карточки контактов */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contacts.map((c) => (
                <div key={c.title} className={`${c.bg} rounded-2xl p-6 flex flex-col gap-3`}>
                  <div className="size-11 rounded-xl bg-white/70 flex items-center justify-center">
                    <c.icon className={`size-5 ${c.iconColor}`} />
                  </div>
                  <p className="font-bold text-stone-800">{c.title}</p>
                  {c.lines.map((line, i) => (
                    <p key={i} className={`text-sm leading-relaxed ${i === 0 ? "text-stone-700 font-medium" : "text-stone-400"}`}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Как добраться */}
        <section className="py-16 px-4 bg-[#FDF8F9]">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">Как добраться</h2>
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-2 mb-6 text-center">
              <div className="size-12 rounded-full bg-[#FAF0F3] flex items-center justify-center mx-auto mb-1">
                <MapPin className="size-6 text-[#D4849A]" />
              </div>
              <p className="font-bold text-stone-800 text-lg">ул. Животноводческая, 12</p>
              <p className="text-stone-500">г. Санкт-Петербург, 196105</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex gap-4">
                <div className="size-10 rounded-full bg-[#FAF0F3] flex items-center justify-center shrink-0 text-lg font-bold text-[#D4849A]">М</div>
                <div>
                  <p className="font-semibold text-stone-800">На метро</p>
                  <p className="text-sm text-stone-500 mt-0.5">Станция «Электросила», затем 10 минут пешком по ул. Животноводческой</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex gap-4">
                <div className="size-10 rounded-full bg-[#F0F5FA] flex items-center justify-center shrink-0 text-lg font-bold text-[#7A9FD4]">А</div>
                <div>
                  <p className="font-semibold text-stone-800">На автобусе</p>
                  <p className="text-sm text-stone-500 mt-0.5">Автобусы № 14, 37, 141 — остановка «Животноводческая улица»</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex gap-4">
                <div className="size-10 rounded-full bg-[#F0FAF5] flex items-center justify-center shrink-0 text-lg font-bold text-[#6BBF9A]">П</div>
                <div>
                  <p className="font-semibold text-stone-800">На машине</p>
                  <p className="text-sm text-stone-500 mt-0.5">Бесплатная парковка во дворе. Въезд со стороны ул. Животноводческой</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">Частые вопросы</h2>
            <div className="flex flex-col gap-4">
              {faq.map((item) => (
                <div key={item.q} className="rounded-2xl bg-[#FDF8F9] border border-stone-100 p-5 flex flex-col gap-2">
                  <p className="font-semibold text-stone-800">{item.q}</p>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-4 bg-[#FAF0F3]">
          <div className="container mx-auto max-w-xl text-center flex flex-col gap-4">
            <Heart className="size-8 text-[#D4849A] fill-[#D4849A] mx-auto" />
            <h2 className="text-2xl font-bold text-stone-800">Ждём вас!</h2>
            <p className="text-stone-500">Приходите познакомиться с нашими питомцами — они будут очень рады</p>
            <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white mx-auto px-10">
              <Link href="/pets">Посмотреть питомцев</Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
