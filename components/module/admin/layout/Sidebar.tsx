'use client'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'
import Nav from './Nav'

export default function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed top-16 left-0 z-10 bg-[radial-gradient(circle_at_bottom_left,_#fff1eb,_#d1fdff)] border-r border-gray-200 transition-all duration-300 shadow-lg",
        isCollapsed ? "w-0" : "w-64",
        "h-[calc(100vh-4rem)] overflow-y-auto" // 4rem = 64px = navbar height
      )}
    >
      <Nav/>
    </aside>
  )
}
