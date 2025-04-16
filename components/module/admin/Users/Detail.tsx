'use client';

import { formatDateTime } from '@/lib/formatDate';
import Image from 'next/image';
import React from 'react';

export default function Detail({user}: {user: any}){
    return (
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 w-full flex justify-center items-center">
                    <Image
                        src={user.profilePictureUrl}
                        alt="Profile"
                        className="object-cover rounded-xl border-2 border-white"
                        width={200}
                        height={200}
                    />
                    </div>
                {/* User Info */}
                <div className="flex-1 space-y-4">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {<span className='capitalize'>{user.role}</span>}</p>
                    <p><strong>Status:</strong> {user.isActive ? <span className='text-green-500 font-bold'>Active</span> : <span className='text-red-500 font-bold'>Inactive</span>}</p>
                    <p><strong>Created At:</strong> {formatDateTime(user.createdAt)}</p>
                    <p><strong>Updated At:</strong> {formatDateTime(user.updatedAt)}</p>
                </div>
            </div>
    );
};