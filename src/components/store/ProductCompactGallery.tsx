'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ProductCompactGalleryProps = {
  images: string[]
  alt: string
}

/** Constrained gallery for modern product — avoids full-viewport hero images. */
export default function ProductCompactGallery({ images, alt }: ProductCompactGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  if (images.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-store-subtle text-sm text-store-muted">
        No image available
      </div>
    )
  }

  const activeImage = images[activeIndex] ?? images[0]
  const hasMultiple = images.length > 1

  return (
    <div className="space-y-3">
      <div className="relative mx-auto aspect-[4/3] max-h-[min(420px,45vh)] w-full overflow-hidden rounded-xl bg-store-subtle shadow-sm">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-contain p-2"
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-store-bg/90 text-store-text shadow"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-store-bg/90 text-store-text shadow"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      {hasMultiple ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ${
                index === activeIndex ? 'border-store-primary' : 'border-store-border'
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
