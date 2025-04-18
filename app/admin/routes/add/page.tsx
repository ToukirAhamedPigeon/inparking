'use client';

import Breadcrumb from '@/components/module/admin/layout/Breadcrumb';
import React from 'react';
import Protected from '@/components/custom/Protected';
import { EUserRole } from '@/types';
import AddRoute from '@/components/module/admin/routes/AddRoute';

export default function Add(){
    return (
        <>
        <Protected roles={[EUserRole.ADMIN, EUserRole.DEVELOPER]} />
        <div className='flex flex-col gap-4'>
        <Breadcrumb
        title="Add Route"
        showTitle={true}
        items={[
          { label: 'Routes', href: '/admin/routes/list' },
          { label: 'Add Route' },
        ]}
      />
      <AddRoute />
      </div>
      </>
    );
};