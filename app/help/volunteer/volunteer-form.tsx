"use client"

import { useState } from "react"
import {
  Heart, Loader2, CheckCircle2, AlertCircle,
  Footprints, Camera, CalendarDays, Megaphone, Clock, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ACTIVITIES = [
  "Выгул и общение с животными",
  "Уборка вольеров и территории",
  "Фото и видео для соцсетей",
  "Помощь в мероприятиях и ярмарках",
  "Доставка кормов и медикаментов",
  "Помощь с лечением (медицинские навыки)",
]

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Раз в неделю" },
  { value: "several", label: "Несколько раз в неделю" },
  { value: "sometimes", label: "По возможности" },
]

const sidebarItems = [
  { icon: <Footprints className="size-4 text-purple-500" />, text: "Выгул и общение с питомцами" },
  { icon: <Camera className="size-4 text-purple-500" />, text: "Фото и видео для соцсетей" },
  { icon: <CalendarDays className="size-4 text-purple-500" />, text: "Участие в мероприятиях" },
  { icon: <Megaphone className="size-4 text-purple-500" />, text: "Распространение информации" },
  { icon: <Clock className="size-4 text-purple-500" />, text: "Временная передержка" },
  { icon: <Trash2 className="size-4 text-purple-500" />, text: "Уход за территорией" },
]

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl py-2.5 px-3 text-sm font-medium border transition-colors text-left leading-snug ${
        active
          ? "bg-purple-500 border-purple-500 text-white"
          : "bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:text-purple-600"
      }`}
    >
      {children}
    </button>
  )
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`rounded-xl py-2 px-5 text-sm font-medium border transition-colors ${
          value === "yes"
            ? "bg-purple-500 border-purple-500 text-white"
            : "bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:text-purple-600"
        }`}
      >
        Да
      </button>
      <button
        type="button"
        onClick={() => onChange("no")}
        className={`rounded-xl py-2 px-5 text-sm font-medium border transition-colors ${
          value === "no"
            ? "bg-purple-500 border-purple-500 text-white"
            : "bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:text-purple-600"
        }`}
      >
        Нет
      </button>
    </div>
  )
}

export function VolunteerForm() {
  const [name, setName] = useState("")
  const [phoneDigits, setPhoneDigits] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [activities, setActivities] = useState<string[]>([])
  const [frequency, setFrequency] = useState("")
  const [days, setDays] = useState<string[]>([])
  const [hasCar, setHasCar] = useState("")
  const [hasPets, setHasPets] = useState("")
  const [priorVolunteer, setPriorVolunteer] = useState("")
  const [animalExperience, setAnimalExperience] = useState("")
  const [motivation, setMotivation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ageNum = Number(age)
  const ageTooYoung = age !== "" && ageNum < 16
  const canSubmit =
    name.trim().length > 0 &&
    phoneDigits.length === 10 &&
    email.trim().length > 0 &&
    age !== "" && ageNum >= 16 &&
    activities.length > 0 &&
    !isSubmitting

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

  function toggleActivity(item: string) {
    setActivities((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    )
  }

  function toggleDay(label: string) {
    setDays((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/volunteer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: formatPhoneDisplay(phoneDigits),
          email: email.trim(),
          age: ageNum,
          activities,
          frequency: frequency || null,
          days,
          has_car: hasCar === "yes" ? true : hasCar === "no" ? false : null,
          has_pets: hasPets === "yes" ? true : hasPets === "no" ? false : null,
          prior_volunteer: priorVolunteer === "yes" ? true : priorVolunteer === "no" ? false : null,
          animal_experience: animalExperience.trim() || null,
          motivation: motivation.trim() || null,
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px] items-start">

      {/* Форма */}
      {done ? (
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-10 flex flex-col items-center gap-5 text-center">
          <div className="size-20 rounded-full bg-purple-100 flex items-center justify-center">
            <CheckCircle2 className="size-10 text-purple-500" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-stone-800">Анкета отправлена!</h3>
            <p className="text-stone-500 leading-relaxed max-w-sm">
              Спасибо, {name.split(" ")[0]}! Мы рассмотрим вашу анкету и свяжемся с вами в ближайшее время — рады будущему знакомству!
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 lg:p-8 flex flex-col gap-7">

          {/* Контакты */}
          <div className="flex flex-col gap-4">
            <Label className="text-base font-semibold text-stone-800">Расскажите о себе</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="v-name" className="text-sm text-stone-500">Имя и фамилия <span className="text-rose-400">*</span></Label>
                <Input
                  id="v-name"
                  placeholder="Иванова Мария"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-phone" className="text-sm text-stone-500">Телефон <span className="text-rose-400">*</span></Label>
                <Input
                  id="v-phone"
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
                <Label htmlFor="v-email" className="text-sm text-stone-500">Email <span className="text-rose-400">*</span></Label>
                <Input
                  id="v-email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-age" className="text-sm text-stone-500">Возраст <span className="text-rose-400">*</span></Label>
                <Input
                  id="v-age"
                  type="number"
                  min={1}
                  max={99}
                  placeholder="Ваш возраст"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="rounded-xl"
                  required
                />
                {ageTooYoung && (
                  <div className="flex items-start gap-1.5 mt-1">
                    <AlertCircle className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-600">Принимаем с 16 лет, до 18 — с разрешения родителей.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Чем помочь */}
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-base font-semibold text-stone-800">Чем вы хотели бы помочь?</Label>
              <p className="text-sm text-stone-400 mt-0.5">Можно выбрать несколько вариантов</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITIES.map((a) => (
                <ToggleButton key={a} active={activities.includes(a)} onClick={() => toggleActivity(a)}>
                  {a}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Когда удобно */}
          <div className="flex flex-col gap-5">
            <Label className="text-base font-semibold text-stone-800">Когда вам удобно?</Label>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-stone-500">Как часто готовы приезжать</p>
              <div className="flex flex-wrap gap-2">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <ToggleButton
                    key={opt.value}
                    active={frequency === opt.value}
                    onClick={() => setFrequency(opt.value)}
                  >
                    {opt.label}
                  </ToggleButton>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-stone-500">Удобные дни</p>
              <div className="flex gap-2">
                {["Будни", "Выходные"].map((d) => (
                  <ToggleButton key={d} active={days.includes(d)} onClick={() => toggleDay(d)}>
                    {d}
                  </ToggleButton>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* О себе */}
          <div className="flex flex-col gap-5">
            <Label className="text-base font-semibold text-stone-800">Немного о вас</Label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-stone-500">Есть автомобиль?</p>
                <YesNoToggle value={hasCar} onChange={setHasCar} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-stone-500">Есть домашние питомцы?</p>
                <YesNoToggle value={hasPets} onChange={setHasPets} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-stone-500">Опыт волонтёрства?</p>
                <YesNoToggle value={priorVolunteer} onChange={setPriorVolunteer} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-exp" className="text-sm text-stone-500">
                Опыт с животными <span className="text-stone-400">— если есть, расскажите</span>
              </Label>
              <textarea
                id="v-exp"
                placeholder="Держали животных, работали с ними, обучали..."
                value={animalExperience}
                onChange={(e) => setAnimalExperience(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-motivation" className="text-sm text-stone-500">
                Почему хотите помочь? <span className="text-stone-400">— необязательно</span>
              </Label>
              <textarea
                id="v-motivation"
                placeholder="Расскажите немного о себе — нам важно вас узнать"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3">
              <AlertCircle className="size-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!canSubmit}
            size="lg"
            className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white text-base disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Отправляем...
              </>
            ) : (
              <>
                <Heart className="mr-2 size-4" />
                Отправить анкету
              </>
            )}
          </Button>

          <p className="text-xs text-stone-400 text-center leading-relaxed -mt-2">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
              политикой обработки персональных данных
            </a>
          </p>
        </form>
      )}

      {/* Боковая панель */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6 flex flex-col gap-4">
          <h2 className="font-bold text-stone-800 text-lg">Чем занимаются волонтёры</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Любая помощь важна — даже несколько часов в месяц делают жизнь наших питомцев лучше.
          </p>
          <ul className="flex flex-col gap-3">
            {sidebarItems.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-white flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-stone-700">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col gap-3">
          <h2 className="font-bold text-stone-800 text-base">Кто может стать волонтёром</h2>
          <ul className="flex flex-col gap-2">
            {[
              "Возраст от 16 лет",
              "Любовь к животным",
              "2–3 свободных часа в неделю",
              "Желание помогать",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="size-1.5 rounded-full bg-purple-400 shrink-0" />
                <span className="text-sm text-stone-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
