'use client'

import { formatDateTime } from '@/lib/formatDate'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IZone } from '@/types'
import Fancybox from '@/components/custom/FancyBox'

export default function Detail({ zone }: { zone: IZone }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const slides = zone.images?.map(img => ({
    src: img.imageUrl,
    title: img.imageTitle,
    description: img.imageDetail,
  })) || []

  return (
    <div className="flex flex-col gap-6">
      {/* Zone Info Full Width */}
      <div className="space-y-4 w-full">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell><strong>Name:</strong></TableCell>
              <TableCell>{zone.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Address:</strong></TableCell>
              <TableCell>{zone.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Contact Name:</strong></TableCell>
              <TableCell>{zone.contactName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Contact No:</strong></TableCell>
              <TableCell>{zone.contactNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Latitude:</strong></TableCell>
              <TableCell>{zone.latitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Longitude:</strong></TableCell>
              <TableCell>{zone.longitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created By:</strong></TableCell>
              <TableCell>{zone.createdBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created At:</strong></TableCell>
              <TableCell>{formatDateTime(zone.createdAt.toString())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated By:</strong></TableCell>
              <TableCell>{zone.updatedBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated At:</strong></TableCell>
              <TableCell>{formatDateTime(zone.updatedAt.toString())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Image Gallery Full Width */}
      {slides.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Zone Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {zone.images.map((img, index) => (
              <div
                key={img._id.toString()}
                className="rounded-xl overflow-hidden shadow-md border bg-white w-full"
              >
                <Fancybox
                  src={img.imageUrl}
                  alt={img.imageTitle || 'Zone Image'}
                  className="w-full h-48"
                  onClick={() => setOpenIndex(index)}
                />
                <div className="p-3">
                  <h4 className="font-semibold text-base">{img.imageTitle || 'Untitled'}</h4>
                  <p className="text-sm text-muted-foreground">{img.imageDetail || 'No description'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Preview Grouped */}
      {openIndex !== null && (
        <Fancybox
          slides={slides}
          openIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          mode="group"
        />
      )}
    </div>
  )
}
