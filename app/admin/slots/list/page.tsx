'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function List(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Slots"
        showTitle={true}
        items={[
          { label: 'Slots' },
        ]}
      />
      </div>
    );
};