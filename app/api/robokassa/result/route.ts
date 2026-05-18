import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)

  const outSum = params.get("OutSum")
  const invId = params.get("InvId")
  const signatureValue = params.get("SignatureValue")

  if (!outSum || !invId || !signatureValue) {
    return new Response("bad request", { status: 400 })
  }

  // Проверяем подпись через PASS2 (второй пароль Robokassa)
  const mrh_pass2 = process.env.ROBOKASSA_PASS2!
  const expectedSignature = crypto
    .createHash("md5")
    .update(`${outSum}:${invId}:${mrh_pass2}`)
    .digest("hex")
    .toLowerCase()

  if (signatureValue.toLowerCase() !== expectedSignature) {
    console.error("Robokassa: неверная подпись", { invId, signatureValue, expectedSignature })
    return new Response("bad sign", { status: 400 })
  }

  // Подпись верна — фиксируем оплату
  const { error } = await supabaseAdmin
    .from("donations")
    .update({ status: "completed", paid_at: new Date().toISOString() })
    .eq("inv_id", Number(invId))

  if (error) {
    console.error("Supabase update error:", error)
    return new Response("db error", { status: 500 })
  }

  // Robokassa ждёт именно эту строку — иначе будет повторять запросы
  return new Response(`OK${invId}`, { status: 200 })
}
