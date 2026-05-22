"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PawPrint, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.refresh()
      router.push("/admin")
    } else {
      const data = await res.json()
      setError(data.error ?? "Ошибка входа")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#FAF0F3] mb-4">
            <PawPrint className="size-7 text-[#D4849A]" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Вход в панель</h1>
          <p className="text-sm text-stone-400 mt-1">Добрые лапки — только для сотрудников</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-semibold text-stone-800">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-semibold text-stone-800">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full rounded-xl bg-[#D4849A] hover:bg-[#C4728A] text-white"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Войти"}
          </Button>
        </form>

      </div>
    </div>
  )
}
