"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  PawPrint,
  Menu,
  Heart,
  Gift,
  Users,
  HandHeart,
  Phone,
  Pill,
  ShoppingCart,
  ChevronDown,
  UserCircle,
  LogOut,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/pets", label: "Наши питомцы", icon: PawPrint },
  { href: "/treatments", label: "Срочные сборы", icon: Pill },
  { href: "/about", label: "О приюте", icon: Users },
  { href: "/contacts", label: "Контакты", icon: Phone },
]

const helpSubItems = [
  { href: "/help/food", label: "Помочь с кормом", icon: ShoppingCart },
  { href: "/help/medicine", label: "Помочь с лекарствами", icon: Pill },
  { href: "/help/volunteer", label: "Стать волонтёром", icon: Users },
  { href: "/help/guardian", label: "Стать опекуном / Забрать домой", icon: Heart },
  { href: "/donate", label: "Пожертвовать", icon: Gift },
]

export function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary">
            <PawPrint className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Добрые лапки</span>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}

          {/* Дропдаун "Как помочь" */}
          <div className="relative group">
            <Link
              href="/help"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <HandHeart className="size-4" />
              Как помочь
              <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown panel */}
            <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-50 min-w-[220px]">
              <div className="rounded-xl bg-white border border-stone-100 shadow-lg py-1.5 overflow-hidden">
                {helpSubItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-[#FAF0F3] hover:text-stone-800 transition-colors"
                  >
                    <sub.icon className="size-4 text-[#D4849A] shrink-0" />
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Войти / Кабинет + кнопка "Помочь сейчас" - десктоп */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Button
                asChild
                variant="outline"
                className="gap-2 rounded-full border-[#D4849A] text-[#D4849A] hover:bg-[#FAF0F3] hover:text-[#C4728A] hover:border-[#C4728A]"
              >
                <Link href="/profile">
                  <UserCircle className="size-4" />
                  Личный кабинет
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full text-stone-400 hover:text-red-500"
                title="Выйти"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-full border-[#D4849A] text-[#D4849A] hover:bg-[#FAF0F3] hover:text-[#C4728A] hover:border-[#C4728A]"
            >
              <Link href="/login">
                <UserCircle className="size-4" />
                Войти
              </Link>
            </Button>
          )}
          <Button asChild className="gap-2 bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-full">
            <Link href="/donate">
              <Heart className="size-4" />
              Помочь сейчас
            </Link>
          </Button>
        </div>

        {/* Мобильное меню */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                  <PawPrint className="size-4 text-primary-foreground" />
                </div>
                Добрые лапки
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="size-5 text-primary" />
                    {item.label}
                  </Link>
                ))}

                {/* Как помочь — раскрываемый блок */}
                <button
                  type="button"
                  onClick={() => setHelpOpen((v) => !v)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
                >
                  <HandHeart className="size-5 text-primary" />
                  Как помочь
                  <ChevronDown className={`size-4 ml-auto text-muted-foreground transition-transform ${helpOpen ? "rotate-180" : ""}`} />
                </button>

                {helpOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-stone-100 pl-3">
                    <Link
                      href="/help"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <HandHeart className="size-4 text-[#D4849A]" />
                      Все способы помочь
                    </Link>
                    {helpSubItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <sub.icon className="size-4 text-[#D4849A]" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
              <div className="mt-auto border-t p-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full gap-2 rounded-full border-[#D4849A] text-[#D4849A] hover:bg-[#FAF0F3] hover:text-[#C4728A] hover:border-[#C4728A]"
                      size="lg"
                    >
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <UserCircle className="size-4" />
                        Личный кабинет
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => { setIsOpen(false); handleLogout() }}
                      className="w-full gap-2 rounded-full text-stone-500 hover:text-red-500"
                    >
                      <LogOut className="size-4" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 rounded-full border-[#D4849A] text-[#D4849A] hover:bg-[#FAF0F3] hover:text-[#C4728A] hover:border-[#C4728A]"
                    size="lg"
                  >
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <UserCircle className="size-4" />
                      Войти / Зарегистрироваться
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full gap-2 bg-[#D4849A] hover:bg-[#C4728A] text-white rounded-full" size="lg">
                  <Link href="/donate" onClick={() => setIsOpen(false)}>
                    <Heart className="size-4" />
                    Помочь сейчас
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
