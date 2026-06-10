"use client"

import { useTransition } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { updateRequestStatus } from "./actions"

type Props = {
  id: number
  statusId: number
  userId: string | null
}

export function StatusActions({ id, statusId, userId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handle(newStatus: number) {
    startTransition(() => updateRequestStatus(id, newStatus, userId))
  }

  if (statusId !== 1) {
    // Уже обработана — показываем кнопку «Вернуть на рассмотрение»
    return (
      <button
        onClick={() => handle(1)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
        Вернуть
      </button>
    )
  }

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => handle(2)}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
        Одобрить
      </button>
      <button
        onClick={() => handle(3)}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
        Отклонить
      </button>
    </div>
  )
}
