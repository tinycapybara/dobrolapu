import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

// ── Нормализация текста ───────────────────────────────────────────────────────
function normalizeText(text: string): string {
  return text
    .trim()                        // убираем пробелы по краям
    .replace(/\s+/g, " ")         // множественные пробелы/табы/переносы → один пробел
    .replace(/[^\S\n]+\n/g, "\n") // пробелы перед переносом строки
    .slice(0, 500)                 // жёсткий обрез на случай если клиент обошёл лимит
}

// ── Ограничения длины полей ────────────────────────────────────────────────────
const MAX_NAME_LENGTH = 100
const MAX_COMMENT_LENGTH = 500
const MIN_AMOUNT = 1
const MAX_AMOUNT = 500_000

// ── Rate limiting (в памяти процесса) ─────────────────────────────────────────
// Хранит { timestamp[] } по IP. Для продакшена лучше Redis, но для диплома достаточно.
const ipRequests = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 минута
const RATE_LIMIT_MAX = 5            // не более 5 запросов в минуту с одного IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (ipRequests.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  ipRequests.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX
}

// ── Роут ──────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Rate limiting по IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через минуту." },
      { status: 429 }
    )
  }

  // Получаем user_id из токена авторизации (если пользователь залогинен)
  const authHeader = req.headers.get("Authorization")
  let userId: string | null = null
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const { data: { user } } = await supabase.auth.getUser(token)
    userId = user?.id ?? null
  }

  const raw = await req.json()

  // Нормализация текстовых полей
  const donor_name = raw.donor_name ? normalizeText(String(raw.donor_name)) : null
  const comment = raw.comment ? normalizeText(String(raw.comment)) : null

  // Валидация суммы
  const outSum = Number(raw.amount)
  if (!outSum || outSum < MIN_AMOUNT || outSum > MAX_AMOUNT) {
    return NextResponse.json({ error: "Некорректная сумма" }, { status: 400 })
  }

  // Валидация treatment_id
  const treatment_id = raw.treatment_id != null ? Number(raw.treatment_id) : null
  if (treatment_id !== null && (!Number.isInteger(treatment_id) || treatment_id <= 0)) {
    return NextResponse.json({ error: "Некорректный treatment_id" }, { status: 400 })
  }

  // Валидация имени
  if (donor_name && donor_name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Имя слишком длинное" }, { status: 400 })
  }

  // Валидация комментария
  if (comment && comment.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json({ error: "Комментарий слишком длинный" }, { status: 400 })
  }

  const mrh_login = process.env.ROBOKASSA_LOGIN!
  const mrh_pass1 = process.env.ROBOKASSA_PASS1!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const invId = Math.floor(Math.random() * 1_000_000)

  const signature = crypto
    .createHash("md5")
    .update(`${mrh_login}:${outSum}:${invId}:${mrh_pass1}`)
    .digest("hex")

  const { error } = await supabaseAdmin.from("donations").insert({
    inv_id: invId,
    amount: outSum,
    donor_name: donor_name || null,
    comment: comment || null,
    status: "pending",
    treatment_id: treatment_id,
    user_id: userId,
  })

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 })
  }

  const url =
    `https://auth.robokassa.ru/Merchant/Index.aspx` +
    `?MerchantLogin=${mrh_login}` +
    `&OutSum=${outSum}` +
    `&InvId=${invId}` +
    `&Description=Пожертвование приюту Добрые лапки` +
    `&SignatureValue=${signature}` +
    `&SuccessURL=${encodeURIComponent(`${baseUrl}/donate/success`)}` +
    `&FailURL=${encodeURIComponent(`${baseUrl}/donate/fail`)}` +
    `&ResultURL=${encodeURIComponent(`${baseUrl}/api/robokassa/result`)}` +
    `&IsTest=1`

  return NextResponse.json({ url })
}
