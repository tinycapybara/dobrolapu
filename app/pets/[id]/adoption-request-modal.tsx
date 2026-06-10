"use client"

import { useState, useEffect } from "react"
import { Heart, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
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
            : `Спасибо, ${name}! Мы получили вашу анкету и свяжемся с вами в ближайшее время.`}
        </p>
      </div>
      <Button onClick={onClose} size="lg" className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white">
        Закрыть
      </Button>
    </div>
  )
}

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label className="font-semibold text-stone-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
              value === opt.value
                ? "bg-[#D4849A] border-[#D4849A] text-white"
                : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
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
  const [comment, setComment] = useState("")

  // Поля анкеты (только для adopt)
  const [housingType, setHousingType] = useState("")
  const [hasChildren, setHasChildren] = useState("")
  const [childrenAge, setChildrenAge] = useState("")
  const [hasPets, setHasPets] = useState("")
  const [animalExperience, setAnimalExperience] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setAuthToken(session.access_token)

      // Автозаполнение из профиля через API (обходим RLS)
      const res = await fetch("/api/profile/me", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) return
      const profile = await res.json()

      if (profile.full_name) setName(profile.full_name)
      if (profile.email) setEmail(profile.email)
      if (profile.phone) {
        const digits = profile.phone.replace(/\D/g, "")
        const clean = digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits
        setPhoneDigits(clean.slice(0, 10))
      }
    })
  }, [])

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

  function buildMessage(): string | null {
    if (type === "guardian") return comment.trim() || null

    const parts: string[] = []
    if (housingType) parts.push(`Тип жилья: ${housingType}`)
    if (hasChildren === "да") {
      parts.push(`Дети: есть${childrenAge.trim() ? ` (${childrenAge.trim()})` : ""}`)
    } else if (hasChildren === "нет") {
      parts.push("Дети: нет")
    }
    if (hasPets === "да") parts.push("Другие животные: есть")
    else if (hasPets === "нет") parts.push("Другие животные: нет")
    if (animalExperience.trim()) parts.push(`Опыт: ${animalExperience.trim()}`)
    if (comment.trim()) parts.push(`Комментарий: ${comment.trim()}`)
    return parts.length > 0 ? parts.join("\n") : null
  }

  const adoptQuestionsFilled = type !== "adopt" || (housingType && hasChildren && hasPets)
  const canSubmit = name.trim().length > 0 && phoneDigits.length === 10 && !isSubmitting && !!adoptQuestionsFilled

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`

      const res = await fetch("/api/adoption-request", {
        method: "POST",
        headers,
        body: JSON.stringify({
          animal_id: animalId,
          animal_name: animalName,
          type,
          name: name.trim(),
          phone: formatPhoneDisplay(phoneDigits),
          email: email.trim() || null,
          message: buildMessage(),
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

  if (done) return <ThankYou type={type} name={name} onClose={onClose} />

  const title = type === "guardian" ? "Стать опекуном" : "Забрать домой"
  const subtitle =
    type === "guardian"
      ? `Заполните форму, и мы свяжемся с вами, чтобы рассказать об опекунстве над ${animalName}`
      : `Расскажите немного о себе — это поможет нам убедиться, что ${animalName} попадёт в хорошие руки`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
      {/* Шапка — фиксированная */}
      <div className="flex items-start justify-between gap-3 p-6 pb-4">
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

      {/* Скроллируемый контент */}
      <div className="overflow-y-auto flex flex-col gap-4 px-6 pb-2">

        {/* Контактные данные */}
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
            Email <span className="text-stone-400 font-normal text-sm">— необязательно</span>
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

        {/* Анкета — только для adopt */}
        {type === "adopt" && (
          <>
            <div className="border-t border-stone-100 pt-2">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Об условиях содержания</p>
              <div className="flex flex-col gap-4">
                <RadioGroup
                  label="Тип жилья"
                  name="housing"
                  required
                  value={housingType}
                  onChange={setHousingType}
                  options={[
                    { value: "квартира", label: "Квартира" },
                    { value: "частный дом", label: "Частный дом" },
                    { value: "дом с двором", label: "Дом с двором" },
                  ]}
                />

                <RadioGroup
                  label="Есть ли дети"
                  name="children"
                  required
                  value={hasChildren}
                  onChange={setHasChildren}
                  options={[
                    { value: "да", label: "Да" },
                    { value: "нет", label: "Нет" },
                  ]}
                />

                {hasChildren === "да" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="children-age" className="font-semibold text-stone-800">
                      Возраст детей <span className="text-stone-400 font-normal text-sm">— необязательно</span>
                    </Label>
                    <Input
                      id="children-age"
                      type="text"
                      placeholder="Например: 5 и 8 лет"
                      value={childrenAge}
                      onChange={(e) => setChildrenAge(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                )}

                <RadioGroup
                  label="Есть ли другие животные"
                  name="pets"
                  required
                  value={hasPets}
                  onChange={setHasPets}
                  options={[
                    { value: "да", label: "Да" },
                    { value: "нет", label: "Нет" },
                  ]}
                />

                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="font-semibold text-stone-800">
                    Опыт содержания животных <span className="text-stone-400 font-normal text-sm">— необязательно</span>
                  </Label>
                  <textarea
                    id="experience"
                    placeholder="Расскажите о предыдущем опыте, если он есть"
                    value={animalExperience}
                    onChange={(e) => setAnimalExperience(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="req-comment" className="font-semibold text-stone-800">
            Комментарий <span className="text-stone-400 font-normal text-sm">— необязательно</span>
          </Label>
          <textarea
            id="req-comment"
            placeholder="Любой вопрос или пожелание"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A]"
          />
        </div>
      </div>

      {/* Кнопка — фиксированная внизу */}
      <div className="p-6 pt-4 flex flex-col gap-3">
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          disabled={!canSubmit}
          size="lg"
          className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Отправляем...</>
          ) : (
            <><Heart className="mr-2 size-4" />Отправить заявку</>
          )}
        </Button>

        <p className="text-xs text-stone-400 text-center leading-relaxed">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-stone-600">
            политикой обработки персональных данных
          </a>
        </p>
      </div>
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
