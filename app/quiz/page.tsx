"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, PawPrint, CheckCircle2, Heart } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

type Answers = {
  home?: "small" | "large" | "house"
  saturday?: "book" | "walk" | "sleep"
  energy?: "active" | "calm" | "mixed"
  experience?: "first" | "experienced" | "ready"
  evening?: "couch" | "play" | "independent"
  goal?: "loyal" | "soul" | "special"
}

const questions = [
  {
    id: "home" as const,
    question: "Расскажи про свой дом",
    hint: "Это поможет подобрать питомца нужного размера",
    options: [
      { value: "small" as const, label: "Уютная небольшая квартира — мой маленький мир", desc: "Студия, однушка или небольшая двушка", emoji: "🏠" },
      { value: "large" as const, label: "Просторная квартира, есть где разгуляться", desc: "Много комнат, высокие потолки", emoji: "🏢" },
      { value: "house" as const, label: "Свой дом с двором", desc: "Загородный дом, дача или коттедж", emoji: "🌳" },
    ],
  },
  {
    id: "saturday" as const,
    question: "Идеальное субботнее утро — это…",
    hint: "Отвечай честно — твой питомец тоже будет частью этого утра",
    options: [
      { value: "book" as const, label: "Длинный завтрак, плед, книга или сериал", desc: "Никуда не спешить, просто наслаждаться", emoji: "☕" },
      { value: "walk" as const, label: "Прогулка в парке, свежий воздух, движение", desc: "Встать пораньше и отправиться на улицу", emoji: "🌳" },
      { value: "sleep" as const, label: "Поспать подольше, а дальше — куда настроение", desc: "Каждая суббота разная", emoji: "🛌" },
    ],
  },
  {
    id: "energy" as const,
    question: "Что больше про тебя?",
    hint: "Питомцу нужен человек, который совпадает с ним по темпераменту",
    options: [
      { value: "active" as const, label: "Я в постоянном движении, не могу сидеть на месте", desc: "Спорт, прогулки, новые места — мой стиль", emoji: "🏃" },
      { value: "calm" as const, label: "Ценю спокойствие и предсказуемость", desc: "Размеренная жизнь — это счастье", emoji: "🧘" },
      { value: "mixed" as const, label: "По-разному, зависит от дня", desc: "Бываю и активным, и очень ленивым", emoji: "🎭" },
    ],
  },
  {
    id: "experience" as const,
    question: "У тебя уже был питомец?",
    hint: "Опыт важен — малыши требуют особого внимания",
    options: [
      { value: "first" as const, label: "Это будет мой первый", desc: "Волнуюсь, но очень хочу", emoji: "🐾" },
      { value: "experienced" as const, label: "Да, я знаю, как это бывает", desc: "Уже проходил(а) через это", emoji: "💛" },
      { value: "ready" as const, label: "Готов(а) даже к малышу с его сюрпризами", desc: "Бессонные ночи? Не пугают!", emoji: "🏆" },
    ],
  },
  {
    id: "evening" as const,
    question: "Идеальный вечер с питомцем выглядит так…",
    hint: "Представь это — и питомец уже ждёт тебя",
    options: [
      { value: "couch" as const, label: "Лежим вдвоём, я листаю телефон, он рядом", desc: "Тепло, тихо, уютно", emoji: "🛋️" },
      { value: "play" as const, label: "Играем, бегаем, веселимся", desc: "Мячик, игрушки, беготня по квартире", emoji: "🎾" },
      { value: "independent" as const, label: "Каждый занят своим, иногда обнимаемся", desc: "Уважаем личное пространство друг друга", emoji: "👋" },
    ],
  },
  {
    id: "goal" as const,
    question: "Кого ты больше всего хочешь найти?",
    hint: "Честный ответ поможет нам подобрать именно твоего питомца",
    options: [
      { value: "loyal" as const, label: "Преданного друга, который всегда рядом", desc: "Встречает у двери, скучает без тебя", emoji: "💛" },
      { value: "soul" as const, label: "Независимую душу, которая выберет меня сама", desc: "Придёт когда захочет — и это особенно ценно", emoji: "🌸" },
      { value: "special" as const, label: "Того, кому я особенно нужен", desc: "Хочу помочь тому, кому труднее всего", emoji: "✨" },
    ],
  },
]

function buildUrl(answers: Answers): string {
  const params = new URLSearchParams()
  params.set("quiz", "1")

  if (answers.goal === "special") {
    // Спецрежим: показываем пожилых и болеющих
    params.set("special", "1")
  } else {
    // Q2 — главный сигнал (вес 3), Q5 и Q6 — дополнительные (вес 1)
    let catScore = 0
    let dogScore = 0
    if (answers.saturday === "book") catScore += 3
    if (answers.saturday === "walk") dogScore += 3
    if (answers.evening === "couch") catScore += 1
    if (answers.evening === "play") dogScore += 1
    if (answers.evening === "independent") catScore += 1
    if (answers.goal === "loyal") dogScore += 1
    if (answers.goal === "soul") catScore += 1
    if (catScore > dogScore) params.set("type", "Кошка")
    else if (dogScore > catScore) params.set("type", "Собака")
  }

  // Размер из вопроса 1 (только вне спецрежима)
  if (answers.goal !== "special" && answers.home === "small") params.set("size", "small")

  // Возраст: опыт перекрывает темперамент; только вне спецрежима
  if (answers.goal !== "special") {
    if (answers.experience === "ready") {
      params.set("age", "0-12")
    } else if (answers.experience === "first") {
      params.set("age", "37-84")
    } else if (answers.energy === "calm") {
      params.set("age", "37-84")
    } else if (answers.energy === "active") {
      params.set("age", "13-36")
    }
  }

  return `/pets?${params.toString()}`
}

