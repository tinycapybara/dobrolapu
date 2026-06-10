"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

const BASE_ITEMS = [
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
  "Безопасное место для отдыха",
  "Проверка квартиры на потенциально опасные предметы",
  "Запись к ветеринару для первичного осмотра",
]

const CAT_ITEMS = [
  "Лоток",
  "Наполнитель",
  "Когтеточка",
]

export async function updateRequestStatus(id: number, statusId: number, userId: string | null) {
  const { error } = await supabaseAdmin
    .from("adoption_requests")
    .update({ status_id: statusId })
    .eq("id", id)

  if (error) throw new Error(error.message)

  // При одобрении создаём чек-лист для пользователя (если авторизован и чек-листа ещё нет)
  if (statusId === 2 && userId) {
    const { count } = await supabaseAdmin
      .from("adoption_checklist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (count === 0) {
      // Определяем тип животного по заявке
      const { data: request } = await supabaseAdmin
        .from("adoption_requests")
        .select("animal_id, animals(animal_types(type))")
        .eq("id", id)
        .single()

      const animalType: string =
        (request?.animals as { animal_types: { type: string } } | null)?.animal_types?.type ?? ""
      const isCat = animalType.toLowerCase().includes("кошк") || animalType.toLowerCase().includes("кот")

      const itemNames = isCat ? [...BASE_ITEMS, ...CAT_ITEMS] : BASE_ITEMS
      const items = itemNames.map((item_name) => ({
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
