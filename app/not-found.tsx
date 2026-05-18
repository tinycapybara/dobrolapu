import Link from "next/link"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { PawPrint, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-8">

          {/* Иконка */}
          <div className="relative">
            <div className="size-32 rounded-full bg-[#FAF0F3] flex items-center justify-center">
              <PawPrint className="size-16 text-[#D4849A]" />
            </div>
            <div className="absolute -top-2 -right-2 size-10 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center">
              <span className="text-lg font-bold text-stone-400">?</span>
            </div>
          </div>

          {/* Текст */}
          <div className="flex flex-col gap-3">
            <p className="text-8xl font-bold text-[#D4849A]/20 leading-none">404</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 -mt-4">
              Страница потерялась
            </h1>
            <p className="text-stone-500 leading-relaxed">
              Кажется, эта страница убежала вместе с нашими питомцами. Но мы поможем вам найти дорогу обратно.
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 rounded-xl border-stone-200 gap-2"
            >
              <Link href="/pets">
                <Search className="size-4" />
                Найти питомца
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white gap-2"
            >
              <Link href="/">
                <Home className="size-4" />
                На главную
              </Link>
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
