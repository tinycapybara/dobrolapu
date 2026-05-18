import { AdminSidebar } from "./admin-sidebar"

export const metadata = {
  title: "Панель управления | Добрые лапки",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FDF8F9]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
