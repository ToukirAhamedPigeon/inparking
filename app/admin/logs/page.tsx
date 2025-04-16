'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import { EUserRole } from '@/types';
import Protected from '@/components/custom/Protected';

export default function Logs(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Logs"
        showTitle={true}
        items={[
          { label: 'Logs' },
        ]}
      />
      </div>
      </>
    );
};