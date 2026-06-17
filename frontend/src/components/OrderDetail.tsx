import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { OrderDetail } from '../types/order'
import { StatusBadge } from './StatusBadge'

interface Props {
  order: OrderDetail
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
}

export function OrderDetailPanel({ order, onApprove, onReject, isApproving, isRejecting }: Props) {
  const canAct = order.status === 'PENDING' || order.status === 'PENDING_REVIEW'

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalhes do Pedido</h2>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{order.messageId}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-gray-500">Cliente</span>
            <p className="font-medium text-gray-900">{order.customerId}</p>
          </div>
          <div>
            <span className="text-gray-500">Total confirmado</span>
            <p className="font-medium text-gray-900">
              R$ {order.confirmedTotal.toFixed(2)}
              {order.pendingItemsCount > 0 && (
                <span className="ml-1 text-orange-500 text-xs">
                  + {order.pendingItemsCount} pendente(s)
                </span>
              )}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Criado em</span>
            <p className="font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          {order.approvedAt && (
            <div>
              <span className="text-gray-500">Aprovado em</span>
              <p className="font-medium text-gray-900">
                {new Date(order.approvedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Itens do Pedido</h3>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border text-sm ${
                item.status === 'RESOLVED'
                  ? 'border-green-200 bg-green-50'
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.status === 'RESOLVED'
                    ? <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />
                    : <AlertTriangle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                  }
                  <span className="font-medium text-gray-800">{item.rawDescription}</span>
                </div>
                {item.subtotal != null && (
                  <span className="text-gray-600 shrink-0">R$ {item.subtotal.toFixed(2)}</span>
                )}
              </div>
              <div className="ml-5 mt-1 flex gap-3 text-xs text-gray-500">
                <span>{item.quantity} {item.unit}</span>
                {item.sku && <span className="font-mono">{item.sku}</span>}
                {item.unitPrice != null && <span>R$ {item.unitPrice.toFixed(2)}/un</span>}
                {item.status === 'PENDING_REVIEW' && (
                  <span className="text-orange-600 font-medium">SKU não identificado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {canAct && (
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onReject}
            disabled={isRejecting || isApproving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <XCircle size={16} />
            {isRejecting ? 'Rejeitando...' : 'Rejeitar'}
          </button>
          <button
            onClick={onApprove}
            disabled={isApproving || isRejecting || order.status === 'PENDING_REVIEW'}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <CheckCircle size={16} />
            {isApproving ? 'Aprovando...' : order.status === 'PENDING_REVIEW' ? 'Revisão necessária' : 'Aprovar'}
          </button>
        </div>
      )}
    </div>
  )
}
