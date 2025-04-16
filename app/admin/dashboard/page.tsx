// app/admin/page.tsx

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb'
import Protected from '@/components/custom/Protected'
import { EUserRole } from '@/types';


export default function AdminDashboard() {
  return (
    <>
    <Protected roles={[EUserRole.ADMIN, EUserRole.USER, EUserRole.DEVELOPER]} />
    <div className='flex flex-col gap-4'>
      <Breadcrumb
          title="Dashboard"
          showTitle={true}
          items={[
            // Current page (no href)
          ]}
        />
      </div>
    </>
    
  )
}
