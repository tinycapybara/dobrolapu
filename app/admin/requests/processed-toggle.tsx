"use client"

import { useTransition } from "react"
import { Check, Loader2 } from "lucide-react"
import { toggleProcessed } from "./actions"

export function ProcessedToggle({ id, isProcessed }: { id: number; isProcessed: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleProcessed(id, isProcessed))}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        isProcessed
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-stone-50 hover:border-stone-200 hover:text-stone-500"
          : "bg-white border-stone-200 text-stone-500 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
      }`}
    >
      {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
      {isProcessed ? "Обработано" : "Отметить"}
    </button>
  )
}
