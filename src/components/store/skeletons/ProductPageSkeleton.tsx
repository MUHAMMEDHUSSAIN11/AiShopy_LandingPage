export default function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-6 w-1/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="mt-6 h-12 w-full rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
