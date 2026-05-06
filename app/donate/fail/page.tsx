import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Heart, RefreshCw } from "lucide-react"

export const metadata = {
  title: "Ошибка оплаты | Добрые лапки",
}

export default function DonateFailPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
          {/* Иконка */}
          <div className="relative">
            <div className="size-28 rounded-full bg-stone-100 flex items-center justify-center">
              <Heart className="size-14 text-stone-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-9 rounded-full bg-stone-400 flex items-center justify-center border-2 border-white">
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Заголовок */}
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">
              Что-то пошло не так
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Оплата не прошла. Попробуйте ещё раз — мы будем рады вашей помощи
            </p>
          </div>

          {/* Подсказка */}
          <div className="rounded-2xl bg-white border border-stone-200 px-6 py-5 text-stone-500 text-sm leading-relaxed">
            <p>
              Возможно, платёж был отклонён банком или соединение прервалось. Это бывает — просто
              попробуйте ещё раз или воспользуйтесь другой картой.
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild size="lg" variant="outline" className="flex-1 rounded-xl border-stone-200">
              <Link href="/">Вернуться на главную</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white gap-2"
            >
              <Link href="/donate">
                <RefreshCw className="size-4" />
                Попробовать снова
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
