'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '@/components/module/admin/layout/Sidebar'
import SidebarMobileSheet from '@/components/module/admin/layout/SidebarMobileSheet'
import { Menu } from 'lucide-react'
import { redirect } from 'next/navigation'
import Footer from '@/components/custom/Footer'
import Logo from '@/components/module/admin/layout/Logo'
import UserDropdown from '@/components/module/admin/layout/UserDropdown'
import FullPageLoader from '@/components/custom/FullPageLoader'
import { useSidebar } from '@/contexts/SidebarContext'

export default function AdminNavbarLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) redirect('/signin')

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <nav className="w-full flex items-center justify-between p-4 border-b bg-white fixed top-0 z-20">
          <div className="flex items-center gap-2">
            <SidebarMobileSheet />
            <div className="hidden lg:flex items-center gap-2">
              <ToggleSidebarButton />
              <Logo isTitle />
            </div>
          </div>
          <Logo isTitle={false} className="lg:hidden" />
          <UserDropdown user={user} />
        </nav>

        {/* Layout Body */}
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-grow ml-0 lg:ml-64 transition-all duration-300"
    style={{ minHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
            {children}
          </main>
        </div>

        <Footer footerClasses="bottom-0 w-full py-1 text-center md:text-right px-4 text-xs text-gray-600 bg-white border-t border-gray-200 overflow-hidden" linkClasses="text-red-600 hover:underline" />
      </div>
    </SidebarProvider>
  )
}

function ToggleSidebarButton() {
  const { toggleCollapse } = useSidebar()
  return (
    <button onClick={toggleCollapse}>
      <Menu className="h-8 w-8 text-gray-900" />
    </button>
  )
}
