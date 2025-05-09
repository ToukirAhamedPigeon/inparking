'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import { EUserRole } from '@/types';
import Protected from '@/components/custom/Protected';
import AllotmentList from '@/components/module/admin/allotments/List';
export default function List(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Allotments"
        showTitle={true}
        items={[
          { label: 'Allotments' },
        ]}
      />
      <AllotmentList />
      </div>
      </>
    );
};