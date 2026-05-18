"use client"

import { useTransition } from "react"
import { Home, Loader2 } from "lucide-react"
import { markFoundHome } from "./actions"

export function FoundHomeButton({ animalId }: { animalId: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => markFoundHome(animalId))}
      disabled={isPending}
      title="Нашёл дом"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-green-600 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Home className="size-3.5" />}
      Нашёл дом
    </button>
  )
}
