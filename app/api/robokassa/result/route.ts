import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase-admin"

async function handleResult(outSum: string | null, invId: string | null, signatureValue: string | null) {
  if (!outSum || !invId || !signatureValue) {
    return new Response("bad request", { status: 400 })
  }

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

  const { error } = await supabaseAdmin
    .from("donations")
    .update({ status: "completed", paid_at: new Date().toISOString() })
    .eq("inv_id", Number(invId))

  if (error) {
    console.error("Supabase update error:", error)
    return new Response("db error", { status: 500 })
  }

  return new Response(`OK${invId}`, { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)
  return handleResult(
    params.get("OutSum"),
    params.get("InvId"),
    params.get("SignatureValue")
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  return handleResult(
    searchParams.get("OutSum"),
    searchParams.get("InvId"),
    searchParams.get("SignatureValue")
  )
}
