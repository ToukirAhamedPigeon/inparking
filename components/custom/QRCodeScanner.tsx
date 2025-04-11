'use client'

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = () => {
  useEffect(() => {
    const qrRegionId = "qr-reader";

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
        ) || devices[0]; // fallback to first camera

        const html5QrCode = new Html5Qrcode(qrRegionId);

        await html5QrCode.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log("Scanned Code:", decodedText);
            // Optionally stop scanning after one scan
            html5QrCode.stop().then(() => {
              console.log("Scanner stopped.");
            });
          },
          (errorMessage) => {
            // ignore scan errors
          }
        );
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    startScanner();

    return () => {
      Html5Qrcode.getCameras().then(() => {
        Html5Qrcode.getCameras().then(() => {
          const scanner = new Html5Qrcode(qrRegionId);
          scanner.stop().catch(() => {});
        });
      });
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div id="qr-reader" className="w-full max-w-md h-64 rounded-xl shadow-xl" />
    </div>
  );
};

export default QrScanner;
