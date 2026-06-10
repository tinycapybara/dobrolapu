import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("full_name, phone")
    .eq("id", user.id)
    .single()

  return Response.json({
    email: user.email ?? null,
    full_name: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
  })
}
