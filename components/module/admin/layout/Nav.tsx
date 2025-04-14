'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const menuItems = [
  { label: 'Dashboard', icon: '🏠', basePath: '/admin/dashboard', children: [] },
  {
    label: 'Zones', icon: '📍', basePath: '/admin/zones', children: [
      { label: 'List', basePath: '/admin/zones/list' },
      { label: 'Add', basePath: '/admin/zones/add' },
    ]
  },
  {
    label: 'Slots', icon: '🅿️', basePath: '/admin/slots', children: [
      { label: 'List', basePath: '/admin/slots/list' },
      { label: 'Add', basePath: '/admin/slots/add' },
    ]
  },
  {
    label: 'Allotments', icon: '📋', basePath: '/admin/allotments', children: [
      { label: 'List', basePath: '/admin/allotments/list' },
      { label: 'Add', basePath: '/admin/allotments/add' },
    ]
  },
  {
    label: 'Users', icon: '👥', basePath: '/admin/users', children: [
      { label: 'List', basePath: '/admin/users/list' },
      { label: 'Register', basePath: '/admin/users/register' },
    ]
  },
  {
    label: 'Logs', icon: '📝', basePath: '/admin/logs', children: []
  }
];

export default function Nav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const isActiveMenu = (basePath: string) => pathname?.startsWith(basePath);
  const isActiveSubmenu = (path: string) => pathname === path;

  return (
    <nav className="space-y-0 py-6 text-gray-600">
      {menuItems.map(({ label, icon, basePath, children }) => {
        const alwaysOpen = isActiveMenu(basePath);
        const isOpen = openMenus.includes(label) || alwaysOpen;

        return (
          <div key={label}>
            {children?.length > 0 ? <button
              className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white/60 hover:bg-white/80 border-b border-white transition-all 
                ${alwaysOpen ? 'main-gradient text-white font-semibold' : ''}`}
              onClick={() => toggleMenu(label)}
            >
              <span>{icon} {label}</span>
              {children?.length > 0 &&
                <span>{isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>}
            </button> : <Link
              href={basePath}
              onClick={onLinkClick}
              className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white/60 hover:bg-white/80 border-b border-white transition-all 
                ${alwaysOpen ? 'main-gradient text-white font-semibold' : ''}`}
            >
              <span>{icon} {label}</span>
            </Link>}

            <AnimatePresence initial={false}>
              {isOpen && children?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="ml-6 overflow-hidden"
                >
                  {children.map(({ label: subLabel, basePath: subPath }) => (
                    <Link
                      key={subLabel}
                      href={subPath}
                      onClick={onLinkClick}
                      className={`block px-4 py-2 bg-white/20 hover:bg-white/50 border-b border-white transition-all 
                        ${isActiveSubmenu(subPath) ? 'bg-blue-200 hover:bg-blue-300 text-blue-600 font-semibold' : ''}`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <ChevronRight className="w-4 h-4" /> {subLabel}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
