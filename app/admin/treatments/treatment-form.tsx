"use client"

import { useState, useTransition } from "react"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTreatment, updateTreatment } from "./actions"

type Animal = { id: number; name: string }

type TreatmentData = {
  id: number
  animal_id: number
  disease: string
  description: string
  goal_amount: number
  is_active: boolean
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <Label className="text-sm font-semibold text-stone-700">{label}</Label>
        {hint && <span className="text-xs text-stone-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function TreatmentForm({
  treatment,
  animals,
}: {
  treatment?: TreatmentData
  animals: Animal[]
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [animalId, setAnimalId] = useState(String(treatment?.animal_id ?? animals[0]?.id ?? ""))
  const [disease, setDisease] = useState(treatment?.disease ?? "")
  const [description, setDescription] = useState(treatment?.description ?? "")
  const [goalAmount, setGoalAmount] = useState(treatment?.goal_amount != null ? String(treatment.goal_amount) : "")
  const [isActive, setIsActive] = useState(treatment?.is_active ?? true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (!animalId || !disease.trim() || !description.trim() || !goalAmount) {
      setError("Заполните все обязательные поля")
      return
    }

    const payload = {
      animal_id: Number(animalId),
      disease: disease.trim(),
      description: description.trim(),
      goal_amount: Number(goalAmount),
      is_active: isActive,
    }

    startTransition(async () => {
      try {
        if (treatment) {
          await updateTreatment(treatment.id, payload)
          setSaved(true)
        } else {
          await createTreatment(payload)
        }
      } catch (err) {
        setError(String(err).replace("Error: ", ""))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-5">

      <FormField label="Животное *">
        <select
          value={animalId}
          onChange={(e) => setAnimalId(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A] transition-colors"
          required
        >
          {animals.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Диагноз *">
        <Input
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          placeholder="Например: перелом лапы, панлейкопения..."
          className="rounded-xl"
          required
        />
      </FormField>

      <FormField label="Описание *" hint="подробнее о ситуации и лечении">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опишите ситуацию, что нужно сделать, куда пойдут деньги"
          rows={4}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A] transition-colors"
          required
        />
      </FormField>

      <FormField label="Цель сбора *" hint="в рублях">
        <div className="relative">
          <Input
            type="number"
            min={1}
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            placeholder="10000"
            className="rounded-xl pr-8"
            required
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₽</span>
        </div>
      </FormField>

      <FormField label="Статус сбора">
        <div className="flex gap-2">
          {[
            { value: true, label: "Активный" },
            { value: false, label: "Закрыт" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setIsActive(opt.value)}
              className={`rounded-xl py-2 px-5 text-sm font-medium border transition-colors ${
                isActive === opt.value
                  ? opt.value
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-stone-500 border-stone-500 text-white"
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FormField>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && <p className="text-sm text-green-600">Сохранено ✓</p>}

      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white disabled:opacity-50"
      >
        {isPending ? (
          <><Loader2 className="mr-2 size-4 animate-spin" />Сохраняем...</>
        ) : (
          <><Save className="mr-2 size-4" />{treatment ? "Сохранить изменения" : "Создать сбор"}</>
        )}
      </Button>
    </form>
  )
}
