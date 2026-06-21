import { supabaseAdmin } from "@/lib/supabase-admin"
import { FileText, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Отчёты — Добрые лапки",
  description: "Финансовые отчёты приюта о расходовании пожертвований",
}

function formatAmount(n: number | null) {
  if (n === null) return null
  return n.toLocaleString("ru-RU") + " ₽"
}

export default async function ReportsPage() {
  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select("id, title, period, amount, description, document_url, created_at")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-stone-800">Отчёты о расходах</h1>
          <p className="mt-2 text-stone-500">
            Рассказываем, на что идут ваши пожертвования
          </p>
        </div>

        {!reports || reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-20 text-center">
            <FileText className="size-10 text-stone-300 mb-3" />
            <p className="text-stone-500 font-medium">Отчётов пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((r) => (
              <article key={r.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-stone-800">{r.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      {r.period && <span className="text-sm text-stone-400">{r.period}</span>}
                      {r.amount !== null && (
                        <span className="text-sm font-semibold text-[#D4849A]">{formatAmount(r.amount)}</span>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-3 text-sm text-stone-600 leading-relaxed whitespace-pre-line">{r.description}</p>
                    )}
                  </div>

                  {r.document_url && (
                    <a
                      href={r.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-500 hover:border-[#D4849A] hover:text-[#D4849A] transition-colors"
                    >
                      <FileText className="size-3.5" />
                      Документ
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
