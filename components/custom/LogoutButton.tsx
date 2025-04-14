// components/LogoutButton.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export default function LogoutButton({ variant, className, children }: { variant: 'default' | 'outline' | 'ghost' | 'link', className?: string, children: React.ReactNode }) {
  const { setUser } = useAuth()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      if (setUser) setUser(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <Button variant={variant} onClick={handleLogout} className={cn(className,'')}>
      {children}
    </Button>
  )
}
