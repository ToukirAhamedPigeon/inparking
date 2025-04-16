'use client'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Image from 'next/image'
export default function Fancybox({ src,alt,className }: { src: string,alt:string,className?:string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        className={`${className} cursor-pointer object-cover`}
        onClick={() => setOpen(true)}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
      />
    </>
  )
}