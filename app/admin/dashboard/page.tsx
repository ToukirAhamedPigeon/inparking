// app/admin/page.tsx
'use client'

import LogoutButton from '@/components/custom/LogoutButton'
import Breadcrumb from '@/components/module/admin/layout/Breadcrumb'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className='flex flex-col gap-4'>
    <Breadcrumb
        title="Dashboard"
        showTitle={true}
        items={[
          // Current page (no href)
        ]}
      />
    </div>
  )
}
