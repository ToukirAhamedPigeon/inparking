'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function Add(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Add Allotment"
        showTitle={true}
        items={[
          { label: 'Allotments', href: '/admin/allotments/list' },
          { label: 'Add Allotment' },
        ]}
      />
      </div>
    );
};