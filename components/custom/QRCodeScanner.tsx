'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'

export default function QRCodeScanner() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scannerRef.current || scannedResult) return

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: false,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    },false)

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText)
        scanner.clear()
      },
      (error) => {
        // console.warn('QR Code Scan Error:', error)
      }
    )
  }, [scannedResult])

  return (
    <div className="w-full">
      {!scannedResult ? (
        <div id="qr-reader" ref={scannerRef} className="w-full h-60 rounded-md bg-gray-200"></div>
      ) : (
        <div className="text-center text-green-700 font-semibold text-lg mt-4">
          ✅ QR Code Scanned: {scannedResult}
        </div>
      )}
    </div>
  )
}
