'use client'

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QrScannerProps {
  onScan: (value: string) => void
}

const QrScanner = ({ onScan }: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrRegionId = "qr-reader"
  const isScanningRef = useRef(false)
  const qrRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras()
        console.log("Available cameras:", devices)

        const backCamera =
          devices.find(device =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment")
          ) || devices[0]

        console.log("Using camera:", backCamera)

        if (!backCamera) throw new Error("No camera found")

        const scanner = new Html5Qrcode(qrRegionId)
        scannerRef.current = scanner
        isScanningRef.current = true

        await scanner.start(
          backCamera.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (isScanningRef.current) {
              isScanningRef.current = false
              onScan(decodedText)
              await scanner.stop()
              await scanner.clear()
            }
          },
          (errorMessage) => {
            console.error("Scanning error:", errorMessage)
          }
        )
      } catch (error) {
        console.error("Camera error:", error)
      }
    }

    // Check if qrRegionRef is mounted before calling startScanner
    if (qrRegionRef.current) {
      startScanner()
    }

    return () => {
      const stopScanner = async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop()
            await scannerRef.current.clear()
          } catch (err) {
            console.warn("Scanner cleanup failed:", err)
          }
        }
      }
      stopScanner()
    }
  }, [onScan])

  return (
    <div
      ref={qrRegionRef}
      id={qrRegionId}
      className="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
      style={{
        height: '250px',
        position: 'relative',
        background: 'black',  // Set background to black, no image overlay.
      }}
    />
  )
}

export default QrScanner
