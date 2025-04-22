'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { IAllotment, IImage } from '@/types';
import { formatDateTimeDisplay } from '@/lib/formatDate';
import RouteMapButtons from './RouteMapButtons';
import Image from 'next/image';
import ShowImageModal from './ShowImageModal';

export default function AllotmentSection({allotment, routeImages, zoneImages, slotImages}: {allotment: IAllotment, routeImages: IImage[], zoneImages: IImage[], slotImages: IImage[]}){
    console.log(allotment)
    console.log(routeImages)
    console.log(zoneImages)
    console.log(slotImages)
    return (
        <motion.div
          className="mt-10 w-full max-w-4xl bg-gradient-to-br from-blue-100 via-white to-blue-100 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <RouteMapButtons routeImages={routeImages} />
          <h2 className="text-xl font-bold text-center mt-6 mb-4 text-blue-700">Allotment Details</h2>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <tbody>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Zone</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.zoneId.name}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Slot</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.slotId.slotNumber}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">From</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{formatDateTimeDisplay(allotment.allotmentFrom.toString())}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">To</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{formatDateTimeDisplay(allotment.allotmentTo.toString())}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Guest</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.guestName}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Guest Phone</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.guestContactNo}</td>
                </tr>
                {allotment.guestDetail && allotment.guestDetail.trim().length > 0 && (
                    <tr>
                        <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">About Guest</td>
                        <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.guestDetail}</td>
                    </tr>
                )}
                {allotment.isOwnerDriver ? (
                    <tr>
                    <td colSpan={2} className="border px-2 py-1 text-xs lg:px-4 lg:py-2 text-center text-red-500 font-bold">*The guest will be driving.</td>
                    </tr>
                ) : (
                    <>
                    <tr>
                        <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Driver</td>
                        <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.driverName}</td>
                    </tr>
                    <tr>
                        <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Driver Phone</td>
                        <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.driverContactNo}</td>
                    </tr>
                </>
                )}
            </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-center mt-6 mb-4 text-blue-700">Zone Details</h2>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <tbody>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Zone</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.zoneId.name}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Address</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.zoneId.address}</td>
                </tr>
                {allotment.zoneId.contactName && allotment.zoneId.contactName.trim().length > 0 && (
                    <tr>
                        <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Contact</td>
                        <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.zoneId.contactName}</td>
                    </tr>
                )}
                {allotment.zoneId.contactNo && allotment.zoneId.contactNo.trim().length > 0 && (
                    <tr>
                        <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Contact No</td>
                        <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.zoneId.contactNo}</td>
                    </tr>
                )}
            </tbody>
            </table>
          </div>
          <ShowImageModal images={zoneImages} title="Zone Images" />
            
          <h2 className="text-xl font-bold text-center mt-6 mb-4 text-blue-700">Slot Details</h2>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <tbody>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Slot</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.slotId.slotNumber}</td>
                </tr>
                <tr>
                <td className="border px-2 py-1 text-sm font-medium w-[50px] md:w-[160px] lg:px-4 lg:py-2">Detail</td>
                <td className="border px-2 py-1 text-sm lg:px-4 lg:py-2">{allotment.slotId.slotDetail}</td>
                </tr>
            </tbody>
            </table>
          </div>
          <ShowImageModal images={slotImages} title="Slot Images" />
          <div className="flex justify-center mt-4">
                <Image src="/assets/bg_app.png" alt="Slot Image" width={400} height={400} className="h-40 w-auto md:h-[200px] md:w-auto" />
          </div>
        </motion.div>
    );
};