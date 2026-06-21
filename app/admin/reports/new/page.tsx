import { ReportForm } from "../report-form"

export const metadata = { title: "Новый отчёт — Добрые лапки" }

export default function NewReportPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Новый отчёт</h1>
        <p className="text-sm text-stone-500 mt-0.5">Заполните данные о расходах</p>
      </div>
      <ReportForm />
    </div>
  )
}
