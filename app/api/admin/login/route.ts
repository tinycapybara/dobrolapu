import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return Response.json({ error: "Введите email и пароль" }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return Response.json({ error: "Неверный email или пароль" }, { status: 401 })
  }

  // Проверяем, что пользователь — администратор (role_id = 2)
  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("role_id")
    .eq("id", data.user.id)
    .single()

  if (!profile || profile.role_id !== 2) {
    return Response.json({ error: "Доступ запрещён" }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 часов
    path: "/",
  })

  return Response.json({ ok: true })
}
