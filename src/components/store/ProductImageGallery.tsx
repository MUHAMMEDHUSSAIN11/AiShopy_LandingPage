'use client'

import Image from 'next/image'
import ProductGalleryNav from '@/components/store/ProductGalleryNav'
import { useProductGallery } from '@/hooks/use-product-gallery'

type ProductImageGalleryProps = {
  images: string[]
  alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const { activeIndex, setActiveIndex, goToPrevious, goToNext, onTouchStart, onTouchEnd, hasMultiple } =
    useProductGallery(images)

  if (images.length === 0) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-2xl bg-store-subtle text-store-muted shadow-sm sm:max-w-sm lg:max-w-none">
        No image available
      </div>
    )
  }

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="mx-auto w-full max-w-[280px] space-y-3 sm:max-w-sm sm:space-y-4 lg:max-w-none">
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-2xl bg-store-subtle shadow-sm"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          draggable={false}
        />

        {hasMultiple ? (
          <ProductGalleryNav
            onPrevious={goToPrevious}
            onNext={goToNext}
            activeIndex={activeIndex}
            total={images.length}
          />
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex
                  ? 'border-store-primary ring-2 ring-store-primary/20'
                  : 'border-store-border hover:border-store-primary/60'
              }`}
            >
              <Image src={url} alt={`${alt} ${index + 1}`} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
