'use client';

import { formatDateTime } from '@/lib/formatDate';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import SlotDetail from '../slots/SlotDetail';
import { ISlot } from '@/types';

export default function AllotmentDetail({allotment}: {allotment: any}){
    console.log(allotment);
    return (
            <div className="flex flex-col gap-6">
                {/* User Info */}
                <div className="flex-1 space-y-4">
                    <Table> 
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Zone:</strong></TableCell>
                                <TableCell>{allotment.zoneId.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Slot:</strong></TableCell>
                                <TableCell>{allotment.slotId.slotNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Allotment From:</strong></TableCell>
                                <TableCell>{formatDateTime(allotment.allotmentFrom)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Allotment To:</strong></TableCell>
                                <TableCell>{formatDateTime(allotment.allotmentTo)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Guest Name:</strong></TableCell>
                                <TableCell>{allotment.guestName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Guest Contact No:</strong></TableCell>
                                <TableCell>{allotment.guestContactNo}</TableCell>
                            </TableRow>   
                            <TableRow>
                                <TableCell><strong>Guest Detail:</strong></TableCell>
                                <TableCell>{allotment.guestDetail}</TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell><strong>Is Owner Driver:</strong></TableCell>
                                <TableCell>{allotment.isOwnerDriver ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                            {!allotment.isOwnerDriver && (<>
                            <TableRow>
                                <TableCell><strong>Driver Name:</strong></TableCell>
                                <TableCell>{allotment.driverName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Driver Contact No:</strong></TableCell>
                                <TableCell>{allotment.driverContactNo}</TableCell>
                            </TableRow>
                            </>)}
                            <TableRow>
                                <TableCell><strong>Created By:</strong></TableCell>
                                <TableCell>{allotment.createdBy.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Updated By:</strong></TableCell>
                                <TableCell>{allotment.updatedBy.name}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                {/* <div className="flex-1 space-y-4">
                    <h1 className='text-2xl text-gray-700'>Slot Detail</h1>
                    <SlotDetail slot={allotment.slotId as ISlot} />
                </div> */}
            </div>
    );
};