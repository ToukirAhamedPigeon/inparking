'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export const useProtectedRoute = (allowedRoles?: string[]) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/signin')
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized') // custom 403 page
      }
    }
  }, [user, loading, allowedRoles, router])
}