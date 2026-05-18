"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  PawPrint, Menu, X, LayoutDashboard, Pill,
  ClipboardList, Users, Heart, LogOut,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/animals", label: "Животные", icon: PawPrint },
  { href: "/admin/treatments", label: "Срочные сборы", icon: Pill },
  { href: "/admin/requests", label: "Заявки", icon: ClipboardList },
  { href: "/admin/volunteers", label: "Волонтёры", icon: Users },
  { href: "/admin/donations", label: "Пожертвования", icon: Heart },
]

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-stone-100">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#D4849A]">
            <PawPrint className="size-4 text-white" />
          </div>
          <span className="text-sm font-bold text-stone-800">Панель управления</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="size-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 z-50 bg-white shadow-xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#D4849A]">
              <PawPrint className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold text-stone-800">Добрые лапки</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="size-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Выйти
          </button>
        </div>
      </div>
    </>
  )
}
