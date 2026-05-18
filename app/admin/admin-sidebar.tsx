"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PawPrint, ClipboardList, Users, Heart, LogOut, Pill, LayoutDashboard } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/animals", label: "Животные", icon: PawPrint },
  { href: "/admin/treatments", label: "Срочные сборы", icon: Pill },
  { href: "/admin/requests", label: "Заявки", icon: ClipboardList },
  { href: "/admin/volunteers", label: "Волонтёры", icon: Users },
  { href: "/admin/donations", label: "Пожертвования", icon: Heart },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <aside className="w-56 shrink-0 border-r border-stone-100 bg-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-stone-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#D4849A]">
            <PawPrint className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800 leading-none">Добрые лапки</p>
            <p className="text-xs text-stone-400 mt-0.5">Панель управления</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#FAF0F3] text-[#D4849A]"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-stone-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          Выйти
        </button>
      </div>
    </aside>
  )
}
