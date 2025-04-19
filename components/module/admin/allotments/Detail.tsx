'use client';

import { formatDateTime } from '@/lib/formatDate';
import Image from 'next/image';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function Detail({allotment}: {allotment: any}){
    return (
            <div className="flex flex-col lg:flex-row gap-6">
                {/* User Info */}
                <div className="flex-1 space-y-4">
                    <Table> 
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Slot:</strong></TableCell>
                                <TableCell>{allotment.slotId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Zone:</strong></TableCell>
                                <TableCell>{allotment.zoneId}</TableCell>
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
                                <TableCell><strong>Driver Name:</strong></TableCell>
                                <TableCell>{allotment.driverName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Driver Contact No:</strong></TableCell>
                                  <TableCell>{allotment.driverContactNo}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Is Owner Driver:</strong></TableCell>
                                <TableCell>{allotment.isOwnerDriver ? 'Yes' : 'No'}</TableCell>
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
                                <TableCell><strong>QR String:</strong></TableCell>
                                <TableCell>{allotment.qrString}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Date Time Format:</strong></TableCell>
                                <TableCell>{allotment.dateTimeFormatId}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
    );
};