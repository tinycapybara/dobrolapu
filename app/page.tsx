import Link from "next/link"
import Image from "next/image"
import { PawPrint, ShoppingCart, Pill, Heart, Users, Gift, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { AnimalCard, type Animal } from "@/components/animal-card"
import {
  TreatmentCard,
  UrgentCarousel,
  FoundHomeCard,
  FoundHomeCarousel,
} from "./home-carousels"

// ── Types ─────────────────────────────────────────────────────────────────────

type Stats = { inShelter: number; foundHome: number; hasGuardian: number }

type Treatment = {
  disease: string
  description: string | null
  goal_amount: number | null
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

// ── Data ──────────────────────────────────────────────────────────────────────

async function getPageData() {
  const [s1, s2, s3, tr, ra, fh] = await Promise.all([
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 1),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 2),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("guardianship_id", 2),
    supabase
      .from("treatments")
      .select("disease, description, goal_amount, animals!animal_id(id, name, animal_photos(photo_url, is_main))")
      .eq("is_active", true)
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

  return {
    stats: {
      inShelter: s1.count ?? 0,
      foundHome: s2.count ?? 0,
      hasGuardian: s3.count ?? 0,
    },
    treatments: (tr.data ?? []) as unknown as Treatment[],
    recentAnimals: (ra.data ?? []) as unknown as Animal[],
    foundHomeAnimals: (fh.data ?? []) as unknown as SimpleAnimal[],
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Добрые лапки — Городской приют для животных",
  description:
    "Помогаем кошкам и собакам найти любящий дом. Познакомьтесь с нашими питомцами или поддержите приют.",
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { stats, treatments, recentAnimals, foundHomeAnimals } = await getPageData()

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />
      <HeroSection />
      <StatsSection stats={stats} />
      {treatments.length > 0 && <UrgentSection treatments={treatments} />}
      <AboutSection />
      <HowToHelpSection />
      <RecentAnimalsSection animals={recentAnimals} />
      {foundHomeAnimals.length > 0 && <FoundHomeSection animals={foundHomeAnimals} />}
      <FooterSection />
    </div>
  )
}

// ── Sections ──────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FDF0E8] to-[#FAE8DC] min-h-[85vh] flex items-center">
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full bg-[#E8927C]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full bg-[#E8927C]/8 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Текст */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
              Здесь каждый хвост ждёт{" "}
              <span className="text-[#E8927C]">своего человека</span>
            </h1>

            <p className="text-stone-500 text-lg leading-relaxed max-w-md">
              Мы помогаем кошкам и собакам найти любящий дом. Каждый питомец в нашем приюте
              заслуживает тепла, заботы и настоящей семьи.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#E8927C] hover:bg-[#D9806A] text-white rounded-2xl px-8 shadow-lg shadow-[#E8927C]/30"
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
                className="rounded-2xl px-8 border-stone-200 hover:bg-stone-50 text-stone-700"
              >
                <Link href="/donate">Помочь приюту</Link>
              </Button>
            </div>
          </div>

          {/* Фото */}
          <div className="relative hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-[480px] aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/dobryelapki-hero/700/700"
                alt="Питомцы приюта"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#E8927C]/20 to-transparent" />
            </div>

            {/* Плашка поверх фото */}
            <div className="absolute -bottom-4 left-4 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#FDF0E8] flex items-center justify-center">
                <Heart className="size-4 text-[#E8927C] fill-[#E8927C]" />
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
      bg: "bg-[#FDF0E8]",
      text: "text-[#E8927C]",
    },
    {
      value: stats.foundHome,
      label: "Нашли дом",
      sub: "с нашей помощью",
      bg: "bg-teal-50",
      text: "text-teal-600",
    },
    {
      value: stats.hasGuardian,
      label: "Есть опекун",
      sub: "о них уже заботятся",
      bg: "bg-rose-50",
      text: "text-rose-500",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className={`${item.bg} rounded-3xl p-8 text-center`}>
              <p className={`${item.text} text-5xl lg:text-6xl font-bold tabular-nums mb-2`}>
                {item.value.toLocaleString("ru-RU")}
              </p>
              <p className="text-stone-800 font-semibold text-lg">{item.label}</p>
              <p className="text-stone-400 text-sm mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UrgentSection({ treatments }: { treatments: Treatment[] }) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">
            Им нужна помощь прямо сейчас
          </h2>
          <p className="mt-2 text-stone-500">
            Эти питомцы проходят лечение — любая поддержка важна
          </p>
        </div>

        {/* Mobile: карусель со стрелками */}
        <div className="lg:hidden">
          <UrgentCarousel treatments={treatments} />
        </div>
        {/* Desktop: сетка */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {treatments.slice(0, 6).map((t, i) => (
            <TreatmentCard key={i} treatment={t} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="rounded-2xl border-stone-200">
            <Link href="/treatments">Смотреть все сборы</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#FDF8F3]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#E8927C]" />
              <span className="text-sm font-medium text-[#E8927C] uppercase tracking-widest">
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
                className="rounded-2xl border-[#E8927C] text-[#E8927C] hover:bg-[#E8927C]/10"
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
      icon: <ShoppingCart className="size-6" />,
      title: "Купить корм",
      description:
        "Питомцы приюта нуждаются в качественном питании каждый день. Любая помощь важна.",
      action: (
        <Button variant="outline" size="sm" className="rounded-xl mt-4 w-full border-stone-200">
          Купить корм
        </Button>
      ),
      bg: "bg-amber-50",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      icon: <Pill className="size-6" />,
      title: "Купить лекарства",
      description:
        "Многие наши питомцы нуждаются в постоянном лечении. Помогите купить нужные препараты.",
      action: (
        <Button variant="outline" size="sm" className="rounded-xl mt-4 w-full border-stone-200">
          Купить лекарства
        </Button>
      ),
      bg: "bg-teal-50",
      iconBg: "bg-teal-100 text-teal-600",
    },
    {
      icon: <Heart className="size-6" />,
      title: "Стать опекуном",
      description:
        "Опекун помогает конкретному питомцу финансово, пока тот живёт в приюте и ждёт дом.",
      action: (
        <Button
          asChild
          size="sm"
          className="rounded-xl mt-4 w-full bg-[#E8927C] hover:bg-[#D9806A] text-white"
        >
          <Link href="/pets?guardianship=search">Выбрать питомца</Link>
        </Button>
      ),
      bg: "bg-rose-50",
      iconBg: "bg-rose-100 text-rose-500",
    },
    {
      icon: <Users className="size-6" />,
      title: "Стать волонтёром",
      description:
        "Помогайте кормить, выгуливать питомцев и участвовать в жизни приюта вместе с нами.",
      action: (
        <Button variant="outline" size="sm" className="rounded-xl mt-4 w-full border-stone-200">
          Хочу помогать
        </Button>
      ),
      bg: "bg-purple-50",
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Gift className="size-6" />,
      title: "Пожертвовать",
      description:
        "Любая сумма помогает нам содержать приют, лечить животных и искать им любящий дом.",
      action: (
        <Button
          asChild
          size="sm"
          className="rounded-xl mt-4 w-full bg-[#E8927C] hover:bg-[#D9806A] text-white"
        >
          <Link href="/donate">Пожертвовать</Link>
        </Button>
      ),
      bg: "bg-orange-50",
      iconBg: "bg-orange-100 text-orange-600",
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
              className={`${way.bg} rounded-3xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-200`}
            >
              <div
                className={`${way.iconBg} size-12 rounded-2xl flex items-center justify-center mb-4`}
              >
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
    <section className="py-20 px-4 bg-[#FDF8F3]">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">
              Ищут своего человека
            </h2>
            <p className="mt-1 text-stone-500">Познакомьтесь с теми, кто ждёт именно вас</p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl border-stone-200">
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
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-800">Уже нашли дом</h2>
        </div>
        <p className="text-center text-stone-500 mb-10 text-lg">
          Они уже счастливы — следующий может быть твой!
        </p>

        {/* Mobile: карусель со стрелками */}
        <div className="lg:hidden">
          <FoundHomeCarousel animals={animals} />
        </div>
        {/* Desktop: сетка */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {animals.map((animal) => (
            <FoundHomeCard key={animal.id} animal={animal} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  const navLinks = [
    { href: "/pets", label: "Питомцы" },
    { href: "/about", label: "О приюте" },
    { href: "/donate", label: "Помочь" },
    { href: "/contacts", label: "Контакты" },
  ]

  return (
    <footer className="bg-[#2C1A0E] text-stone-300 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-white">
              <PawPrint className="size-6 text-[#E8927C]" />
              <span className="text-lg font-bold">Добрые лапки</span>
            </Link>
            <p className="text-sm text-stone-400 max-w-xs">
              Городской приют для кошек и собак. Помогаем найти дом с 2018 года.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 text-center text-sm text-stone-600">
          © {new Date().getFullYear()} Добрые лапки. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
