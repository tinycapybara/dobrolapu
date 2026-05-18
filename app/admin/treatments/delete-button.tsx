"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteTreatment } from "./actions"

export function DeleteTreatmentButton({ id, disease }: { id: number; disease: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(`Удалить сбор «${disease}»? Это действие нельзя отменить.`)) return
    startTransition(() => deleteTreatment(id))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
      {isPending ? "Удаление..." : "Удалить"}
    </button>
  )
}
