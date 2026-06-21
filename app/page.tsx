import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Pill, Heart, Users, Gift, ArrowRight, Sparkles, PawPrint } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { AnimalCard, type Animal } from "@/components/animal-card"
import {
  TreatmentCard,
  UrgentCarousel,
  FoundHomeCard,
  FoundHomeCarousel,
} from "./home-carousels"
import { Footer } from "@/components/ui/footer"

type Stats = { inShelter: number; foundHome: number; hasGuardian: number }

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

type SimpleAnimal = {
  id: number
  name: string
  adopted_at: string | null
  animal_photos: { photo_url: string; is_main: boolean }[]
}

async function getPageData() {
  const [s1, s2, s3, tr, ra, fh] = await Promise.all([
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 1),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 2),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("guardianship_id", 2),
    supabase
      .from("treatments")
      .select("id, disease, description, goal_amount, animals!animal_id(id, name, animal_photos(photo_url, is_main))")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("animals")
      .select(`
        id, name, gender, breed, age, size, description,
        animal_photos(photo_url, is_main),
        animal_types(type),
        animal_statuses(status),
        guardianship_statuses(guardianship)
      `)
      .eq("status_id", 1)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("animals")
      .select("id, name, adopted_at, animal_photos(photo_url, is_main)")
      .eq("status_id", 2)
      .limit(4),
  ])

  const rawTreatments = (tr.data ?? []) as unknown as Treatment[]
  const treatmentIds = rawTreatments.map((t) => t.id)

  const collectedMap: Record<number, number> = {}
  if (treatmentIds.length > 0) {
    const { data: donationRows } = await supabaseAdmin
      .from("donations")
      .select("treatment_id, amount")
      .in("treatment_id", treatmentIds)
      .eq("status", "completed")

    for (const row of donationRows ?? []) {
      const tid = row.treatment_id as number
      collectedMap[tid] = (collectedMap[tid] ?? 0) + (row.amount as number)
    }
  }

  const treatments = rawTreatments.map((t) => ({ ...t, collected: collectedMap[t.id] ?? 0 }))

  return {
    stats: {
      inShelter: s1.count ?? 0,
      foundHome: s2.count ?? 0,
      hasGuardian: s3.count ?? 0,
    },
    treatments,
    recentAnimals: (ra.data ?? []) as unknown as Animal[],
    foundHomeAnimals: (fh.data ?? []) as unknown as SimpleAnimal[],
  }
}

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Добрые лапки — Городской приют для животных",
  description:
    "Помогаем кошкам и собакам найти любящий дом. Познакомьтесь с нашими питомцами или поддержите приют.",
}

