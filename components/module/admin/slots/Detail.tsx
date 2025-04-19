'use client'

import { formatDateTime } from '@/lib/formatDate'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ISlot } from '@/types'
import Fancybox from '@/components/custom/FancyBox'

export default function Detail({ slot }: { slot: ISlot }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const slides = slot.images?.map(img => ({
    src: img.imageUrl,
    title: img.imageTitle,
    description: img.imageDetail,
  })) || []

  return (
    <div className="flex flex-col gap-6">
      {/* Slot Info Full Width */}
      <div className="space-y-4 w-full">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell><strong>Slot Number:</strong></TableCell>
              <TableCell>{slot.slotNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Slot Detail:</strong></TableCell>
              <TableCell>{slot.slotDetail}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Status:</strong></TableCell>
              <TableCell>{slot.isActive ? 'Active' : 'Inactive'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>QR String:</strong></TableCell>
              <TableCell>{slot.qrString}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created By:</strong></TableCell>
              <TableCell>{slot.createdBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created At:</strong></TableCell>
              <TableCell>{formatDateTime(slot.createdAt.toString())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated By:</strong></TableCell>
              <TableCell>{slot.updatedBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated At:</strong></TableCell>
              <TableCell>{formatDateTime(slot.updatedAt.toString())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Image Gallery Full Width */}
      {slides.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Slot Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {slot.images.map((img, index) => (
              <div
                key={img._id.toString()}
                className="rounded-xl overflow-hidden shadow-md border bg-white w-full"
              >
                <Fancybox
                  src={img.imageUrl}
                  alt={img.imageTitle || 'Slot Image'}
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
