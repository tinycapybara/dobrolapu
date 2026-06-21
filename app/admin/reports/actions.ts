"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

type ReportPayload = {
  title: string
  period: string | null
  amount: number | null
  description: string | null
  document_url: string | null
  is_visible: boolean
}

export async function createReport(payload: ReportPayload) {
  const { error } = await supabaseAdmin.from("reports").insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/reports")
  revalidatePath("/reports")
}

export async function deleteReport(id: number) {
  const { error } = await supabaseAdmin.from("reports").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/reports")
  revalidatePath("/reports")
}

export async function toggleVisibility(id: number, isVisible: boolean) {
  const { error } = await supabaseAdmin
    .from("reports")
    .update({ is_visible: isVisible })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/reports")
  revalidatePath("/reports")
}
