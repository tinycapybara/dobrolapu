import Link from "next/link"
import { PawPrint } from "lucide-react"

const navLinks = [
  { href: "/pets", label: "Питомцы" },
  { href: "/about", label: "О приюте" },
  { href: "/donate", label: "Помочь" },
  { href: "/contacts", label: "Контакты" },
]

export function Footer() {
  return (
    <footer className="bg-[#8B3049] text-stone-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-white">
              <PawPrint className="size-6 text-[#D4849A]" />
              <span className="text-lg font-bold">Добрые лапки</span>
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

        <div className="mt-10 pt-6 border-t border-[#6B2038] text-center text-sm text-stone-300">
          © {new Date().getFullYear()} Добрые лапки. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
