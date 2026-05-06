import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { amount, donor_name, comment } = await req.json()

  const mrh_login = process.env.ROBOKASSA_LOGIN!
  const mrh_pass1 = process.env.ROBOKASSA_PASS1!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const outSum = amount
  const invId = Math.floor(Math.random() * 1000000)

  const signature = crypto
    .createHash("md5")
    .update(`${mrh_login}:${outSum}:${invId}:${mrh_pass1}`)
    .digest("hex")

  const url =
    `https://auth.robokassa.ru/Merchant/Index.aspx` +
    `?MerchantLogin=${mrh_login}` +
    `&OutSum=${outSum}` +
    `&InvId=${invId}` +
    `&Description=Donation` +
    `&SignatureValue=${signature}` +
    `&SuccessURL=${encodeURIComponent(`${baseUrl}/donate/success`)}` +
    `&FailURL=${encodeURIComponent(`${baseUrl}/donate/fail`)}` +
    `&IsTest=1`

  await supabase.from("donations").insert({
    donor_name: donor_name || null,
    comment: comment || null,
    amount: outSum,
  })

  return NextResponse.json({ url })
}
