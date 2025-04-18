'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import Protected from '@/components/custom/Protected';
import { EUserRole } from '@/types';
import AddZone from '@/components/module/admin/zones/AddZone';

export default function Add(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Add Zone"
        showTitle={true}
        items={[
          { label: 'Zones', href: '/admin/zones/list' },
          { label: 'Add Zone' },
        ]}
      />
      <div className='flex flex-col gap-4'>
          <AddZone />
        </div>
      </div>
      </>
    );
};