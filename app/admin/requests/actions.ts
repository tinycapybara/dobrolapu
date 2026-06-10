"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

const CHECKLIST_ITEMS = [
  "Миска для еды",
  "Миска для воды",
  "Лежанка",
  "Переноска",
  "Ошейник или шлейка",
  "Поводок",
  "Запас корма на первое время",
  "Средства гигиены",
  "Игрушка для адаптации",
  "Щётка для шерсти",
  "Лоток (для кошек)",
  "Наполнитель (для кошек)",
  "Когтеточка (для кошек)",
  "Безопасное место для отдыха",
  "Проверка квартиры на потенциально опасные предметы",
  "Запись к ветеринару для первичного осмотра",
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
