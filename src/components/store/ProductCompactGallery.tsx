'use client'

import Image from 'next/image'
import ProductGalleryNav from '@/components/store/ProductGalleryNav'
import { useProductGallery } from '@/hooks/use-product-gallery'

type ProductCompactGalleryProps = {
  images: string[]
  alt: string
}

/** Constrained gallery for modern product — avoids full-viewport hero images. */
export default function ProductCompactGallery({ images, alt }: ProductCompactGalleryProps) {
  const { activeIndex, setActiveIndex, goToPrevious, goToNext, onTouchStart, onTouchEnd, hasMultiple } =
    useProductGallery(images)

  if (images.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-store-subtle text-sm text-store-muted">
        No image available
      </div>
    )
  }

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="space-y-3">
      <div
        className="relative mx-auto aspect-[4/3] max-h-[min(420px,45vh)] w-full touch-pan-y overflow-hidden rounded-xl bg-store-subtle shadow-sm"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-contain p-2"
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          draggable={false}
        />
        {hasMultiple ? (
          <ProductGalleryNav
            onPrevious={goToPrevious}
            onNext={goToNext}
            activeIndex={activeIndex}
            total={images.length}
            variant="square"
          />
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
