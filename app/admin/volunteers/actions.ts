"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function toggleProcessed(id: number, current: boolean) {
  const { error } = await supabaseAdmin
    .from("volunteer_requests")
    .update({ is_processed: !current })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/volunteers")
  revalidatePath("/admin")
}
