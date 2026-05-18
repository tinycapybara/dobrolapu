import Link from "next/link"
import { Users, ArrowLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { VolunteerForm } from "./volunteer-form"

export const metadata = {
  title: "Стать волонтёром | Добрые лапки",
  description: "Узнайте, как стать волонтёром приюта и помогать питомцам",
}

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F9] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">

          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Назад к способам помочь
          </Link>

          <div className="mb-10 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-purple-100 mb-4">
              <Users className="size-7 text-purple-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800">Стать волонтёром</h1>
            <p className="mt-2 text-stone-500 max-w-md mx-auto">
              Даже несколько часов в неделю могут изменить жизнь наших питомцев
            </p>
          </div>

          <VolunteerForm />

        </div>
      </main>

      <Footer />
    </div>
  )
}
