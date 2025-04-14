'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import Nav from './Nav'

export default function SidebarMobileSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[radial-gradient(circle_at_bottom_left,_#fff1eb,_#d1fdff)]">
        <SheetHeader className="flex items-start justify-center bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] py-2 px-4">
          <SheetTitle>
            <Logo isTitle={true} className="" titleClassName="text-white" />
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <Nav/>
        </div>
      </SheetContent>
    </Sheet>
  )
}