function getTypeSummary(answers: Answers): string | null {
  let catScore = 0
  let dogScore = 0
  if (answers.saturday === "book") catScore += 2
  if (answers.saturday === "walk") dogScore += 2
  if (answers.evening === "couch") catScore += 1
  if (answers.evening === "play") dogScore += 1
  if (answers.evening === "independent") catScore += 1
  if (answers.goal === "loyal") dogScore += 1
  if (answers.goal === "soul") catScore += 1
  if (catScore > dogScore) return "Кошки"
  if (dogScore > catScore) return "Собаки"
  return null
}

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [selected, setSelected] = useState<string | null>(null)

  const isResult = step >= questions.length
  const current = !isResult ? questions[step] : null
  const progress = isResult ? 100 : (step / questions.length) * 100
  const typeSummary = getTypeSummary(answers)
  const isSpecial = answers.goal === "special"

  function handleNext() {
    if (!current || !selected) return
    const newAnswers = { ...answers, [current.id]: selected as never }
    setAnswers(newAnswers)
    setSelected(null)
    setStep((s) => s + 1)
  }

  function handleBack() {
    if (step === 0) return
    setStep((s) => s - 1)
    setSelected(null)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">

          <Link
            href="/pets"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Вернуться к питомцам
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <PawPrint className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">Найди своего питомца</h1>
            <p className="mt-2 text-stone-500">
              Ответь на {questions.length} вопросов — мы подберём подходящих животных
            </p>
          </div>

          {/* Прогресс */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-stone-400 mb-2">
              <span>{isResult ? "Готово!" : `Вопрос ${step + 1} из ${questions.length}`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-[#D4849A] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Вопрос */}
          {!isResult && current && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-stone-800">{current.question}</h2>
                <p className="text-sm text-stone-400 mt-1">{current.hint}</p>
              </div>

              <div className="flex flex-col gap-3">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                      selected === opt.value
                        ? "border-[#D4849A] bg-[#FAF0F3]"
                        : "border-stone-100 bg-white hover:border-[#D4849A]/40 hover:bg-[#FAF0F3]/40"
                    }`}
                  >
                    <span className="text-3xl shrink-0">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-stone-800">{opt.label}</p>
                      <p className="text-sm text-stone-500">{opt.desc}</p>
                    </div>
                    {selected === opt.value && (
                      <CheckCircle2 className="size-5 text-[#D4849A] shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="gap-1.5 text-stone-400 hover:text-stone-600"
                >
                  <ArrowLeft className="size-4" />
                  Назад
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selected}
                  className="gap-1.5 bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-xl px-6 disabled:opacity-40"
                >
                  {step + 1 === questions.length ? "Показать результат" : "Далее"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Результат */}
          {isResult && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-8 flex flex-col items-center gap-6 text-center">
                <div className="size-20 rounded-full bg-[#FAF0F3] flex items-center justify-center">
                  <PawPrint className="size-10 text-[#D4849A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">Готово!</h2>
                  <p className="mt-2 text-stone-500">
                    Мы подобрали питомцев на основе твоих ответов
                  </p>
                </div>

                <div className="w-full rounded-xl bg-[#FDF8F9] p-4 flex flex-col gap-2 text-left">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Твои предпочтения
                  </p>
                  {typeSummary && (
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                      {typeSummary}
                    </div>
                  )}
                  {answers.home && (
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                      {answers.home === "small"
                        ? "Небольшая квартира — подбираем компактных питомцев"
                        : answers.home === "large"
                        ? "Просторная квартира"
                        : "Свой дом с двором"}
                    </div>
                  )}
                  {answers.experience === "first" && (
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                      Первый питомец — рекомендуем взрослых (1–3 года)
                    </div>
                  )}
                  {answers.experience === "ready" && (
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                      Готов(а) к малышу — покажем котят и щенков
                    </div>
                  )}
                  {answers.energy === "calm" && answers.experience !== "first" && answers.experience !== "ready" && (
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                      Спокойный взрослый питомец (3–7 лет)
                    </div>
                  )}
                </div>

                {/* Баннер «особенно нужен» — внутри карточки */}
                {isSpecial && (
                  <div className="w-full rounded-xl bg-[#FDF5E4] border border-amber-200 p-4 flex gap-3 items-start text-left">
                    <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="size-4 text-amber-500" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-semibold text-stone-800 text-sm">
                        Показываем тех, кому труднее всего найти дом
                      </p>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Пожилые питомцы (старше 7 лет) и те, кто сейчас проходит лечение — они ждут дольше всех и нуждаются в особой заботе.
                      </p>
                      <Link
                        href="/treatments"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline underline-offset-2 mt-0.5"
                      >
                        Посмотреть срочные сборы на лечение
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => router.push(buildUrl(answers))}
                  size="lg"
                  className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
                >
                  <PawPrint className="mr-2 size-5" />
                  Смотреть подходящих питомцев
                </Button>

                <button
                  onClick={() => { setStep(0); setAnswers({}); setSelected(null) }}
                  className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
                >
                  Пройти заново
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
