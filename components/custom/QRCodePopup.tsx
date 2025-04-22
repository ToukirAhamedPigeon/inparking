'use client'

import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
type QRCodePopupProps = {
  value: string
  logoSrc: string
  size?: number
  expiry?: string
  guestName?: string
  siteUrl?: string
}

export default function QRCodePopup({
  value,
  logoSrc,
  size = 150,
  expiry,
  guestName,
  siteUrl,
}: QRCodePopupProps) {
  const [open, setOpen] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [popupQrDataUrl, setPopupQrDataUrl] = useState<string | null>(null)
  // Generate QR image with logo merged in canvas
  const generateQRWithLogo = async (
    value: string,
    logo: string,
    size: number
  ): Promise<string> => {
    const qrData = await QRCode.toDataURL(process.env.NEXT_PUBLIC_APP_URL + '?qrid=' +value, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: size,
    })
  
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const qrImg = new Image()
      const logoImg = new Image()
  
      qrImg.crossOrigin = 'anonymous'
      logoImg.crossOrigin = 'anonymous'
  
      qrImg.src = qrData
      logoImg.src = logo
  
      let isResolved = false
  
      qrImg.onload = () => {
        canvas.width = size
        canvas.height = size
        ctx?.drawImage(qrImg, 0, 0, size, size)
  
        logoImg.onload = () => {
          const logoSize = size * 0.2
          const x = (size - logoSize) / 2
          const y = (size - logoSize) / 2
  
          ctx?.beginPath()
          ctx?.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, 2 * Math.PI)
          ctx?.clip()
          ctx?.drawImage(logoImg, x, y, logoSize, logoSize)
  
          if (!isResolved) {
            isResolved = true
            resolve(canvas.toDataURL())
          }
        }
  
        logoImg.onerror = () => {
          // fallback to QR only
          if (!isResolved) {
            isResolved = true
            resolve(qrData)
          }
        }
      }
  
      qrImg.onerror = () => {
        // fallback entirely
        if (!isResolved) {
          isResolved = true
          resolve(qrData)
        }
      }
    })
  }

  useEffect(() => {
    setPopupQrDataUrl(null)
    generateQRWithLogo(value, logoSrc, size).then(setQrDataUrl)
  }, [value, logoSrc, size])

  // useEffect(() => {
  //   if (open) {
  //     generateQRWithLogo(value, logoSrc, 300).then(setPopupQrDataUrl)
  //   }
  // }, [open, value, logoSrc])

  useEffect(() => {
    setQrDataUrl(null)
    setPopupQrDataUrl(null)
  
    generateQRWithLogo(value, logoSrc, size).then(setQrDataUrl)
    generateQRWithLogo(value, logoSrc, 300).then(setPopupQrDataUrl)
  }, [value, logoSrc, size])

  const handlePrint = () => {
    if (!popupQrDataUrl) return

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
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; width: 100%;">
            <img src="${popupQrDataUrl}" style="width: 300px; height: 300px;" /> 
          </div>
          <div style="text-align: center; width: 100%;">
            <p style="text-align:center; font-size: 20px; font-weight: bold;"><span style="font-weight: medium;">QR Code Number:</span> ${value}</p>
            ${expiry && `<p style="text-align:center; font-size: 12px; font-weight: bold;"><span style="font-weight: medium;">QR Code Expiry:</span> <span style="font-size: 12px;">${expiry}</span></p>`}
            ${guestName && `<p style="text-align:center; font-size: 12px; font-weight: bold;"><span style="font-weight: medium;">Guest:</span> <span style="font-size: 12px;">${guestName}</span> </p>`}
            ${siteUrl && `<p style="text-align:center; font-size: 12px; font-weight: bold;"><span style="font-weight: medium;">Site:</span> <span style="font-size: 12px;">${siteUrl}</span></p>`}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return (
    
    <>
      {/* Thumbnail QR in List */}
      <div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {qrDataUrl && (
          <NextImage
            src={qrDataUrl}
            alt="QR Code"
            width={size}
            height={size}
            style={{ display: 'block' }}
          />
        )}
      </div>

      {/* Modal QR */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {popupQrDataUrl && (
                <NextImage
                  src={popupQrDataUrl}
                  alt="Popup QR"
                  width={300}
                  height={300}
                />
              )}
              <p className='text-center font-bold mt-4'>
                <span className='font-medium'>QR Code Number:</span> {value}
                
                {expiry && <><br /><span className='font-medium text-[12px]'>QR Code Expiry:</span> <span className='text-[12px]'>{expiry}</span></>}
                {guestName && <><br /><span className='font-medium text-[12px]'>Guest:</span> <span className='text-[12px]'>{guestName}</span></>}
                {siteUrl && <><br /><span className='font-medium text-[12px]'>Site:</span> <span className='text-[12px]'>{siteUrl}</span></>}
              </p>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}