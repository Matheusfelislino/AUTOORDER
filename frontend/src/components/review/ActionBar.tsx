import { CheckCircle2, XCircle } from 'lucide-react'
import type { OrderDetail } from '../../types/order'

interface Props {
  order: OrderDetail
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
}

export function ActionBar({ order, onApprove, onReject, isApproving, isRejecting }: Props) {
  const canAct = order.status === 'PENDING' || order.status === 'PENDING_REVIEW'
  const canApprove = order.status === 'PENDING'

  if (!canAct) return null

  return (
    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
      <div>
        <p className="text-xs text-gray-400">Total confirmado</p>
        <p className="text-lg font-semibold tabular-nums text-gray-900">
          R$ {order.confirmedTotal.toFixed(2)}
          {order.pendingItemsCount > 0 && (
            <span className="ml-2 text-sm font-normal text-amber-500">
              + {order.pendingItemsCount} pendente{order.pendingItemsCount > 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReject}
          disabled={isRejecting || isApproving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 text-sm font-medium"
        >
          <XCircle size={15} />
          {isRejecting ? 'Rejeitando...' : 'Rejeitar'}
        </button>
        <button
          onClick={onApprove}
          disabled={isApproving || isRejecting || !canApprove}
          title={!canApprove ? 'Resolva os itens pendentes antes de aprovar' : 'Aprovar (⌘ Enter)'}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-40 text-sm font-medium"
        >
          <CheckCircle2 size={15} />
          {isApproving ? 'Aprovando...' : 'Aprovar'}
          {canApprove && !isApproving && (
            <kbd className="ml-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">⌘↵</kbd>
          )}
        </button>
      </div>
    </div>
  )
}
