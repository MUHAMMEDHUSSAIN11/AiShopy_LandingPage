'use client'

import BackLink from '@/components/store/BackLink'
import CartIcon from '@/components/store/CartIcon'
import ProductAvailability from '@/components/store/ProductAvailability'
import ProductCompactGallery from '@/components/store/ProductCompactGallery'
import { useProductDetail } from '@/hooks/use-product-detail'
import { formatPrice } from '@/lib/format'
import type { ProductTemplateProps } from '@/components/store/templates/types'

export default function ModernProductDetail({ store, product }: ProductTemplateProps) {
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

  const purchaseRow = !inStock ? (
    <button
      type="button"
      disabled
      className="w-full rounded-md bg-store-subtle py-3 text-sm font-semibold text-store-muted"
    >
      {soldOut ? 'Sold out' : 'Out of stock'}
    </button>
  ) : (
    <div className="flex gap-2">
      {inCart ? (
        <button
          type="button"
          onClick={goToCart}
          className="flex-1 rounded-md border border-store-primary py-3 text-sm font-semibold text-store-primary"
        >
          Cart
        </button>
      ) : (
        <button
          type="button"
          disabled={isAdding}
          onClick={() => handleAddToCart(false)}
          className="flex-1 rounded-md border border-store-border py-3 text-sm font-semibold text-store-text disabled:opacity-60"
        >
          Add
        </button>
      )}
      <button
        type="button"
        disabled={isAdding}
        onClick={() => handleAddToCart(true)}
        className="flex-[1.4] rounded-md bg-store-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        Checkout
      </button>
    </div>
  )

  return (
    <div className="product-modern min-h-screen bg-store-bg-shell template-page-enter">
      <header className="sticky top-0 z-10 border-b border-store-border bg-store-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <BackLink href={getHref('/')} label="Products" />
          <span className="hidden text-xs font-bold uppercase tracking-widest text-store-muted sm:inline">
            {store.name}
          </span>
          <CartIcon count={cartCount} onClick={goToCart} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <ProductCompactGallery images={images} alt={product.name} />
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wide text-store-primary">
              {product.categoryName}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-store-text sm:text-3xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-store-primary">{formatPrice(price)}</span>
              {compareAtPrice ? (
                <span className="text-sm text-store-muted line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              ) : null}
              <ProductAvailability
                label={availabilityLabel}
                outOfStock={!inStock}
                soldOut={soldOut}
                size="sm"
              />
            </div>

            {optionGroups.length > 0 ? (
              <div className="mt-6 space-y-4">
                {optionGroups.map((group) => (
                  <div key={group.key}>
                    <p className="text-xs font-bold uppercase tracking-wide text-store-muted">
                      {group.key}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.values.map((value) => {
                        const isSelected = selectedOptions[group.key] === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleOptionSelect(group.key, value)}
                            className={`rounded-md border px-3 py-1.5 text-sm ${
                              isSelected
                                ? 'border-store-primary bg-store-primary text-white'
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
                  <p className="text-xs text-store-muted">{selectedLabel}</p>
                ) : null}
              </div>
            ) : null}

            <p className="mt-6 text-sm leading-relaxed text-store-muted">{product.description}</p>

            {addedMessage ? (
              <p className="mt-3 text-sm text-store-stock-in">{addedMessage}</p>
            ) : null}

            <div className="mt-6 hidden lg:block">{purchaseRow}</div>
          </div>
        </div>
      </main>

      {inStock ? (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-store-border bg-store-bg/95 p-4 backdrop-blur lg:hidden">
          {purchaseRow}
        </div>
      ) : null}
    </div>
  )
}
