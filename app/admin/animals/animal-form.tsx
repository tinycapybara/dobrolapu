"use client"

import { useState, useTransition } from "react"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAnimal, updateAnimal } from "./actions"

type LookupItem = { id: number; label: string }

type AnimalData = {
  id: number
  name: string
  gender: string
  breed: string | null
  age: number | null
  size: string
  type_id: number
  status_id: number
  guardianship_id: number
  description: string | null
}

const GENDER_OPTIONS = ["Мальчик", "Девочка"]
const SIZE_OPTIONS = [
  { value: "small", label: "Маленький" },
  { value: "medium", label: "Средний" },
  { value: "large", label: "Большой" },
]

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-stone-700">{label}</Label>
      {children}
    </div>
  )
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A] transition-colors"
    >
      {children}
    </select>
  )
}

export function AnimalForm({
  animal,
  types,
  statuses,
  guardianships,
}: {
  animal?: AnimalData
  types: LookupItem[]
  statuses: LookupItem[]
  guardianships: LookupItem[]
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState(animal?.name ?? "")
  const [gender, setGender] = useState(animal?.gender ?? GENDER_OPTIONS[0])
  const [breed, setBreed] = useState(animal?.breed ?? "")
  const [age, setAge] = useState(animal?.age != null ? String(animal.age) : "")
  const [size, setSize] = useState(animal?.size ?? "medium")
  const [typeId, setTypeId] = useState(String(animal?.type_id ?? types[0]?.id ?? ""))
  const [statusId, setStatusId] = useState(String(animal?.status_id ?? statuses[0]?.id ?? ""))
  const [guardianshipId, setGuardianshipId] = useState(String(animal?.guardianship_id ?? guardianships[0]?.id ?? ""))
  const [description, setDescription] = useState(animal?.description ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    const payload = {
      name: name.trim(),
      gender,
      breed: breed.trim() || null,
      age: age ? Number(age) : null,
      size,
      type_id: Number(typeId),
      status_id: Number(statusId),
      guardianship_id: Number(guardianshipId),
      description: description.trim() || null,
    }

    if (!payload.name) {
      setError("Введите кличку")
      return
    }

    startTransition(async () => {
      try {
        if (animal) {
          await updateAnimal(animal.id, payload)
          setSaved(true)
        } else {
          await createAnimal(payload)
        }
      } catch (err) {
        setError(String(err).replace("Error: ", ""))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Кличка *">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Мурзик"
            className="rounded-xl"
            required
          />
        </FormField>

        <FormField label="Пол">
          <SelectInput value={gender} onChange={setGender}>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Порода">
          <Input
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Беспородный"
            className="rounded-xl"
          />
        </FormField>

        <FormField label="Возраст (в месяцах)">
          <Input
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Например, 24 = 2 года"
            className="rounded-xl"
          />
        </FormField>

        <FormField label="Вид">
          <SelectInput value={typeId} onChange={setTypeId}>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Размер">
          <SelectInput value={size} onChange={setSize}>
            {SIZE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Статус">
          <SelectInput value={statusId} onChange={setStatusId}>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Опекунство">
          <SelectInput value={guardianshipId} onChange={setGuardianshipId}>
            {guardianships.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <FormField label="Описание">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Расскажите о характере и особенностях питомца"
          rows={4}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A] transition-colors"
        />
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
          <><Save className="mr-2 size-4" />{animal ? "Сохранить изменения" : "Создать животное"}</>
        )}
      </Button>
    </form>
  )
}
