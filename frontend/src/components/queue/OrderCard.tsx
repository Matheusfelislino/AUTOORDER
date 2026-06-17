import { Clock } from 'lucide-react'
import type { OrderSummary } from '../../types/order'
import { StatusBadge } from '../shared/StatusBadge'

interface Props {
  order: OrderSummary
  isSelected: boolean
  onClick: () => void
}

export function OrderCard({ order, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors focus:outline-none ${
        isSelected
          ? 'bg-gray-900 border-l-2 border-l-gray-900'
          : 'hover:bg-gray-50 border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-mono truncate max-w-[160px] ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
          {order.messageId}
        </span>
        <StatusBadge status={order.status} />
      </div>
      <div className={`text-sm font-medium mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
        {order.customerId}
      </div>
      <div className={`flex items-center gap-1 text-xs ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
        <Clock size={10} />
        {new Date(order.createdAt).toLocaleString('pt-BR')}
      </div>
    </button>
  )
}
