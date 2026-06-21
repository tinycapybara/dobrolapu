import { supabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const MAX_SIZE = 10 * 1024 * 1024

export async function POST(req: Request) {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin_token")?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) return Response.json({ error: "Файл не найден" }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Допустимые форматы: JPG, PNG, WebP, PDF" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Файл слишком большой (макс. 10 МБ)" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(filename, arrayBuffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error("Storage upload error:", error)
    return Response.json({ error: `Ошибка загрузки: ${error.message}` }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("documents")
    .getPublicUrl(data.path)

  return Response.json({ url: publicUrl })
}
