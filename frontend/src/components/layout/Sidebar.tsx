import { Search, Sparkles, PanelLeftClose, Bell } from 'lucide-react'
import type { OrderStatus, OrderSummary } from '../../types/order'
import { OrderCard } from '../queue/OrderCard'
import { FilterTabs } from '../queue/FilterTabs'
import { OrderCardSkeleton } from '../shared/Skeleton'
import { EmptyQueue } from '../shared/EmptyState'

interface Props {
  orders: OrderSummary[]
  allOrders: OrderSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  activeFilter: OrderStatus | undefined
  onFilterChange: (v: OrderStatus | undefined) => void
  isLoading: boolean
  onCollapse: () => void
}

export function Sidebar({
  orders,
  allOrders,
  selectedId,
  onSelect,
  activeFilter,
  onFilterChange,
  isLoading,
  onCollapse,
}: Props) {
  const counts = {
    total: allOrders.length,
    attention: allOrders.filter(o => o.status === 'PENDING_REVIEW').length,
    ready: allOrders.filter(o => o.status === 'PENDING').length,
  }

  return (
    <aside className="w-[340px] shrink-0 border-r border-hairline bg-surface-2/40 flex flex-col overflow-hidden">
      {/* Brand */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-hairline shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative size-6 rounded-md bg-foreground text-background grid place-items-center">
            <Sparkles className="size-3.5" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-tight">AutoOrder</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground mt-0.5">
              AI Operations
            </span>
          </div>
        </div>
        <button
          className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
          title="Recolher  ["
          onClick={onCollapse}
        >
          <PanelLeftClose className="size-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <label className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-surface border border-hairline text-[12px] text-muted-foreground focus-within:ring-2 focus-within:ring-foreground/10">
          <Search className="size-3.5 shrink-0" />
          <input
            className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground/70 text-foreground text-[12px]"
            placeholder="Buscar cliente, SKU, mensagem…"
          />
          <span className="kbd">⌘K</span>
        </label>
      </div>

      {/* Filter pills */}
      <div className="shrink-0">
        <FilterTabs active={activeFilter} onChange={onFilterChange} counts={counts} />
      </div>

      {/* Queue */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 pt-1">
        {isLoading ? (
          <ul className="space-y-px">
            {Array.from({ length: 6 }).map((_, i) => <li key={i}><OrderCardSkeleton /></li>)}
          </ul>
        ) : orders.length === 0 ? (
          <EmptyQueue />
        ) : (
          <ul className="space-y-px">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={selectedId === order.id}
                onClick={() => onSelect(order.id)}
              />
            ))}
          </ul>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-hairline px-3 py-2.5 flex items-center gap-2.5 shrink-0">
        <div className="size-7 rounded-full bg-foreground/90 text-background grid place-items-center text-[10px] font-semibold">
          FA
        </div>
        <div className="flex-1 leading-tight">
          <p className="text-[12px] font-medium">Faturista</p>
          <p className="text-[10px] text-muted-foreground">Distribuidora · AutoOrder</p>
        </div>
        <button className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
          <Bell className="size-3.5" />
        </button>
      </div>
    </aside>
  )
}
