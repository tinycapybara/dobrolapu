import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ReportForm } from "../report-form"

export const metadata = { title: "Новый отчёт — Добрые лапки" }

export default function NewReportPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Назад к отчётам
        </Link>
        <h1 className="text-xl font-bold text-stone-800">Новый отчёт</h1>
        <p className="text-sm text-stone-500 mt-0.5">Заполните данные о расходах</p>
      </div>
      <ReportForm />
    </div>
  )
}
