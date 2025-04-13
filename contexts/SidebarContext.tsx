'use client'
import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext({ isCollapsed: false, toggleCollapse: () => {} })

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleCollapse = () => setIsCollapsed(prev => !prev)

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
