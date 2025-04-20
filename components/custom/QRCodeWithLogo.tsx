'use client'

import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'

type QRWithLogoProps = {
  value: string
  size?: number
  logoSrc: string
  logoSizeRatio?: number // e.g. 0.2 = 20% of QR size
}

export default function QRWithLogo({
  value,
  size = 128,
  logoSrc,
  logoSizeRatio = 0.2,
}: QRWithLogoProps) {
  const logoSize = size * logoSizeRatio

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <QRCodeCanvas
        value={value}
        size={size}
        includeMargin
        level="H" // High error correction to allow for logo overlay
        style={{ width: size, height: size }}
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
  )
}
