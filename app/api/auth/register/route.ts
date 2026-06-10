import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Неверный формат запроса" }, { status: 400 })
  }

  const { email, password, full_name, phone } = body as Record<string, unknown>

  if (!email || !password) {
    return Response.json({ error: "Введите email и пароль" }, { status: 400 })
  }

  if (typeof password === "string" && password.length < 6) {
    return Response.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 })
  }

  // Создаём пользователя через Admin API (email сразу подтверждён)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: String(email),
    password: String(password),
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes("already registered") || authError.message.includes("already been registered")) {
      return Response.json({ error: "Этот email уже зарегистрирован" }, { status: 409 })
    }
    console.error("Auth createUser error:", authError)
    return Response.json({ error: "Ошибка при создании аккаунта" }, { status: 500 })
  }

  // Создаём профиль пользователя
  const { error: profileError } = await supabaseAdmin.from("users").insert({
    id: authData.user.id,
    email: String(email),
    full_name: full_name ? String(full_name).trim() || null : null,
    phone: phone ? String(phone).trim() || null : null,
    role_id: 1,
  })

  if (profileError) {
    // Откатываем: удаляем auth-пользователя если профиль не создался
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    console.error("User profile insert error:", profileError)
    return Response.json({ error: "Ошибка при создании профиля" }, { status: 500 })
  }

  return Response.json({ ok: true })
}
