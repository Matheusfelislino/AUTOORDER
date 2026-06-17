import type { OrderDetail } from '../../types/order'
import { StatusBadge } from '../shared/StatusBadge'
import { RawMessage } from '../review/RawMessage'
import { ConfidenceTable } from '../review/ConfidenceTable'
import { ActionBar } from '../review/ActionBar'
import { OrderDetailSkeleton } from '../shared/Skeleton'

interface Props {
  order: OrderDetail | undefined
  isLoading: boolean
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
}

export function DetailPanel({ order, isLoading, onApprove, onReject, isApproving, isRejecting }: Props) {
  if (isLoading) return <div className="flex-1 bg-white"><OrderDetailSkeleton /></div>

  if (!order) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-sm text-gray-400">Selecione um pedido para revisar</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Revisão do Pedido</h2>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{order.messageId}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex gap-8 mt-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Cliente</p>
            <p className="font-medium text-gray-800 mt-0.5">{order.customerId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Recebido em</p>
            <p className="font-medium text-gray-800 mt-0.5">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          {order.approvedAt && (
            <div>
              <p className="text-xs text-gray-400">Aprovado em</p>
              <p className="font-medium text-gray-800 mt-0.5">
                {new Date(order.approvedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <RawMessage content={order.rawContent} />
        <ConfidenceTable items={order.items} />
      </div>

      <ActionBar
        order={order}
        onApprove={onApprove}
        onReject={onReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  )
}
