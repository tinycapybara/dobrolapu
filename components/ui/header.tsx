"use client"

import { useState } from "react"
import Link from "next/link"
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
  Home,
  Heart,
  Users,
  HandHeart,
  Phone,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/pets", label: "Наши питомцы", icon: PawPrint },
  { href: "/about", label: "О приюте", icon: Users },
  { href: "/help", label: "Как помочь", icon: HandHeart },
  { href: "/contacts", label: "Контакты", icon: Phone },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

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
        </nav>

        {/* Кнопка "Помочь сейчас" - десктоп */}
        <div className="hidden lg:block">
          <Button asChild className="gap-2 bg-[#D4849A] hover:bg-[#C4728A] text-white">
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
            <div className="flex flex-1 flex-col">
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
              </nav>
              <div className="mt-auto border-t p-4">
                <Button asChild className="w-full gap-2 bg-[#D4849A] hover:bg-[#C4728A] text-white" size="lg">
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