import { AdminSidebar } from "./admin-sidebar"
import { AdminMobileHeader } from "./admin-mobile-header"

export const metadata = {
  title: "Панель управления | Добрые лапки",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FDF8F9]">
      {/* Десктоп — прилипающий сайдбар */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Мобильный и планшетный хедер */}
        <div className="lg:hidden shrink-0">
          <AdminMobileHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
