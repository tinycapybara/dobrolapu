"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PawPrint, Eye, EyeOff, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 1. Создаём аккаунт через сервер
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, phone }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Ошибка при регистрации")
        return
      }

      // 2. Входим, чтобы получить сессию
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError("Аккаунт создан. Войдите вручную.")
        router.push("/login")
        return
      }

      router.push("/profile")
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#D4849A]">
              <PawPrint className="size-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-800">Добрые лапки</span>
          </Link>
          <p className="text-stone-500 text-sm">Создайте аккаунт</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="full-name">
                Имя <span className="text-stone-400 font-normal text-sm">— необязательно</span>
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="Как вас зовут?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl"
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Телефон <span className="text-stone-400 font-normal text-sm">— необязательно</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl"
                autoComplete="tel"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                Пароль <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pr-10"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading || !email || password.length < 6}
              className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white mt-2"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#D4849A] hover:underline font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
