export default function StorePageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 border-b border-store-border bg-store-bg px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-store-border" />
            <div className="h-5 w-32 rounded bg-store-border" />
          </div>
          <div className="h-10 w-10 rounded-full bg-store-border" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-store-border" />
              <div className="h-11 flex-1 rounded-xl bg-store-border" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-store-border">
                  <div className="aspect-square bg-store-border" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded bg-store-border" />
                    <div className="h-5 w-1/3 rounded bg-store-border" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
