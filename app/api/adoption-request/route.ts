import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

function normalizeText(s: string): string {
  return s.trim().replace(/\s+/g, " ")
}

const ipRequests = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (ipRequests.get(ip) ?? []).filter(t => now - t < 60_000)
  timestamps.push(now)
  ipRequests.set(ip, timestamps)
  return timestamps.length > 3
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (isRateLimited(ip)) {
    return Response.json({ error: "Слишком много запросов. Попробуйте через минуту." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Неверный формат запроса" }, { status: 400 })
  }

  const { animal_id, animal_name, type, name, phone, email, message } = body as Record<string, unknown>

  if (!animal_id || !type || !name || !phone) {
    return Response.json({ error: "Заполните обязательные поля" }, { status: 400 })
  }

  if (type !== "guardian" && type !== "adopt") {
    return Response.json({ error: "Неверный тип заявки" }, { status: 400 })
  }

  const cleanName = normalizeText(String(name))
  const cleanPhone = normalizeText(String(phone))

  if (cleanName.length < 2 || cleanName.length > 100) {
    return Response.json({ error: "Проверьте имя" }, { status: 400 })
  }
  if (cleanPhone.length < 5 || cleanPhone.length > 30) {
    return Response.json({ error: "Проверьте телефон" }, { status: 400 })
  }

  // Если пользователь авторизован — привязываем заявку к его аккаунту
  let userId: string | null = null
  const authHeader = req.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "")
    const { data: { user } } = await supabase.auth.getUser(token)
    if (user) userId = user.id
  }

  const { error } = await supabaseAdmin.from("adoption_requests").insert({
    animal_id: Number(animal_id),
    animal_name: animal_name ? normalizeText(String(animal_name)) : null,
    type: String(type),
    name: cleanName,
    phone: cleanPhone,
    email: email ? normalizeText(String(email)) : null,
    message: message ? String(message).trim() : null,
    user_id: userId,
  })

  if (error) {
    console.error("adoption_requests insert error:", error)
    return Response.json({ error: "Ошибка сервера. Попробуйте ещё раз." }, { status: 500 })
  }

  return Response.json({ ok: true }, { status: 200 })
}
