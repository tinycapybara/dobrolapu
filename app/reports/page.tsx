import { supabaseAdmin } from "@/lib/supabase-admin"
import { FileText, ExternalLink } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

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
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
              <FileText className="size-7 text-[#D4849A]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Отчёты о расходах</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Рассказываем, на что идут ваши пожертвования
            </p>
          </div>
          {!reports || reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-24 text-center">
              <FileText className="size-12 text-stone-300 mb-4" />
              <p className="text-stone-500 font-medium text-lg">Отчётов пока нет</p>
              <p className="text-stone-400 text-sm mt-1">Заходите позже</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <article key={r.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="size-10 rounded-xl bg-[#FAF0F3] flex items-center justify-center shrink-0">
                      <FileText className="size-5 text-[#D4849A]" />
                    </div>
                    {r.document_url && (
                      <a
                        href={r.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Открыть документ"
                        className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs text-stone-500 hover:border-[#D4849A] hover:text-[#D4849A] transition-colors shrink-0"
                      >
                        <ExternalLink className="size-3" />
                        Документ
                      </a>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-stone-800 leading-snug">{r.title}</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                      {r.period && (
                        <span className="text-xs text-stone-400">{r.period}</span>
                      )}
                      {r.amount !== null && (
                        <span className="text-xs font-semibold text-[#D4849A]">{formatAmount(r.amount)}</span>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-2.5 text-sm text-stone-500 leading-relaxed line-clamp-4 whitespace-pre-line">
                        {r.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
