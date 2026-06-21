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
            <div className="flex flex-col gap-3">
              {reports.map((r) => (
                <article key={r.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm px-5 py-4 flex gap-4 items-start">
                  <div className="size-10 rounded-xl bg-[#FAF0F3] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="size-5 text-[#D4849A]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <h2 className="font-semibold text-stone-800">{r.title}</h2>
                      {r.period && <span className="text-sm text-stone-400">{r.period}</span>}
                      {r.amount !== null && (
                        <span className="text-sm font-semibold text-[#D4849A]">{formatAmount(r.amount)}</span>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-1.5 text-sm text-stone-500 leading-relaxed whitespace-pre-line">
                        {r.description}
                      </p>
                    )}
                  </div>

                  {r.document_url && (
                    <a
                      href={r.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-500 hover:border-[#D4849A] hover:text-[#D4849A] transition-colors mt-0.5"
                    >
                      <ExternalLink className="size-3" />
                      Документ
                    </a>
                  )}
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
