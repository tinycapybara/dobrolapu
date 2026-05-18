import { AdminSidebar } from "./admin-sidebar"
import { AdminMobileHeader } from "./admin-mobile-header"

export const metadata = {
  title: "Панель управления | Добрые лапки",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FDF8F9]">
      {/* Десктоп — фиксированный сайдбар */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Мобильный и планшетный хедер */}
        <div className="lg:hidden">
          <AdminMobileHeader />
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
