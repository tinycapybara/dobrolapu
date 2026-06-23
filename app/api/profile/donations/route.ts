import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error: dbError } = await supabaseAdmin
    .from("donations")
    .select("id, amount, comment, created_at, status, treatment_id, treatments(disease, animals!animal_id(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (dbError) {
    console.error("profile/donations error:", dbError)
    return Response.json({ error: "Server error" }, { status: 500 })
  }

  const donations = (data ?? []).map((d) => ({
    id: d.id,
    amount: d.amount,
    comment: d.comment,
    created_at: d.created_at,
    status: d.status,
    treatment_name: (d.treatments as unknown as { disease: string; animals: { name: string } | null } | null)?.animals?.name ?? null,
  }))

  const total = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0)

  return Response.json({ donations, total })
}
