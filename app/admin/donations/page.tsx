import { supabaseAdmin } from "@/lib/supabase-admin"
import { DonationsTable } from "./donations-table"

export const dynamic = "force-dynamic"

type Donation = {
  id: string
  donor_name: string | null
  amount: number
  comment: string | null
  status: string
  paid_at: string | null
  created_at: string
  is_visible: boolean
}

async function getDonations(): Promise<Donation[]> {
  const { data, error } = await supabaseAdmin
    .from("donations")
    .select("id, donor_name, amount, comment, status, paid_at, created_at, is_visible")
    .order("created_at", { ascending: false })

  if (error) { console.error(error); return [] }
  return (data ?? []) as Donation[]
}

export default async function AdminDonationsPage() {
  const donations = await getDonations()
  const total = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0)

  return <DonationsTable donations={donations} total={total} />
}
