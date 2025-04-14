import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function Register(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Register"
        showTitle={true}
        items={[
          { label: 'Users', href: '/admin/users/list' },
          { label: 'Register' },
        ]}
      />
      </div>
    );
};