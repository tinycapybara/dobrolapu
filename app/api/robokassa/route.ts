import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { amount, donor_name, comment } = await req.json()

  const mrh_login = process.env.ROBOKASSA_LOGIN!
  const mrh_pass1 = process.env.ROBOKASSA_PASS1!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const outSum = amount
  const invId = Math.floor(Math.random() * 1_000_000)

  const signature = crypto
    .createHash("md5")
    .update(`${mrh_login}:${outSum}:${invId}:${mrh_pass1}`)
    .digest("hex")

  // Сначала сохраняем как pending — оплата ещё не подтверждена
  const { error } = await supabaseAdmin.from("donations").insert({
    inv_id: invId,
    amount: outSum,
    donor_name: donor_name || null,
    comment: comment || null,
    status: "pending",
  })

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json({ error: "DB error" }, { status: 500 })
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
