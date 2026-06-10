'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ProductImageGalleryProps = {
  images: string[]
  alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
        No image available
      </div>
    )
  }

  const activeImage = images[activeIndex] ?? images[0]
  const hasMultiple = images.length > 1

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1))
  }

  const goToNext = () => {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition hover:bg-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex
                  ? 'border-brand-green ring-2 ring-brand-green/20'
                  : 'border-gray-200 hover:border-brand-green/60'
              }`}
            >
              <Image src={url} alt={`${alt} ${index + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
