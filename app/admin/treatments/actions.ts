"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type TreatmentPayload = {
  animal_id: number
  disease: string
  description: string
  goal_amount: number
  is_active: boolean
}

export async function createTreatment(payload: TreatmentPayload) {
  const { data, error } = await supabaseAdmin
    .from("treatments")
    .insert(payload)
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/treatments")
  revalidatePath("/treatments")
  redirect(`/admin/treatments/${data.id}`)
}

export async function updateTreatment(id: number, payload: TreatmentPayload) {
  const { error } = await supabaseAdmin
    .from("treatments")
    .update(payload)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/treatments")
  revalidatePath("/treatments")
  revalidatePath(`/treatments/${id}`)
}

export async function deleteTreatment(id: number) {
  const { error } = await supabaseAdmin.from("treatments").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/treatments")
  revalidatePath("/treatments")
  redirect("/admin/treatments")
}
