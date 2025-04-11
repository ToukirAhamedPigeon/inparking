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
            // handle scan errors silently or log
          }
        )
      } catch (error) {
        console.error("Camera error:", error)
      }
    }

    const el = document.getElementById(qrRegionId)
    if (el) {
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
    <div id={qrRegionId} className="w-full bg-slate-300 max-w-md h-64 rounded-xl shadow-xl" />
  )
}

export default QrScanner
