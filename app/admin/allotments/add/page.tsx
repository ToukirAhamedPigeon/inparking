'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import { EUserRole } from '@/types';
import Protected from '@/components/custom/Protected';
export default function Add(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
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
      </>
    );
};