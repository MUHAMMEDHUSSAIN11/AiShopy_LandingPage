'use client'

import BackLink from '@/components/store/BackLink'
import CartIcon from '@/components/store/CartIcon'
import ProductAvailability from '@/components/store/ProductAvailability'
import ProductImageGallery from '@/components/store/ProductImageGallery'
import { useProductDetail } from '@/hooks/use-product-detail'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

type ProductDetailClientProps = {
  store: Store
  product: Product
}

/** Classic template: two-column product page (unchanged default). */
export default function ProductDetailClient({ store, product }: ProductDetailClientProps) {
  const {
    cartCount,
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
    getHref,
  } = useProductDetail(store, product)

  const actionButtons = !inStock ? (
    <button
      type="button"
      disabled
      className="w-full cursor-not-allowed rounded-full bg-store-subtle px-6 py-3 text-sm font-semibold text-store-muted sm:py-4 sm:text-base"
    >
      {soldOut ? 'Sold Out' : 'Out of Stock'}
    </button>
  ) : (
    <div className="flex flex-col gap-3 sm:flex-row">
      {inCart ? (
        <button
          type="button"
          onClick={goToCart}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-store-primary bg-store-primary-soft px-6 py-3 text-sm font-semibold text-store-primary sm:py-4 sm:text-base"
        >
          Go to Cart
        </button>
      ) : (
        <button
          type="button"
          disabled={isAdding}
          onClick={() => handleAddToCart(false)}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-store-primary px-6 py-3 text-sm font-semibold text-store-primary transition hover:bg-store-primary-soft disabled:opacity-60 sm:py-4 sm:text-base"
        >
          Add to Cart
        </button>
      )}
      <button
        type="button"
        disabled={isAdding}
        onClick={() => handleAddToCart(true)}
        className="inline-flex flex-1 items-center justify-center rounded-full bg-store-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-store-primary-hover disabled:opacity-60 sm:py-4 sm:text-base"
      >
        Buy Now
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-store-bg-shell template-page-enter">
      <header className="border-b border-store-border bg-store-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <BackLink href={getHref('/')} label={`Back to ${store.name}`} />
          <CartIcon count={cartCount} onClick={goToCart} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery images={images} alt={product.name} />
          <div>
            <p className="text-sm font-medium text-store-muted">SKU: {product.sku}</p>
            <h1 className="mt-2 text-2xl font-bold text-store-text sm:text-3xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-3 sm:mt-4">
              <p className="text-2xl font-bold text-store-primary sm:text-3xl">{formatPrice(price)}</p>
              {compareAtPrice ? (
                <p className="text-base text-store-muted line-through sm:text-lg">
                  {formatPrice(compareAtPrice)}
                </p>
              ) : null}
            </div>
            <div className="mt-2">
              <ProductAvailability
                label={availabilityLabel}
                outOfStock={!inStock}
                soldOut={soldOut}
                size="md"
              />
            </div>
            {optionGroups.length > 0 && (
              <div className="mt-4 space-y-3 sm:mt-6">
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
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              isSelected
                                ? 'border-store-primary bg-store-primary text-white'
                                : 'border-store-border bg-store-bg text-store-text hover:border-store-primary'
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
                  <p className="text-sm text-store-muted">Selected: {selectedLabel}</p>
                ) : null}
              </div>
            )}
            {addedMessage ? (
              <p className="mt-4 text-sm font-medium text-store-stock-in">{addedMessage}</p>
            ) : null}
            <p className="mt-4 text-sm leading-relaxed text-store-muted sm:mt-6 sm:text-base">
              {product.description}
            </p>
            <div className="mt-6 sm:mt-8">{actionButtons}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
