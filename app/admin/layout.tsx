'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '@/components/module/admin/layout/Sidebar'

import { redirect } from 'next/navigation'
import Footer from '@/components/custom/Footer'

import FullPageLoader from '@/components/custom/FullPageLoader'
import Header from '@/components/module/admin/layout/Header'
import Main from '@/components/module/admin/layout/Main'
import RouteProgress from '@/components/module/admin/layout/RouteProgress'
import { Toaster } from 'sonner'

export default function AdminNavbarLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) {
    redirect('/signin')
  }

  return (
    <SidebarProvider>
      <RouteProgress color="#ffffff" />
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header user={user} />

        {/* Layout Body */}
        <div className="flex pt-16">
          <Sidebar />
          <Main>
            {children}
          </Main>
        </div>

        <Footer
        footerClasses="w-full py-1 text-center px-4 text-xs text-gray-600 bg-transparent border-t border-gray-200 overflow-hidden flex justify-center md:justify-end"
        linkClasses="text-red-600 hover:underline"
        showVersion={true}
      />
      <Toaster richColors position="top-right" />
      </div>
    </SidebarProvider>
  )
}
