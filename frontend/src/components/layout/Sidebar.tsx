import { Package } from 'lucide-react'
import type { OrderStatus, OrderSummary } from '../../types/order'
import { OrderCard } from '../queue/OrderCard'
import { FilterTabs } from '../queue/FilterTabs'
import { OrderCardSkeleton } from '../shared/Skeleton'

interface Props {
  orders: OrderSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  activeFilter: OrderStatus | undefined
  onFilterChange: (v: OrderStatus | undefined) => void
  isLoading: boolean
}

export function Sidebar({ orders, selectedId, onSelect, activeFilter, onFilterChange, isLoading }: Props) {
  return (
    <aside className="w-80 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-gray-900" />
          <span className="font-semibold text-gray-900 tracking-tight">AutoOrder</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Dashboard do Faturista</p>
      </div>

      <FilterTabs active={activeFilter} onChange={onFilterChange} />

      <div className="flex-1 overflow-y-auto">
        {isLoading && Array.from({ length: 5 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        {!isLoading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <p className="text-sm text-gray-400">Nenhum pedido encontrado</p>
          </div>
        )}
        {!isLoading && orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            isSelected={selectedId === order.id}
            onClick={() => onSelect(order.id)}
          />
        ))}
      </div>
    </aside>
  )
}
