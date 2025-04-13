'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'

export default function SidebarMobileSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 px-8">
        <SheetHeader className="flex items-start justify-center border-b border-gray-200">
          <SheetTitle>
            <Logo isTitle={true} className="py-4" />
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-6 py-14">
          <div>🏠 Dashboard</div>
          <div>🚗 Parking</div>
          <div>👥 Users</div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
