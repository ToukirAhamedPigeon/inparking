'use client'

import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Image from 'next/image'

type SingleImageProps = {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}

type GroupImageProps = {
  slides: { src: string; title?: string; description?: string }[]
  openIndex: number
  onClose: () => void
  mode: 'group'
}

export default function Fancybox(
  props: SingleImageProps | GroupImageProps
) {
  if ('mode' in props && props.mode === 'group') {
    return (
      <Lightbox
        open
        close={props.onClose}
        index={props.openIndex}
        slides={props.slides.map(slide => ({
          src: slide.src,
          description: slide.title
            ? `<strong>${slide.title}</strong><br/>${slide.description ?? ''}`
            : slide.description ?? '',
        }))}
      />
    )
  }

  // Single Image Fancy Preview
  const { src, alt, className, onClick } = props as SingleImageProps
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        className={`${className} cursor-pointer object-cover`}
        onClick={() => {
          onClick ? onClick() : setOpen(true)
        }}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
      />
    </>
  )
}
