'use client'

import React, { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'

type QRWithLogoProps = {
  value: string
  logoSrc: string
  size?: number
}

export default function QRCodePopup({
  value,
  logoSrc,
  size = 100,
}: QRWithLogoProps) {
  const [open, setOpen] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!qrRef.current) return
    const qrContent = qrRef.current.innerHTML
    const printWindow = window.open('', '', 'width=800,height=800')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          ${qrContent}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const qrSize = size
  const logoSize = qrSize * 0.2

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div style={{ position: 'relative', width: qrSize, height: qrSize }}>
          <QRCodeCanvas
            value={value}
            size={qrSize}
            level="H"
            includeMargin
          />
          <Image
            src={logoSrc}
            alt="Logo"
            width={logoSize}
            height={logoSize}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '9999px',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <div ref={qrRef}>
              <div
                style={{ position: 'relative', width: 300, height: 300 }}
              >
                <QRCodeCanvas
                  value={value}
                  size={300}
                  level="H"
                  includeMargin
                />
                <Image
                  src={logoSrc}
                  alt="Logo"
                  width={60}
                  height={60}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '9999px',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handlePrint}
            >
              Print QR Code
            </button>
            <button
              className="mt-2 text-sm text-gray-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
