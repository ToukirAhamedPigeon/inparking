'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function Add(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Add Slot"
        showTitle={true}
        items={[
          { label: 'Slots', href: '/admin/slots/list' },
          { label: 'Add Slot' },
        ]}
      />
      </div>
    );
};