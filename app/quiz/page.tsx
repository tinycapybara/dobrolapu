"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, PawPrint, CheckCircle2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"

type Answers = {
  type?: "Кошка" | "Собака" | "any"
  housing?: "small" | "large" | "house"
  time?: "active" | "medium" | "busy"
  kids?: "yes" | "no"
}

const questions = [
  {
    id: "type" as const,
    question: "Кто тебе ближе?",
    hint: "Это поможет нам подобрать идеального питомца",
    options: [
      { value: "Кошка" as const, label: "Кошки", desc: "Независимые, уютные и ласковые", emoji: "🐱" },
      { value: "Собака" as const, label: "Собаки", desc: "Преданные, активные, любят прогулки", emoji: "🐶" },
      { value: "any" as const, label: "Мне всё равно!", desc: "Открыт к любому питомцу", emoji: "💕" },
    ],
  },
  {
    id: "housing" as const,
    question: "Где ты живёшь?",
    hint: "Размер жилья влияет на комфорт питомца",
    options: [
      { value: "small" as const, label: "Небольшая квартира", desc: "Студия или однокомнатная", emoji: "🏠" },
      { value: "large" as const, label: "Просторная квартира", desc: "Двухкомнатная или больше", emoji: "🏡" },
      { value: "house" as const, label: "Частный дом", desc: "Есть двор или сад", emoji: "🏘️" },
    ],
  },
  {
    id: "time" as const,
    question: "Сколько времени ты готов(а) уделять питомцу?",
    hint: "Молодым животным нужно больше внимания и игр",
    options: [
      { value: "active" as const, label: "Много времени", desc: "Обожаю играть и возиться", emoji: "🎉" },
      { value: "medium" as const, label: "Умеренно", desc: "Буду уделять время, но не постоянно", emoji: "😊" },
      { value: "busy" as const, label: "Немного", desc: "Хочу спокойного взрослого питомца", emoji: "💼" },
    ],
  },
  {
    id: "kids" as const,
    question: "Есть ли в доме маленькие дети?",
    hint: "Учтём это при подборе",
    options: [
      { value: "yes" as const, label: "Да, есть", desc: "Дети до 7 лет", emoji: "👶" },
      { value: "no" as const, label: "Нет", desc: "Только взрослые в доме", emoji: "🙅" },
    ],
  },
]

function buildUrl(answers: Answers): string {
  const params = new URLSearchParams()
  params.set("quiz", "1")

  if (answers.type && answers.type !== "any") {
    params.set("type", answers.type)
  }
  if (answers.housing === "small") {
    params.set("size", "small")
  }
  if (answers.time === "busy") {
    params.set("age", "36-84")
  }
  if (answers.kids === "yes") {
    params.set("health", "healthy")
  }

  return `/pets?${params.toString()}`
}

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [selected, setSelected] = useState<string | null>(null)

  const isResult = step >= questions.length
  const current = !isResult ? questions[step] : null
  const progress = isResult ? 100 : (step / questions.length) * 100

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
        <div className="container mx-auto max-w-2xl">

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
              Ответь на {questions.length} вопроса — мы подберём подходящих животных
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
                {answers.type && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                    {answers.type === "any" ? "Любой питомец" : answers.type === "Кошка" ? "Кошки" : "Собаки"}
                  </div>
                )}
                {answers.housing && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                    {answers.housing === "small"
                      ? "Небольшая квартира — подбираем маленьких питомцев"
                      : answers.housing === "large"
                      ? "Просторная квартира"
                      : "Частный дом"}
                  </div>
                )}
                {answers.time && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                    {answers.time === "active"
                      ? "Хочешь активного питомца"
                      : answers.time === "medium"
                      ? "Умеренная активность"
                      : "Спокойный взрослый питомец (3–7 лет)"}
                  </div>
                )}
                {answers.kids === "yes" && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="size-4 text-[#D4849A] shrink-0" />
                    Учтено: маленькие дети в доме
                  </div>
                )}
              </div>

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
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
