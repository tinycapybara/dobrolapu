import { supabaseAdmin } from "@/lib/supabase-admin"

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

  const {
    name, phone, email, age,
    activities, frequency, days,
    has_car, has_pets, prior_volunteer,
    animal_experience, motivation,
  } = body as Record<string, unknown>

  if (!name || !phone || !email || !age || !Array.isArray(activities) || activities.length === 0) {
    return Response.json({ error: "Заполните обязательные поля" }, { status: 400 })
  }

  const cleanName = String(name).trim().replace(/\s+/g, " ")
  const ageNum = Number(age)

  if (cleanName.length < 2 || cleanName.length > 100) {
    return Response.json({ error: "Проверьте имя" }, { status: 400 })
  }
  if (!Number.isInteger(ageNum) || ageNum < 16 || ageNum > 99) {
    return Response.json({ error: "Волонтёрами принимаем с 16 лет" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from("volunteer_requests").insert({
    name: cleanName,
    phone: String(phone).trim(),
    email: String(email).trim().toLowerCase(),
    age: ageNum,
    activities: activities as string[],
    frequency: frequency ? String(frequency) : null,
    days: Array.isArray(days) ? days : [],
    has_car: typeof has_car === "boolean" ? has_car : null,
    has_pets: typeof has_pets === "boolean" ? has_pets : null,
    prior_volunteer: typeof prior_volunteer === "boolean" ? prior_volunteer : null,
    animal_experience: animal_experience ? String(animal_experience).trim() : null,
    motivation: motivation ? String(motivation).trim() : null,
  })

  if (error) {
    console.error("volunteer_requests insert error:", error)
    return Response.json({ error: "Ошибка сервера. Попробуйте ещё раз." }, { status: 500 })
  }

  return Response.json({ ok: true })
}
