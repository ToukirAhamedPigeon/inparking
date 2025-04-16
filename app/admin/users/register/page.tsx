import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import Register from '@/components/module/admin/Users/Register';
import React from 'react';

export default function Page(){
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
        <div className='flex flex-col gap-4'>
          <Register />
        </div>
      </div>
    );
};