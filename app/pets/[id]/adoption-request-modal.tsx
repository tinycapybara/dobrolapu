"use client"

import { useState } from "react"
import { Heart, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RequestType = "guardian" | "adopt"

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {children}
      </div>
    </div>
  )
}

function ThankYou({ type, name, onClose }: { type: RequestType; name: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <div className="size-16 rounded-full bg-[#FAF0F3] flex items-center justify-center">
        <CheckCircle2 className="size-8 text-[#D4849A]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-stone-800">Заявка отправлена!</h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          {type === "guardian"
            ? `Спасибо, ${name}! Мы получили вашу заявку на опекунство и свяжемся с вами в ближайшее время.`
            : `Спасибо, ${name}! Мы получили вашу заявку и свяжемся с вами в ближайшее время, чтобы рассказать о следующих шагах.`}
        </p>
      </div>
      <Button
        onClick={onClose}
        size="lg"
        className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
      >
        Закрыть
      </Button>
    </div>
  )
}

function AdoptionForm({
  type,
  animalId,
  animalName,
  onClose,
}: {
  type: RequestType
  animalId: number
  animalName: string
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [phoneDigits, setPhoneDigits] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim().length > 0 && phoneDigits.length === 10 && !isSubmitting

  function formatPhoneDisplay(digits: string): string {
    let s = "+7"
    if (digits.length > 0) s += " (" + digits.slice(0, 3)
    if (digits.length >= 3) s += ") " + digits.slice(3, 6)
    if (digits.length >= 6) s += "-" + digits.slice(6, 8)
    if (digits.length >= 8) s += "-" + digits.slice(8, 10)
    return s
  }

  function handlePhoneChange(raw: string) {
    let digits = raw.replace(/\D/g, "")
    if (digits.startsWith("8") || digits.startsWith("7")) digits = digits.slice(1)
    setPhoneDigits(digits.slice(0, 10))
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      setPhoneDigits((prev) => prev.slice(0, -1))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/adoption-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal_id: animalId,
          animal_name: animalName,
          type,
          name: name.trim(),
          phone: formatPhoneDisplay(phoneDigits),
          email: email.trim() || null,
          message: message.trim() || null,
        }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Что-то пошло не так. Попробуйте ещё раз.")
      }
    } catch {
      setError("Ошибка соединения. Проверьте интернет и попробуйте ещё раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (done) {
    return <ThankYou type={type} name={name} onClose={onClose} />
  }

  const title = type === "guardian" ? "Стать опекуном" : "Забрать домой"
  const subtitle =
    type === "guardian"
      ? `Заполните форму, и мы свяжемся с вами, чтобы рассказать об опекунстве над ${animalName}`
      : `Заполните форму, и мы свяжемся с вами, чтобы рассказать о следующих шагах`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-stone-800">{title}</h2>
          <p className="text-sm text-stone-500 leading-relaxed">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 transition-colors shrink-0 mt-0.5"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Поля */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="req-name" className="font-semibold text-stone-800">
            Имя <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="req-name"
            type="text"
            placeholder="Как вас зовут?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="req-phone" className="font-semibold text-stone-800">
            Телефон <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="req-phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={formatPhoneDisplay(phoneDigits)}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onKeyDown={handlePhoneKeyDown}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="req-email" className="font-semibold text-stone-800">
            Email{" "}
            <span className="text-stone-400 font-normal text-sm">— необязательно</span>
          </Label>
          <Input
            id="req-email"
            type="email"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="req-message" className="font-semibold text-stone-800">
            Комментарий{" "}
            <span className="text-stone-400 font-normal text-sm">— необязательно</span>
          </Label>
          <textarea
            id="req-message"
            placeholder="Расскажите немного о себе или задайте вопрос"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button
        type="submit"
        disabled={!canSubmit}
        size="lg"
        className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Отправляем...
          </>
        ) : (
          <>
            <Heart className="mr-2 size-4" />
            Отправить заявку
          </>
        )}
      </Button>

      <p className="text-xs text-stone-400 text-center leading-relaxed">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-stone-600">
          политикой обработки персональных данных
        </a>
      </p>
    </form>
  )
}

export function AdoptionButtons({
  animalId,
  animalName,
  hasGuardian,
}: {
  animalId: number
  animalName: string
  hasGuardian: boolean
}) {
  const [openType, setOpenType] = useState<RequestType | null>(null)

  return (
    <>
      <div className="flex flex-col gap-3">
        {hasGuardian ? (
          <div className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#9B8EC4] text-white text-sm font-semibold">
            <Heart className="size-4" />
            Уже есть опекун
          </div>
        ) : (
          <Button
            size="lg"
            variant="outline"
            onClick={() => setOpenType("guardian")}
            className="w-full rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10"
          >
            Стать опекуном
          </Button>
        )}
        <Button
          size="lg"
          onClick={() => setOpenType("adopt")}
          className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
        >
          Забрать домой
        </Button>
      </div>

      <Modal open={openType !== null} onClose={() => setOpenType(null)}>
        {openType && (
          <AdoptionForm
            key={openType}
            type={openType}
            animalId={animalId}
            animalName={animalName}
            onClose={() => setOpenType(null)}
          />
        )}
      </Modal>
    </>
  )
}
