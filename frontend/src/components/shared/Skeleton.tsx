export function OrderCardSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-gray-100 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-3 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  )
}

export function OrderDetailSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse p-6 gap-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-3 bg-gray-200 rounded w-32" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-20 bg-gray-100 rounded-lg" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-14 bg-gray-100 rounded-lg" />
        <div className="h-14 bg-gray-100 rounded-lg" />
      </div>
    </div>
  )
}
