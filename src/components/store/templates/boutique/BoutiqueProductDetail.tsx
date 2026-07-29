'use client'

import ProductAvailability from '@/components/store/ProductAvailability'
import ProductImageGallery from '@/components/store/ProductImageGallery'
import MarketplaceHeader from '@/components/store/templates/boutique/MarketplaceHeader'
import { useProductDetail } from '@/hooks/use-product-detail'
import { formatPrice } from '@/lib/format'
import type { ProductTemplateProps } from '@/components/store/templates/types'

export default function BoutiqueProductDetail({ store, product }: ProductTemplateProps) {
  const {
    optionGroups,
    selectedOptions,
    addedMessage,
    isAdding,
    images,
    price,
    compareAtPrice,
    inStock,
    soldOut,
    availabilityLabel,
    selectedLabel,
    inCart,
    handleOptionSelect,
    handleAddToCart,
    goToCart,
  } = useProductDetail(store, product)

  return (
    <div className="product-boutique min-h-screen bg-store-bg template-page-enter">
      <MarketplaceHeader store={store} />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="overflow-hidden rounded-3xl border border-store-border bg-store-bg shadow-md lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="border-b border-store-border bg-store-subtle p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-widest text-store-primary">
              {product.categoryName}
            </p>
            <div className="mt-4 max-w-md lg:max-w-none">
              <ProductImageGallery images={images} alt={product.name} />
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <h1 className="marketplace-title text-2xl font-bold tracking-tight text-store-text sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-store-muted">SKU {product.sku}</p>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-store-primary">{formatPrice(price)}</span>
              {compareAtPrice ? (
                <span className="text-lg text-store-muted line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              ) : null}
            </div>

            <div className="mt-3">
              <ProductAvailability
                label={availabilityLabel}
                outOfStock={!inStock}
                soldOut={soldOut}
                size="md"
              />
            </div>

            {optionGroups.length > 0 ? (
              <div className="mt-6 space-y-4 border-t border-store-border pt-6">
                {optionGroups.map((group) => (
                  <div key={group.key}>
                    <p className="text-sm font-semibold text-store-text">{group.key}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.values.map((value) => {
                        const isSelected = selectedOptions[group.key] === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleOptionSelect(group.key, value)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium ${
                              isSelected
                                ? 'border-store-text bg-store-text text-white'
                                : 'border-store-border bg-store-bg text-store-text'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {selectedLabel ? (
                  <p className="text-sm text-store-muted">{selectedLabel}</p>
                ) : null}
              </div>
            ) : null}

            <p className="mt-6 text-sm leading-relaxed text-store-muted">{product.description}</p>

            {addedMessage ? (
              <p className="mt-4 text-sm font-medium text-store-stock-in">{addedMessage}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!inStock ? (
                <button
                  type="button"
                  disabled
                  className={`w-full rounded-full py-3.5 text-sm font-semibold uppercase tracking-wider ${
                    soldOut
                      ? 'bg-store-stock-out/10 text-store-stock-out'
                      : 'bg-store-subtle text-store-muted'
                  }`}
                >
                  {soldOut ? 'Sold out' : 'Unavailable'}
                </button>
              ) : (
                <>
                  {inCart ? (
                    <button
                      type="button"
                      onClick={goToCart}
                      className="flex-1 rounded-full border-2 border-store-text py-3.5 text-sm font-semibold uppercase tracking-wider text-store-text"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isAdding}
                      onClick={() => handleAddToCart(false)}
                      className="flex-1 rounded-full border-2 border-store-text py-3.5 text-sm font-semibold uppercase tracking-wider text-store-text disabled:opacity-60"
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isAdding}
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 rounded-full bg-store-primary py-3.5 text-sm font-semibold uppercase tracking-wider text-white hover:bg-store-primary-hover disabled:opacity-60"
                  >
                    Buy now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
