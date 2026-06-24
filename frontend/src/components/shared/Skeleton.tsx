import { Sparkles } from 'lucide-react'

export function OrderCardSkeleton() {
  return (
    <div className="p-2.5 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-1.5 shimmer rounded-full" />
        <div className="h-3 shimmer rounded w-32 flex-1" />
        <div className="h-2.5 shimmer rounded w-12" />
      </div>
      <div className="h-2.5 shimmer rounded w-40 mb-2 ml-3.5" />
      <div className="h-4 shimmer rounded w-16 ml-3.5" />
    </div>
  )
}

export function ProcessingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 px-8">
      <div className="size-10 rounded-xl bg-muted grid place-items-center">
        <Sparkles className="size-4 text-muted-foreground animate-pulse" />
      </div>
      <div className="text-center space-y-3 w-full max-w-xs">
        <p className="text-[13px] font-medium text-foreground/70">
          ✨ Extraindo produtos e intenção de compra...
        </p>
        <div className="space-y-2">
          <div className="h-9 shimmer rounded-lg w-full" />
          <div className="h-9 shimmer rounded-lg w-full" />
          <div className="h-9 shimmer rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  )
}

export function ContextBarSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 h-14">
      <div className="h-4 shimmer rounded w-36" />
      <div className="h-4 shimmer rounded w-24" />
    </div>
  )
}
