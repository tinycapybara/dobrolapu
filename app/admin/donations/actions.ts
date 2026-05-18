"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function toggleVisibility(id: string, current: boolean) {
  const { error } = await supabaseAdmin
    .from("donations")
    .update({ is_visible: !current })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/donations")
  revalidatePath("/donate")
}
