'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import Protected from '@/components/custom/Protected';
import { EUserRole } from '@/types';
import ZoneListTable from '@/components/module/admin/zones/List';


export default function List(){
      return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Zones"
        showTitle={true}
        items={[
          { label: 'Zones' },
        ]}
      />
      <div className='flex flex-col gap-4'>
          <ZoneListTable />
        </div>
      </div>
      </>
    );
};