export default async function HomePage() {
  const { stats, treatments, recentAnimals, foundHomeAnimals } = await getPageData()

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />
      <HeroSection />
      <StatsSection stats={stats} />
      <QuizCtaSection />
      {treatments.length > 0 && <UrgentSection treatments={treatments} />}
      <AboutSection />
      <HowToHelpSection />
      <RecentAnimalsSection animals={recentAnimals} />
      {foundHomeAnimals.length > 0 && <FoundHomeSection animals={foundHomeAnimals} />}
      <FaqSection />
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FAF0F3] to-[#FAE8DC] min-h-[85vh] flex items-center">
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-[#D4849A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full bg-[#D4849A]/8 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
              Здесь каждый хвостик ждёт{" "}
              <span className="text-[#D4849A]">своего человека</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed max-w-md">
              Мы помогаем кошкам и собакам найти любящий дом. Каждый питомец в нашем приюте
              заслуживает тепла, заботы и настоящей семьи.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#D4849A] hover:bg-[#C4728A] text-white text-base rounded-xl px-8 shadow-lg shadow-[#D4849A]/25"
              >
                <Link href="/pets">
                  Найти питомца
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl px-8 text-base border-stone-200 hover:bg-stone-50 text-stone-700"
              >
                <Link href="/donate">Помочь приюту</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <Image
                src="/cat3.jpg"
                alt="Кот в приюте"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="absolute -bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#FAF0F3] flex items-center justify-center">
                <Heart className="size-4 text-[#D4849A] fill-[#D4849A]" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Ждут своего дома</p>
                <p className="text-sm font-bold text-stone-800">Прямо сейчас</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection({ stats }: { stats: Stats }) {
  const items = [
    {
      value: stats.inShelter,
      label: "Питомцев в приюте",
      sub: "ждут своего дома",
      bg: "bg-[#FAF0F3]",
      text: "text-[#D4849A]",
    },
    {
      value: stats.foundHome,
      label: "Нашли дом",
      sub: "с нашей помощью",
      bg: "bg-[#F0FAF5]",
      text: "text-[#6BBF9A]",
    },
    {
      value: stats.hasGuardian,
      label: "Есть опекун",
      sub: "о них уже заботятся",
      bg: "bg-[#F0F5FA]",
      text: "text-[#7A9FD4]",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-8 text-center shadow-sm`}>
              <p className={`${item.text} text-5xl lg:text-6xl font-bold tabular-nums mb-2`}>
                {item.value.toLocaleString("ru-RU")}
              </p>
              <p className="text-stone-800 font-semibold text-lg">{item.label}</p>
              <p className="text-stone-400 text-sm mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Button asChild size="lg" className="bg-[#D4849A] hover:bg-[#C4728A] text-white text-base px-12 rounded-xl">
            <Link href="/pets">Стать опекуном</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function UrgentSection({ treatments }: { treatments: Treatment[] }) {
  return (
    <section className="py-20 px-4 bg-[#FDF8F9]">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
            <Pill className="size-6 text-[#D4849A]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">
            Им нужна помощь прямо сейчас
          </h2>
          <p className="mt-2 text-stone-500">
            Эти питомцы проходят лечение — любая поддержка важна
          </p>
        </div>

        <div className="lg:hidden">
          <UrgentCarousel treatments={treatments} />
        </div>
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {treatments.slice(0, 6).map((t, i) => (
            <TreatmentCard key={i} treatment={t} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10">
            <Link href="/treatments">
              Смотреть все сборы
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#FDF8F9]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#D4849A]" />
              <span className="text-sm font-semibold text-[#D4849A] uppercase tracking-widest">
                О нас
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">
              О приюте «Добрые лапки»
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Мы — небольшой городской приют, созданный людьми, которые не смогли остаться
                равнодушными. С 2018 года мы находим дом для кошек и собак, оказавшихся на улице
                или в трудной ситуации.
              </p>
              <p>
                Каждый питомец у нас получает ветеринарную помощь, тёплое место и внимание
                волонтёров. Мы верим, что у каждого животного есть свой человек — и помогаем им
                найти друг друга.
              </p>
              <p>
                Приют живёт благодаря неравнодушным людям: волонтёрам, опекунам и тем, кто
                поддерживает нас финансово. Вместе мы можем сделать больше.
              </p>
            </div>
            <div>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10"
              >
                <Link href="/about">Узнать больше</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl">
              <Image
                src="https://picsum.photos/seed/dobryelapki-about/700/525"
                alt="Наш приют"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 w-36 h-36 rounded-[24px] overflow-hidden shadow-lg border-4 border-white hidden sm:block">
              <Image
                src="https://picsum.photos/seed/dobryelapki-about2/200/200"
                alt="Питомцы"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowToHelpSection() {
  const ways = [
    {
      icon: <ShoppingCart className="size-6 text-amber-600" />,
      title: "Помочь с кормом",
      description:
        "Питомцы приюта нуждаются в качественном питании каждый день. Любая помощь важна.",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      action: (
        <Button asChild variant="outline" size="default" className="rounded-xl mt-4 w-full border-amber-200 text-amber-700 hover:bg-amber-100">
          <Link href="/help/food">Помочь с кормом</Link>
        </Button>
      ),
    },
    {
      icon: <Pill className="size-6 text-teal-600" />,
      title: "Помочь с лекарствами",
      description:
        "Многие наши питомцы нуждаются в постоянном лечении. Помогите приобрести нужные препараты.",
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      action: (
        <Button asChild variant="outline" size="default" className="rounded-xl mt-4 w-full border-teal-200 text-teal-700 hover:bg-teal-100">
          <Link href="/help/medicine">Помочь с лекарствами</Link>
        </Button>
      ),
    },
    {
      icon: <Heart className="size-6 text-rose-500" />,
      title: "Стать опекуном",
      description:
        "Опекун помогает конкретному питомцу финансово, пока тот живёт в приюте и ждёт дом.",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      action: (
        <Button
          asChild
          size="default"
          className="rounded-xl mt-4 w-full bg-rose-400 hover:bg-rose-500 text-white"
        >
          <Link href="/pets?guardianship=search">Выбрать питомца</Link>
        </Button>
      ),
    },
    {
      icon: <Users className="size-6 text-purple-600" />,
      title: "Стать волонтёром",
      description:
        "Помогайте кормить, выгуливать питомцев и участвовать в жизни приюта вместе с нами.",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      action: (
        <Button asChild variant="outline" size="default" className="rounded-xl mt-4 w-full border-purple-200 text-purple-700 hover:bg-purple-100">
          <Link href="/help/volunteer">Хочу помогать</Link>
        </Button>
      ),
    },
    {
      icon: <Gift className="size-6 text-orange-500" />,
      title: "Пожертвовать",
      description:
        "Любая сумма помогает нам содержать приют, лечить животных и искать им любящий дом.",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      action: (
        <Button
          asChild
          size="default"
          className="rounded-xl mt-4 w-full bg-orange-400 hover:bg-orange-500 text-white"
        >
          <Link href="/donate">Пожертвовать</Link>
        </Button>
      ),
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">Как нам помочь</h2>
          <p className="mt-2 text-stone-500 max-w-xl mx-auto">
            Даже если вы не можете взять питомца домой — вы всё равно можете изменить чью-то жизнь
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {ways.map((way, i) => (
            <div
              key={i}
              className={`${way.bg} rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-200`}
            >
              <div className={`${way.iconBg} size-12 rounded-xl flex items-center justify-center mb-4`}>
                {way.icon}
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-2">{way.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed flex-1">{way.description}</p>
              {way.action}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecentAnimalsSection({ animals }: { animals: Animal[] }) {
  return (
    <section className="py-20 px-4 bg-[#FDF8F9]">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">
              Ищут своего человека
            </h2>
            <p className="mt-1 text-stone-500">Познакомьтесь с теми, кто ждёт именно вас</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10">
            <Link href="/pets">
              Смотреть всех питомцев
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {animals.length === 0 ? (
          <p className="text-center text-stone-400 py-12">
            Питомцы в приюте появятся совсем скоро
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FoundHomeSection({ animals }: { animals: SimpleAnimal[] }) {
  return (
    <section className="py-20 px-4 bg-[#FDF8F9]">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">Уже нашли дом</h2>
          <p className="mt-2 text-stone-500 text-lg">
            Они уже счастливы — следующий может быть твой!
          </p>
        </div>

        <div className="lg:hidden">
          <FoundHomeCarousel animals={animals} />
        </div>
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {animals.map((animal) => (
            <FoundHomeCard key={animal.id} animal={animal} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10">
            <Link href="/adopted">
              Смотреть все истории
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

const faqItems = [
  {
    q: "Все ли животные привиты?",
    a: "Да. Каждый питомец в нашем приюте проходит полный курс вакцинации, стерилизации и обработки от паразитов до того, как мы предлагаем его для усыновления.",
  },
  {
    q: "Как проходит процесс усыновления?",
    a: "Выберите питомца в каталоге, нажмите «Хочу забрать домой» и заполните короткую анкету. Мы свяжемся с вами, чтобы назначить встречу и познакомить вас с животным.",
  },
  {
    q: "Можно ли приехать и посмотреть животных вживую?",
    a: "Конечно! Мы работаем ежедневно. Лучше заранее позвонить или написать — тогда мы сможем уделить вам время и правильно познакомить с питомцами.",
  },
  {
    q: "Что такое опекунство?",
    a: "Опекун финансово поддерживает конкретного питомца, пока тот живёт в приюте. Это не усыновление — животное остаётся у нас, но вы помогаете ему регулярно. Взамен мы присылаем фото и новости о вашем подопечном.",
  },
  {
    q: "Принимаете ли вы животных с улицы?",
    a: "Мы стараемся помочь всем, но наши возможности ограничены. Позвоните нам — вместе найдём решение: временная передержка, помощь с поиском хозяев или другие варианты.",
  },
  {
    q: "Куда идут пожертвования?",
    a: "Исключительно на нужды приюта: корм, ветеринарное лечение, содержание помещений и поиск хозяев для животных. Мы публикуем отчёты об использовании средств.",
  },
]

function QuizCtaSection() {
  return (
    <section className="py-16 px-4 bg-[#FAF0F3]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex-1">
            <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
              <div className="size-10 rounded-xl bg-[#D4849A]/15 flex items-center justify-center shrink-0">
                <PawPrint className="size-5 text-[#D4849A]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">
                Кто твой идеальный питомец?
              </h2>
            </div>
            <p className="text-stone-500 leading-relaxed max-w-md">
              Ответь на 6 коротких вопросов — подберём животных, которые подходят тебе по характеру и образу жизни
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white px-8 shrink-0">
            <Link href="/quiz">
              <Sparkles className="size-5 mr-2" />
              Пройти тест
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">Частые вопросы</h2>
          <p className="mt-2 text-stone-500">Отвечаем на то, что спрашивают чаще всего</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqItems.map((item) => (
            <div key={item.q} className="rounded-2xl bg-[#FDF8F9] border border-stone-100 p-5 flex flex-col gap-2">
              <p className="font-semibold text-stone-800">{item.q}</p>
              <p className="text-sm text-stone-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
