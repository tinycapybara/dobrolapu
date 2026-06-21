import Link from "next/link"
import { PawPrint } from "lucide-react"

const navLinks = [
  { href: "/pets", label: "Питомцы" },
  { href: "/quiz", label: "Подобрать питомца" },
  { href: "/treatments", label: "Срочные сборы" },
  { href: "/about", label: "О приюте" },
  { href: "/donate", label: "Помочь" },
  { href: "/contacts", label: "Контакты" },
  { href: "/reports", label: "Отчёты" },
]

const legalLinks = [
  { href: "/oferta", label: "Договор оферты" },
  { href: "/privacy", label: "Политика конфиденциальности" },
]

export function Footer() {
  return (
    <footer className="bg-[#8B3049] text-stone-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                <PawPrint className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold">Добрые лапки</span>
            </Link>
            <p className="text-sm text-stone-400 max-w-xs">
              Городской приют для кошек и собак. Помогаем найти дом с 2018 года.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[#6B2038] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Добрые лапки. Все права защищены.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
