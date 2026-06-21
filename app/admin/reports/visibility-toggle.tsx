"use client"

import { useTransition } from "react"
import { toggleVisibility } from "./actions"

export function VisibilityToggle({ id, isVisible }: { id: number; isVisible: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => toggleVisibility(id, e.target.checked))
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={isVisible}
        onChange={handleChange}
        disabled={isPending}
        className="size-4 rounded border-stone-300 accent-[#D4849A] cursor-pointer disabled:opacity-50"
      />
      <span className="text-sm text-stone-600">{isVisible ? "Опубликован" : "Скрыт"}</span>
    </label>
  )
}
