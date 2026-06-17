import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { OrderItem } from '../../types/order'

export function ConfidenceRow({ item }: { item: OrderItem }) {
  const isResolved = item.status === 'RESOLVED'

  if (isResolved) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg text-sm">
        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
        <span className="flex-1 text-gray-600">{item.rawDescription}</span>
        <span className="tabular-nums text-gray-400 text-xs w-12 text-right">{item.quantity} {item.unit}</span>
        <span className="tabular-nums text-gray-500 text-xs w-20 text-right font-mono">
          {item.sku}
        </span>
        <span className="tabular-nums text-gray-700 text-sm w-20 text-right font-medium">
          R$ {item.subtotal?.toFixed(2)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 py-3 px-4 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-sm">
      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-gray-700 font-medium">{item.rawDescription}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-amber-600 font-medium">SKU não identificado</span>
          <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>
        </div>
      </div>
      <span className="tabular-nums text-amber-400 text-sm w-20 text-right">—</span>
    </div>
  )
}
