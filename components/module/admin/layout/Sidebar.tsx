'use client'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed top-16 left-0 z-10 bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        "h-[calc(100vh-4rem)] overflow-y-auto" // 4rem = 64px = navbar height
      )}
    >
      <nav className="p-4 space-y-2">
        <div>🏠 Dashboard</div>
        <div>🚗 Parking</div>
        <div>👥 Users</div>
        <div>📦 Zones</div>
        <div>📍 Routes</div>
        <div>🖼️ Images</div>
      </nav>
    </aside>
  )
}
