'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function List(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Zones"
        showTitle={true}
        items={[
          { label: 'Zones' },
        ]}
      />
      </div>
    );
};