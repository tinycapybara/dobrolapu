import { supabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin_token")?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) return Response.json({ error: "Файл не найден" }, { status: 400 })
  if (!file.type.startsWith("image/")) return Response.json({ error: "Только изображения" }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: "Файл слишком большой (макс. 5 МБ)" }, { status: 400 })

  const ext = file.name.split(".").pop() ?? "jpg"
  const filename = `animals/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from("photos")
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (error) {
    console.error("Storage upload error:", error)
    return Response.json({ error: "Ошибка загрузки" }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("photos")
    .getPublicUrl(data.path)

  return Response.json({ url: publicUrl })
}
