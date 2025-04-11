import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

const QrScanner = () => {
  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: false,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    const scanner = new Html5QrcodeScanner("qr-reader", config, false);

    // Always scan from back camera (environment facing)
    Html5Qrcode.getCameras().then(devices => {
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes("back") ||
        device.label.toLowerCase().includes("rear") ||
        device.label.toLowerCase().includes("environment")
      );

      if (backCamera) {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText, decodedResult) => {
            console.log("Scan success", decodedText);
          },
          (error) => {
            console.warn("Scan error", error);
          }
        );
      } else {
        // fallback to scanner UI if no back camera found
        scanner.render(
          (decodedText, decodedResult) => {
            console.log("Scan success", decodedText);
          },
          (error) => {
            console.warn("Scan error", error);
          }
        );
      }
    }).catch(err => {
      console.error("Camera fetch error:", err);
    });

    // Optional cleanup
    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="qr-reader" className="w-full h-64" />;
};

export default QrScanner;
