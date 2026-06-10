import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error: dbError } = await supabaseAdmin
    .from("adoption_requests")
    .select("id, animal_name, type, created_at, status_id, request_statuses(status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (dbError) {
    console.error("profile/requests error:", dbError)
    return Response.json({ error: "Server error" }, { status: 500 })
  }

  const requests = (data ?? []).map((r) => ({
    id: r.id,
    animal_name: r.animal_name,
    type: r.type,
    created_at: r.created_at,
    status_id: r.status_id,
    status: (r.request_statuses as unknown as { status: string } | null)?.status ?? "—",
  }))

  const hasApproved = requests.some((r) => r.status_id === 2)

  return Response.json({ requests, hasApproved })
}
