'use client';

import React from 'react';
import Logo from './Logo';
import UserDropdown from './UserDropdown';
import SidebarMobileSheet from './SidebarMobileSheet';
import { useSidebar } from '@/contexts/SidebarContext';
import { Menu } from 'lucide-react';
import { adminLayoutUserProps } from '@/types'

type Props = {
    user: adminLayoutUserProps
}

export default function Header({ user }: Props){
    function ToggleSidebarButton() {
        const { toggleCollapse } = useSidebar()
        return (
          <button onClick={toggleCollapse}>
            <Menu className="h-8 w-8 text-white" />
          </button>
        )
      }
    return (
        <nav className="w-full flex items-center justify-between pl-4 py-0 fixed top-0 z-20 shadow-md bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] text-white h-16">
            <div className="flex items-center gap-2 py-4">
                <SidebarMobileSheet />
                <div className="hidden lg:flex items-center gap-2">
                <ToggleSidebarButton />
                <Logo isTitle titleClassName="text-white" />
                </div>
            </div>
            <Logo isTitle={false} className="lg:hidden py-4" />
            <div className="flex items-center gap-2 h-full px-4 bg-white/30 backdrop-blur-sm">
                <UserDropdown user={user} />
            </div>
        </nav>
    );
};