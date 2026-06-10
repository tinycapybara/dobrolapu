import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const itemId = Number(id)
  if (!itemId) return Response.json({ error: "Invalid id" }, { status: 400 })

  const { completed } = await req.json()

  // Проверяем, что этот пункт принадлежит текущему пользователю
  const { data: item } = await supabaseAdmin
    .from("adoption_checklist")
    .select("user_id")
    .eq("id", itemId)
    .single()

  if (!item || item.user_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error: updateError } = await supabaseAdmin
    .from("adoption_checklist")
    .update({ completed: Boolean(completed) })
    .eq("id", itemId)

  if (updateError) {
    console.error("checklist update error:", updateError)
    return Response.json({ error: "Server error" }, { status: 500 })
  }

  return Response.json({ ok: true })
}
