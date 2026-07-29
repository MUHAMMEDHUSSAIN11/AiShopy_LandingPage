'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackLink from '@/components/store/BackLink'
import StoreHeader from '@/components/store/StoreHeader'
import { useStoreTemplate } from '@/contexts/StoreTemplateContext'
import { useStoreHref } from '@/contexts/PreviewContext'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart-store'
import { canIncreaseCartQuantity } from '@/types/cart'
import type { Store } from '@/types/store'
import type { StoreTemplateId } from '@/types/store'

type CartPageContentProps = {
  store: Store
  showHeader?: boolean
  layout?: StoreTemplateId
  embedded?: boolean
}

function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  canIncrease,
}: {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  canIncrease: boolean
}) {
  return (
    <div className="flex items-center rounded-full border border-store-border bg-store-bg">
      <button
        type="button"
        onClick={onDecrease}
        className="px-3 py-1.5 text-lg font-medium text-store-text hover:bg-store-subtle"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-store-text">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        className="px-3 py-1.5 text-lg font-medium text-store-text hover:bg-store-subtle disabled:cursor-not-allowed disabled:text-store-muted"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default function CartPageContent({
  store,
  showHeader = true,
  layout: layoutProp,
  embedded = false,
}: CartPageContentProps) {
  const router = useRouter()
  const getHref = useStoreHref()
  const layoutFromContext = useStoreTemplate()
  const layout = layoutProp ?? layoutFromContext
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalPrice = useCartStore((state) => state.totalPrice())

  useCartReconcile(store.slug)

  const emptyBlock = (
    <div className="mt-8 rounded-2xl border border-dashed border-store-border bg-store-bg px-6 py-16 text-center">
      <p className="text-lg font-medium text-store-text">Your cart is empty</p>
      <Link
        href={getHref('/')}
        className="mt-4 inline-flex rounded-full bg-store-primary px-6 py-3 text-sm font-semibold text-white hover:bg-store-primary-hover"
      >
        Continue Shopping
      </Link>
    </div>
  )

  const lineItems = (
    <ul className={layout === 'boutique' ? 'mt-8 space-y-6' : 'mt-6 space-y-4'}>
      {items.map((item) => (
        <li
          key={item.id}
          className={
            layout === 'modern'
              ? 'flex gap-4 border-l-4 border-store-primary bg-store-bg p-4 shadow-sm'
              : layout === 'boutique'
                ? 'flex gap-4 rounded-3xl border border-store-border bg-store-bg p-4 shadow-md'
                : 'flex gap-4 rounded-2xl border border-store-border bg-store-bg p-4 shadow-sm'
          }
        >
          <div
            className={
              layout === 'boutique'
                ? 'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-store-subtle'
                : 'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-store-subtle'
            }
          >
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="160px" />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={getHref(`/product/${item.slug}`)}
                className="min-w-0 font-semibold text-store-text hover:text-store-primary"
              >
                {item.name}
              </Link>
              {layout === 'boutique' ? (
                <p className="shrink-0 font-semibold text-store-text">
                  {formatPrice(item.price * item.quantity)}
                </p>
              ) : null}
            </div>
            {item.variantName ? (
              <p className="mt-1 text-sm text-store-muted">{item.variantName}</p>
            ) : null}
            <p className="mt-2 font-bold text-store-primary">{formatPrice(item.price)}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <QuantityStepper
                quantity={item.quantity}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                canIncrease={canIncreaseCartQuantity(item)}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm font-medium text-store-stock-out hover:underline"
              >
                Remove
              </button>
            </div>
          </div>

          {layout !== 'boutique' ? (
            <p className="shrink-0 font-semibold text-store-text">
              {formatPrice(item.price * item.quantity)}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )

  const summary = (
    <div
      className={
        layout === 'modern'
          ? 'sticky bottom-0 mt-6 border-t border-store-border bg-store-bg/95 p-4 backdrop-blur'
          : layout === 'boutique'
            ? 'mt-10 rounded-3xl border border-store-border bg-store-subtle p-6 shadow-inner sm:p-8'
            : 'rounded-2xl border border-store-border bg-store-bg p-6 shadow-sm'
      }
    >
      <div className="flex items-center justify-between text-lg font-bold">
        <span className="text-store-text">Total</span>
        <span className="text-store-primary">{formatPrice(totalPrice)}</span>
      </div>
      <button
        type="button"
        onClick={() => router.push(getHref('/checkout'))}
        className={`mt-4 w-full font-semibold text-white transition hover:bg-store-primary-hover ${
          layout === 'boutique'
            ? 'rounded-full bg-store-primary py-4 text-sm uppercase tracking-widest'
            : layout === 'modern'
              ? 'rounded-md bg-store-primary py-3.5 text-sm'
              : 'rounded-full bg-store-primary py-3.5 text-sm'
        }`}
      >
        Proceed to Checkout
      </button>
    </div>
  )

  const title =
    layout === 'boutique' ? (
      <h1 className="text-center text-2xl font-bold text-store-text">Your Cart</h1>
    ) : (
      <h1 className="mt-4 text-2xl font-bold text-store-text">
        {layout === 'modern' ? 'Cart' : 'Your Cart'}
      </h1>
    )

  const shellClass =
    layout === 'boutique' ? 'cart-boutique' : layout === 'modern' ? 'cart-modern' : 'cart-classic'

  const mainContent = (
    <main
      className={
        layout === 'boutique'
          ? 'mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10'
          : layout === 'modern'
            ? 'mx-auto max-w-2xl px-4 py-6 sm:px-6'
            : 'mx-auto max-w-3xl px-4 py-8 sm:px-6'
      }
    >
      {layout !== 'boutique' ? (
        <BackLink href={getHref('/')} label={`Back to ${store.name}`} />
      ) : null}
      {title}

      {items.length === 0 ? emptyBlock : (
        <div className={layout === 'modern' ? 'pb-28' : ''}>
          {lineItems}
          {summary}
        </div>
      )}
    </main>
  )

  if (embedded) {
    return mainContent
  }

  return (
    <div className={`${shellClass} min-h-screen bg-store-bg-shell template-page-enter`}>
      {showHeader ? <StoreHeader store={store} /> : null}
      {layout === 'modern' && !showHeader ? (
        <div className="border-b border-store-border bg-store-bg">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-store-primary">{store.name}</p>
          </div>
        </div>
      ) : null}

      {mainContent}
    </div>
  )
}
