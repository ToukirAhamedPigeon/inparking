'use client'

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QrScannerProps {
  onScan: (value: string) => void
}

const QrScanner = ({ onScan }: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrRegionId = "qr-reader"

  useEffect(() => {
    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras()
        const backCamera =
          devices.find(device =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment")
          ) || devices[0]

        const scanner = new Html5Qrcode(qrRegionId)
        scannerRef.current = scanner

        await scanner.start(
          backCamera.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText)
            scanner.stop()
          },
          (errorMessage) => {
            // console.log("Scan error:", errorMessage)
          }
        )
      } catch (error) {
        console.error("Camera error:", error)
      }
    }

    startScanner()

    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [onScan])

  return (
    <div id={qrRegionId} className="w-full max-w-md h-64 rounded-xl shadow-xl" />
  )
}

export default QrScanner
