'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
export default function Logo({isTitle, className, titleClassName}: {isTitle: boolean, className?: string, titleClassName?: string}){
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Image src="/icons/icon-192x192.png" alt="Logo" width={32} height={32}  />
            {isTitle && <span className={cn("text-lg font-semibold", titleClassName)}>In Parking</span>}
        </div>
    );
};