// components/LogoutButton.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Cookies from 'js-cookie'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
export default function LogoutButton({ variant, className, children }: { variant: 'default' | 'outline' | 'ghost' | 'link', className?: string, children: React.ReactNode }) {
  const router = useRouter()
  const { setUser } = useAuth()
  const handleLogout = async () => {
    try {
      // Token is managed automatically by HttpOnly cookie
      await api.post('/auth/logout') // No need to pass token in the headers
      setUser(null)
      Cookies.remove('inparking_access_token') // Clear the cookie manually if needed
      localStorage.removeItem('authUser')
      // Redirect to signin page
     // router.push('/signin')
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
