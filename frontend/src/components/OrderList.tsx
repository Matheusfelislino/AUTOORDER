import { Clock, Package } from 'lucide-react'
import type { OrderStatus, OrderSummary } from '../types/order'
import { StatusBadge } from './StatusBadge'

interface Props {
  orders: OrderSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  activeFilter: OrderStatus | undefined
  onFilterChange: (status: OrderStatus | undefined) => void
}

const filters: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Aguardando', value: 'PENDING' },
  { label: 'Revisão', value: 'PENDING_REVIEW' },
  { label: 'Aprovados', value: 'APPROVED' },
  { label: 'Rejeitados', value: 'REJECTED' },
]

export function OrderList({ orders, selectedId, onSelect, activeFilter, onFilterChange }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package size={20} /> AutoOrder
        </h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard do Faturista</p>
      </div>

      <div className="flex gap-1 p-3 border-b border-gray-200 flex-wrap">
        {filters.map(f => (
          <button
            key={String(f.value)}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {orders.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-12">Nenhum pedido encontrado</p>
        )}
        {orders.map(order => (
          <button
            key={order.id}
            onClick={() => onSelect(order.id)}
            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              selectedId === order.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-gray-500 truncate max-w-[140px]">
                {order.messageId}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-sm text-gray-700 font-medium">{order.customerId}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <Clock size={11} />
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
