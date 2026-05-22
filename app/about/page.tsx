import Image from "next/image"
import Link from "next/link"
import { Heart, PawPrint, Users, Home, Shield, ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export const metadata = {
  title: "О приюте | Добрые лапки",
  description: "Узнайте историю приюта «Добрые лапки», нашу миссию и команду волонтёров",
}

async function getStats() {
  const [s1, s2, s3] = await Promise.all([
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 1),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("status_id", 2),
    supabase.from("animals").select("*", { count: "exact", head: true }).eq("guardianship_id", 2),
  ])
  return {
    inShelter: s1.count ?? 0,
    foundHome: s2.count ?? 0,
    hasGuardian: s3.count ?? 0,
  }
}

const values = [
  {
    icon: Heart,
    title: "Забота",
    description: "Каждый питомец получает ветеринарную помощь, тёплое место и ежедневное внимание наших волонтёров.",
    bg: "bg-[#FAF0F3]",
    iconColor: "text-[#D4849A]",
  },
  {
    icon: Shield,
    title: "Ответственность",
    description: "Мы тщательно проверяем каждую семью, которая хочет забрать питомца — чтобы он попал в надёжные руки.",
    bg: "bg-[#F0F5FA]",
    iconColor: "text-[#7A9FD4]",
  },
  {
    icon: Users,
    title: "Сообщество",
    description: "Наш приют живёт благодаря волонтёрам, опекунам и неравнодушным людям, которые помогают чем могут.",
    bg: "bg-[#F0FAF5]",
    iconColor: "text-[#6BBF9A]",
  },
  {
    icon: Home,
    title: "Семья",
    description: "Мы верим, что у каждого животного есть свой человек. Наша цель — помочь им найти друг друга.",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
]

const team = [
  { name: "Анна Соколова", role: "Основатель и директор", years: "с 2018 года" },
  { name: "Мария Петрова", role: "Главный ветеринар", years: "с 2019 года" },
  { name: "Дмитрий Козлов", role: "Координатор волонтёров", years: "с 2020 года" },
  { name: "Елена Новикова", role: "Куратор по усыновлению", years: "с 2021 года" },
]

export default async function AboutPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#FDF8F3] via-[#FAF0F3] to-[#FAE8DC] py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-white/60 mb-6">
              <PawPrint className="size-8 text-[#D4849A]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-4">
              О приюте «Добрые лапки»
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Мы — небольшой городской приют, созданный людьми, которые не смогли остаться
              равнодушными. С 2018 года мы находим дом для кошек и собак, оказавшихся
              на улице или в трудной ситуации.
            </p>
          </div>
        </section>

        {/* Статистика */}
        <section className="py-14 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="rounded-2xl bg-[#FAF0F3] p-6">
                <p className="text-4xl lg:text-5xl font-bold text-[#D4849A] tabular-nums">
                  {stats.inShelter}
                </p>
                <p className="text-stone-600 font-semibold mt-1">питомцев сейчас</p>
                <p className="text-stone-400 text-sm">ждут своего дома</p>
              </div>
              <div className="rounded-2xl bg-[#F0FAF5] p-6">
                <p className="text-4xl lg:text-5xl font-bold text-[#6BBF9A] tabular-nums">
                  {stats.foundHome}
                </p>
                <p className="text-stone-600 font-semibold mt-1">нашли дом</p>
                <p className="text-stone-400 text-sm">с нашей помощью</p>
              </div>
              <div className="rounded-2xl bg-[#F0F5FA] p-6">
                <p className="text-4xl lg:text-5xl font-bold text-[#7A9FD4] tabular-nums">
                  6
                </p>
                <p className="text-stone-600 font-semibold mt-1">лет работы</p>
                <p className="text-stone-400 text-sm">с 2018 года</p>
              </div>
            </div>
          </div>
        </section>

        {/* История */}
        <section className="py-20 px-4 bg-[#FDF8F9]">
          <div className="container mx-auto max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-[#D4849A]" />
                  <span className="text-sm font-semibold text-[#D4849A] uppercase tracking-widest">Наша история</span>
                </div>
                <h2 className="text-3xl font-bold text-stone-800">Как всё начиналось</h2>
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    В 2018 году несколько неравнодушных жителей города объединились, чтобы помочь
                    бездомным животным. Всё началось с небольшого арендованного помещения и
                    десяти кошек, которым было некуда идти.
                  </p>
                  <p>
                    Постепенно приют рос. Появились волонтёры, постоянные жертвователи и опекуны.
                    Сегодня мы помогаем кошкам и собакам получить ветеринарную помощь, пережить
                    трудные времена и найти любящую семью.
                  </p>
                  <p>
                    За шесть лет работы через наш приют прошли сотни животных. Каждая история —
                    это спасённая жизнь и счастливая семья.
                  </p>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl">
                  <Image
                    src="https://picsum.photos/seed/shelter-history/700/525"
                    alt="История приюта"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ценности */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-stone-800">Наши ценности</h2>
              <p className="mt-2 text-stone-500">То, чем мы руководствуемся в работе каждый день</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className={`${v.bg} rounded-2xl p-6 flex flex-col gap-3`}>
                  <div className="size-11 rounded-xl bg-white/70 flex items-center justify-center">
                    <v.icon className={`size-5 ${v.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-stone-800 text-lg">{v.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Команда */}
        <section className="py-20 px-4 bg-[#FDF8F9]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-stone-800">Наша команда</h2>
              <p className="mt-2 text-stone-500">Люди, которые делают приют живым</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 text-center flex flex-col gap-2">
                  <div className="size-14 rounded-full bg-[#FAF0F3] flex items-center justify-center mx-auto">
                    <Users className="size-6 text-[#D4849A]" />
                  </div>
                  <p className="font-bold text-stone-800">{member.name}</p>
                  <p className="text-sm text-stone-500">{member.role}</p>
                  <p className="text-xs text-stone-400">{member.years}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-[#FAF0F3]">
          <div className="container mx-auto max-w-2xl text-center flex flex-col gap-5">
            <h2 className="text-3xl font-bold text-stone-800">Хотите помочь?</h2>
            <p className="text-stone-500 leading-relaxed">
              Есть много способов поддержать наш приют — стать волонтёром, опекуном,
              помочь кормом или пожертвовать. Каждый вклад меняет чью-то жизнь.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white px-8">
                <Link href="/help">
                  Как помочь
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10 px-8">
                <Link href="/pets">Посмотреть питомцев</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
