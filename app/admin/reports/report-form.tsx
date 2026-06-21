"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createReport } from "./actions"

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-stone-700">{label}</Label>
      {children}
    </div>
  )
}

export function ReportForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [period, setPeriod] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const form = new FormData()
    form.append("file", file)
    try {
      const res = await fetch("/api/admin/upload-report", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? "Ошибка загрузки")
        return
      }
      setDocumentUrl(data.url)
      setDocumentName(file.name)
    } catch {
      setError("Ошибка соединения")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError("Введите заголовок"); return }
    startTransition(async () => {
      try {
        await createReport({
          title: title.trim(),
          period: period.trim() || null,
          amount: amount ? Number(amount) : null,
          description: description.trim() || null,
          document_url: documentUrl,
          is_visible: isVisible,
        })
        router.push("/admin/reports")
      } catch (err) {
        setError(String(err).replace("Error: ", ""))
      }
    })
  }

  const busy = isPending || uploading

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormField label="Заголовок *">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Закупка корма для кошек"
              className="rounded-xl"
              required
            />
          </FormField>
        </div>

        <FormField label="Период">
          <Input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="Например: Январь 2026"
            className="rounded-xl"
          />
        </FormField>

        <FormField label="Сумма (₽)">
          <Input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="15000"
            className="rounded-xl"
          />
        </FormField>
      </div>

      <FormField label="Описание">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="На что потрачены средства..."
          rows={4}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4849A]/30 focus:border-[#D4849A] transition-colors"
        />
      </FormField>

      <FormField label="Документ / чек">
        {documentUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3">
            <FileText className="size-5 text-[#D4849A] shrink-0" />
            <span className="text-sm text-stone-700 truncate flex-1">{documentName ?? "Файл загружен"}</span>
            <button
              type="button"
              onClick={() => { setDocumentUrl(null); setDocumentName(null) }}
              className="text-stone-400 hover:text-red-500 transition-colors shrink-0"
              title="Удалить файл"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label className={`flex items-center gap-2.5 rounded-xl border border-dashed border-stone-200 px-4 py-3 cursor-pointer transition-colors ${busy ? "opacity-50 pointer-events-none" : "hover:border-[#D4849A] hover:text-[#D4849A]"}`}>
            {uploading
              ? <><Loader2 className="size-4 animate-spin text-stone-400" /><span className="text-sm text-stone-500">Загружаем...</span></>
              : <><Upload className="size-4 text-stone-400" /><span className="text-sm text-stone-500">Прикрепить файл (JPG, PNG, PDF — до 10 МБ)</span></>
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={busy}
            />
          </label>
        )}
      </FormField>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="size-4 rounded border-stone-300 accent-[#D4849A] cursor-pointer"
        />
        <label htmlFor="is_visible" className="text-sm text-stone-600 cursor-pointer">
          Опубликовать (виден посетителям сайта)
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={busy}
        size="lg"
        className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white disabled:opacity-50"
      >
        {isPending
          ? <><Loader2 className="mr-2 size-4 animate-spin" />Сохраняем...</>
          : <><Save className="mr-2 size-4" />Создать отчёт</>
        }
      </Button>
    </form>
  )
}
