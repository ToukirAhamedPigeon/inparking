'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function Add(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Add Zone"
        showTitle={true}
        items={[
          { label: 'Zones', href: '/admin/zones/list' },
          { label: 'Add Zone' },
        ]}
      />
      </div>
    );
};