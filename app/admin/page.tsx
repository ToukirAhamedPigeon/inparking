// app/admin/page.tsx
'use client'

import LogoutButton from '@/components/custom/LogoutButton'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || 'Admin'}!</h1>
      <LogoutButton variant="outline" className="mt-4 bg-red-500 text-white">Logout</LogoutButton>
    </div>
  )
}
