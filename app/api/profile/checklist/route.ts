import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error: dbError } = await supabaseAdmin
    .from("adoption_checklist")
    .select("id, item_name, completed")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (dbError) {
    console.error("profile/checklist error:", dbError)
    return Response.json({ error: "Server error" }, { status: 500 })
  }

  return Response.json({ checklist: data ?? [] })
}
