'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import Protected from '@/components/custom/Protected';
import { EUserRole } from '@/types';

export default function Add(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
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
      </>
    );
};