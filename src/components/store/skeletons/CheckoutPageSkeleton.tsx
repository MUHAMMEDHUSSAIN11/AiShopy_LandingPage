export default function CheckoutPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-8 sm:px-6">
      <div className="h-8 w-48 rounded bg-store-border" />
      <div className="mt-8 flex gap-4 rounded-2xl border border-store-border p-4">
        <div className="h-20 w-20 shrink-0 rounded-lg bg-store-border" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-store-border" />
          <div className="h-4 w-1/4 rounded bg-store-border" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-store-border" />
        ))}
        <div className="h-12 rounded-full bg-store-border" />
      </div>
    </div>
  )
}
