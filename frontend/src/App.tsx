import { useCallback, useMemo, useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './components/layout/Sidebar'
import { DetailPanel } from './components/layout/DetailPanel'
import { useApproveOrder, useOrderDetail, useOrders, useRejectOrder } from './hooks/useOrders'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import type { OrderStatus } from './types/order'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-surface border border-confidence-low/30 shadow-attention text-confidence-low px-4 py-3 rounded-lg flex items-center gap-3 text-[13px] max-w-sm animate-slide-in">
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-confidence-low/50 hover:text-confidence-low">✕</button>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined)
  const [toast, setToast] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const queryClient = useQueryClient()

  // Fetch all orders without backend filter for accurate counts + local filtering
  const { data: ordersPage, isLoading } = useOrders()
  const { data: orderDetail, isLoading: isLoadingDetail } = useOrderDetail(selectedId)

  const allOrders = ordersPage?.content ?? []

  const orders = useMemo(() => {
    if (!filter) return allOrders
    return allOrders.filter(o => o.status === filter)
  }, [allOrders, filter])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 6000)
  }

  const handleConflict = () => {
    showToast('Este pedido foi alterado por outro usuário. Os dados foram atualizados.')
    queryClient.invalidateQueries({ queryKey: ['order', selectedId] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }

  const navigateTo = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const advanceToNext = useCallback(() => {
    const idx = orders.findIndex(o => o.id === selectedId)
    const next = orders[idx + 1] ?? orders[idx - 1] ?? null
    navigateTo(next?.id ?? null)
  }, [orders, selectedId, navigateTo])

  const approve = useApproveOrder()
  const reject = useRejectOrder()

  const handleApprove = useCallback(() => {
    if (!orderDetail || approve.isPending) return
    approve.mutate(orderDetail.id, {
      onSuccess: advanceToNext,
      onError: (e) => {
        if (isAxiosError(e) && e.response?.status === 409) handleConflict()
        else showToast('Erro ao aprovar. Tente novamente.')
      },
    })
  }, [orderDetail, approve, advanceToNext])

  const handleReject = useCallback(() => {
    if (!orderDetail || reject.isPending) return
    reject.mutate(orderDetail.id, {
      onSuccess: advanceToNext,
      onError: (e) => {
        if (isAxiosError(e) && e.response?.status === 409) handleConflict()
        else showToast('Erro ao rejeitar. Tente novamente.')
      },
    })
  }, [orderDetail, reject, advanceToNext])

  useKeyboardShortcuts({
    onArrowUp: useCallback(() => {
      const idx = orders.findIndex(o => o.id === selectedId)
      const prev = orders[idx - 1]
      if (prev) navigateTo(prev.id)
      else if (orders.length > 0) navigateTo(orders[0].id)
    }, [orders, selectedId, navigateTo]),

    onArrowDown: useCallback(() => {
      const idx = orders.findIndex(o => o.id === selectedId)
      const next = orders[idx + 1]
      if (next) navigateTo(next.id)
      else if (orders.length > 0 && idx === -1) navigateTo(orders[0].id)
    }, [orders, selectedId, navigateTo]),

    onCmdEnter: useCallback(() => {
      if (orderDetail?.status === 'PENDING') handleApprove()
    }, [orderDetail, handleApprove]),

    onBracketLeft: useCallback(() => {
      setIsSidebarCollapsed(c => !c)
    }, []),
  })

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Regra 3 sidebar collapse: remove from DOM quando colapsada */}
      {!isSidebarCollapsed && (
        <Sidebar
          orders={orders}
          allOrders={allOrders}
          selectedId={selectedId}
          onSelect={navigateTo}
          activeFilter={filter}
          onFilterChange={setFilter}
          isLoading={isLoading}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <DetailPanel
        order={orderDetail}
        isLoading={!!selectedId && isLoadingDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={approve.isPending}
        isRejecting={reject.isPending}
        isSidebarCollapsed={isSidebarCollapsed}
        onExpandSidebar={() => setIsSidebarCollapsed(false)}
      />
    </div>
  )
}
