import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { amount } = await req.json();

  const mrh_login = process.env.ROBOKASSA_LOGIN!;
  const mrh_pass1 = process.env.ROBOKASSA_PASS1!;

  const outSum = amount;
  const invId = Math.floor(Math.random() * 1000000);

  const signature = crypto
    .createHash("md5")
    .update(`${mrh_login}:${outSum}:${invId}:${mrh_pass1}`)
    .digest("hex");

  const url = `https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${mrh_login}&OutSum=${outSum}&InvId=${invId}&Description=Donation&SignatureValue=${signature}&IsTest=1`;

  return NextResponse.json({ url });
}