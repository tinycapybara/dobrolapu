"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, PawPrint, Pill, Home, Loader2 } from "lucide-react"

const PRESETS = [200, 500, 1000, 2000]

const helpItems = [
  { icon: <PawPrint className="size-5 text-[#D4849A]" />, text: "Корм и уход для питомцев" },
  { icon: <Pill className="size-5 text-[#D4849A]" />, text: "Лечение и ветеринарная помощь" },
  { icon: <Home className="size-5 text-[#D4849A]" />, text: "Содержание и обустройство приюта" },
  { icon: <Heart className="size-5 text-[#D4849A]" />, text: "Поиск любящих семей" },
]

export default function DonatePage() {
  const [amount, setAmount] = useState<string>("")
  const [preset, setPreset] = useState<number | null>(null)
  const [donorName, setDonorName] = useState("")
  const [comment, setComment] = useState("")
  const [oferta, setOferta] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const numAmount = Number(amount)
  const canSubmit = numAmount > 0 && oferta && privacy && !isSubmitting

  function handlePreset(value: number) {
    setPreset(value)
    setAmount(String(value))
  }

  function handleAmountChange(value: string) {
    setAmount(value)
    const num = Number(value)
    setPreset(PRESETS.includes(num) ? num : null)
  }

  async function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/robokassa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          donor_name: donorName.trim() || null,
          comment: comment.trim() || null,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Заголовок */}
          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <Heart className="size-7 text-[#D4849A] fill-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Помочь приюту</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Любая сумма помогает нашим питомцам получить заботу, лечение и шанс найти дом
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Форма */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6">
              {/* Быстрый выбор суммы */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-stone-800">Выберите сумму</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePreset(p)}
                      className={`rounded-xl py-3 text-sm font-semibold border transition-colors ${
                        preset === p
                          ? "bg-[#D4849A] border-[#D4849A] text-white"
                          : "bg-white border-stone-200 text-stone-700 hover:border-[#D4849A] hover:text-[#D4849A]"
                      }`}
                    >
                      {p.toLocaleString("ru-RU")} ₽
                    </button>
                  ))}
                </div>
              </div>

              {/* Своя сумма */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-semibold text-stone-800">
                  Своя сумма
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    min={1}
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="rounded-xl pr-10 text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
                    ₽
                  </span>
                </div>
              </div>

              {/* Имя */}
              <div className="space-y-2">
                <Label htmlFor="donor_name" className="text-base font-semibold text-stone-800">
                  Ваше имя
                </Label>
                <Input
                  id="donor_name"
                  type="text"
                  placeholder="Или оставьте анонимно"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="rounded-xl text-base"
                />
              </div>

              {/* Комментарий */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-base font-semibold text-stone-800">
                  Комментарий{" "}
                  <span className="text-stone-400 font-normal text-sm">— необязательно</span>
                </Label>
                <textarea
                  id="comment"
                  placeholder="Напишите, кому или чему хотите помочь"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-base resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
                />
              </div>

              {/* Чекбоксы */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="oferta"
                    checked={oferta}
                    onChange={(e) => setOferta(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-stone-300 accent-[#D4849A] cursor-pointer shrink-0"
                  />
                  <label htmlFor="oferta" className="text-sm text-stone-600 leading-relaxed cursor-pointer">
                    Соглашаюсь с{" "}
                    <a href="/oferta" className="text-[#D4849A] underline underline-offset-2 hover:text-[#C4728A]">
                      условиями оферты
                    </a>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-stone-300 accent-[#D4849A] cursor-pointer shrink-0"
                  />
                  <label htmlFor="privacy" className="text-sm text-stone-600 leading-relaxed cursor-pointer">
                    Соглашаюсь с{" "}
                    <a href="/privacy" className="text-[#D4849A] underline underline-offset-2 hover:text-[#C4728A]">
                      политикой обработки персональных данных
                    </a>
                  </label>
                </div>
              </div>

              {/* Кнопка */}
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                size="lg"
                className="w-full bg-[#D4849A] hover:bg-[#C4728A] text-white text-base rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Переход к оплате...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 size-4" />
                    Пожертвовать{amount && numAmount > 0 ? ` ${Number(amount).toLocaleString("ru-RU")} ₽` : ""}
                  </>
                )}
              </Button>
            </div>

            {/* Боковая карточка */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 p-6 flex flex-col gap-4">
                <h2 className="font-bold text-stone-800 text-lg">Ваша помощь нужна</h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Приют живёт благодаря неравнодушным людям. Каждое пожертвование напрямую помогает
                  нашим питомцам.
                </p>
                <ul className="flex flex-col gap-3">
                  {helpItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-stone-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white border border-stone-100 p-5 text-center">
                <p className="text-xs text-stone-400 leading-relaxed">
                  Оплата защищена. Переводы обрабатываются через&nbsp;Robokassa — безопасно и&nbsp;надёжно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
