import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Plus, FileText } from "lucide-react"
import { DeleteReportButton } from "./delete-button"
import { VisibilityToggle } from "./visibility-toggle"

export const dynamic = "force-dynamic"

export const metadata = { title: "Отчёты — Добрые лапки" }

function formatAmount(n: number | null) {
  if (n === null) return null
  return n.toLocaleString("ru-RU") + " ₽"
}

export default async function AdminReportsPage() {
  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Отчёты</h1>
          <p className="text-sm text-stone-500 mt-0.5">Финансовые отчёты для посетителей сайта</p>
        </div>
        <Link
          href="/admin/reports/new"
          className="flex items-center gap-2 rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          <Plus className="size-4" />
          Новый отчёт
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center">
          <FileText className="size-10 text-stone-300 mb-3" />
          <p className="text-stone-500 font-medium">Отчётов пока нет</p>
          <p className="text-sm text-stone-400 mt-1">Создайте первый отчёт о расходах</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 truncate">{r.title}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                  {r.period && <span className="text-xs text-stone-500">{r.period}</span>}
                  {r.amount && <span className="text-xs text-[#D4849A] font-medium">{formatAmount(r.amount)}</span>}
                </div>
                {r.description && (
                  <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{r.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {r.document_url && (
                  <a
                    href={r.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Открыть документ"
                    className="size-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-[#D4849A] hover:bg-[#FAF0F3] transition-colors"
                  >
                    <FileText className="size-4" />
                  </a>
                )}
                <VisibilityToggle id={r.id} isVisible={r.is_visible} />
                <DeleteReportButton id={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
