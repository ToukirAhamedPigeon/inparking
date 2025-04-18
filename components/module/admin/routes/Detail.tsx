'use client'

import { formatDateTime } from '@/lib/formatDate'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IRoute } from '@/types'
import Fancybox from '@/components/custom/FancyBox'

export default function Detail({ route }: { route: IRoute }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const slides = route.images?.map(img => ({
    src: img.imageUrl,
    title: img.imageTitle,
    description: img.imageDetail,
  })) || []

  return (
    <div className="flex flex-col gap-6">
      {/* Route Info Full Width */}
      <div className="space-y-4 w-full">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell><strong>From Address:</strong></TableCell>
              <TableCell>{route.fromAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>To Address:</strong></TableCell>
              <TableCell>{route.toAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>To Zone:</strong></TableCell>
              <TableCell>{route.toZoneId.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Description:</strong></TableCell>
              <TableCell>{route.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Status:</strong></TableCell>
              <TableCell>{route.isActive ? 'Active' : 'Inactive'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created By:</strong></TableCell>
              <TableCell>{route.createdBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created At:</strong></TableCell>
              <TableCell>{formatDateTime(route.createdAt.toString())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated By:</strong></TableCell>
              <TableCell>{route.updatedBy.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Updated At:</strong></TableCell>
              <TableCell>{formatDateTime(route.updatedAt.toString())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Image Gallery Full Width */}
      {slides.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Route Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {route.images.map((img, index) => (
              <div
                key={img._id.toString()}
                className="rounded-xl overflow-hidden shadow-md border bg-white w-full"
              >
                <Fancybox
                  src={img.imageUrl}
                  alt={img.imageTitle || 'Route Image'}
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
