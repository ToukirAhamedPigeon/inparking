'use client';

import { formatDateTime } from '@/lib/formatDate';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import ChangeSnapshot from './ChangeSnapShot';
import ChangeDiffTable from './ChangeSnapShot';

export default function Detail({log}: {log: any}){
    console.log(log)
    return (
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Log Info */}
                <div className="flex-1 space-y-4">
                    <Table> 
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Detail:</strong></TableCell>
                                <TableCell>{log.detail}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Action Type:</strong></TableCell>
                                <TableCell>{<span className='capitalize'>{log.actionType}</span>}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Collection Name:</strong></TableCell>
                                <TableCell>{log.collectionName}</TableCell>
                            </TableRow>  
                            <TableRow>
                                <TableCell><strong>Object:</strong></TableCell>
                                <TableCell>{log.relatedObjectName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Created By:</strong></TableCell>
                                <TableCell>{log.createdBy.name}</TableCell>
                            </TableRow>   
                            <TableRow>
                                <TableCell><strong>Created At:</strong></TableCell>
                                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Changes:</strong></TableCell>
                                <TableCell>
                                    <ChangeDiffTable changesJson={log.changes} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
    );
};