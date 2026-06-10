"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

const CHECKLIST_ITEMS = [
  "Подготовьте место для питомца (лежанка, миска, туалет)",
  "Приобретите всё необходимое (корм, поводок, игрушки)",
  "Запишитесь на первичный приём к ветеринару",
  "Ознакомьтесь с правилами ухода за питомцем",
  "Подготовьте документы для передачи",
  "Согласуйте дату и время визита в приют",
]

export async function updateRequestStatus(id: number, statusId: number, userId: string | null) {
  const { error } = await supabaseAdmin
    .from("adoption_requests")
    .update({ status_id: statusId })
    .eq("id", id)

  if (error) throw new Error(error.message)

  // При одобрении заявки создаём чек-лист для пользователя (если он авторизован и чек-листа ещё нет)
  if (statusId === 2 && userId) {
    const { count } = await supabaseAdmin
      .from("adoption_checklist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (count === 0) {
      const items = CHECKLIST_ITEMS.map((item_name) => ({
        user_id: userId,
        item_name,
        completed: false,
      }))
      await supabaseAdmin.from("adoption_checklist").insert(items)
    }
  }

  revalidatePath("/admin/requests")
  revalidatePath("/admin")
}
