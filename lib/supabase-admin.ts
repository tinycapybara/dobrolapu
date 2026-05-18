import { createClient } from "@supabase/supabase-js"

// Используется только на сервере (API routes) — никогда не попадает в браузер
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
