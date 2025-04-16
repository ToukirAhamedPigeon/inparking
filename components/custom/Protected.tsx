'use client'

import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function Protected({ roles }: { roles?: string[] }) {
  useProtectedRoute(roles)
  return null
}