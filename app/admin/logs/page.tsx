'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';

export default function Logs(){
    return (
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Logs"
        showTitle={true}
        items={[
          { label: 'Logs' },
        ]}
      />
      </div>
    );
};