"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteReport } from "./actions"

export function DeleteReportButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm("Удалить отчёт?")) return
    startTransition(() => deleteReport(id))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Удалить"
      className="size-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  )
}
