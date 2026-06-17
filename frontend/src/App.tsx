import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './components/layout/Sidebar'
import { DetailPanel } from './components/layout/DetailPanel'
import { useApproveOrder, useOrderDetail, useOrders, useRejectOrder } from './hooks/useOrders'
import type { OrderStatus } from './types/order'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-amber-200 shadow-lg text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 text-sm max-w-sm">
      <span>⚠️</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-amber-400 hover:text-amber-700">✕</button>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined)
  const [toast, setToast] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: ordersPage, isLoading } = useOrders(filter)
  const { data: orderDetail, isLoading: isLoadingDetail } = useOrderDetail(selectedId)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 6000)
  }

  const handleConflict = () => {
    showToast('Este pedido foi alterado por outro usuário. Os dados foram atualizados.')
    queryClient.invalidateQueries({ queryKey: ['order', selectedId] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }

  const approve = useApproveOrder()
  const reject = useRejectOrder()

  const handleApprove = () => {
    if (!orderDetail) return
    approve.mutate(orderDetail.id, {
      onSuccess: () => {
        const orders = ordersPage?.content ?? []
        const idx = orders.findIndex(o => o.id === orderDetail.id)
        const next = orders[idx + 1] ?? orders[idx - 1]
        if (next) setSelectedId(next.id)
      },
      onError: (e) => {
        if (isAxiosError(e) && e.response?.status === 409) handleConflict()
        else showToast('Erro ao aprovar. Tente novamente.')
      }
    })
  }

  const handleReject = () => {
    if (!orderDetail) return
    reject.mutate(orderDetail.id, {
      onSuccess: () => {
        const orders = ordersPage?.content ?? []
        const idx = orders.findIndex(o => o.id === orderDetail.id)
        const next = orders[idx + 1] ?? orders[idx - 1]
        if (next) setSelectedId(next.id)
      },
      onError: (e) => {
        if (isAxiosError(e) && e.response?.status === 409) handleConflict()
        else showToast('Erro ao rejeitar. Tente novamente.')
      }
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <Sidebar
        orders={ordersPage?.content ?? []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        activeFilter={filter}
        onFilterChange={setFilter}
        isLoading={isLoading}
      />

      <DetailPanel
        order={orderDetail}
        isLoading={!!selectedId && isLoadingDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={approve.isPending}
        isRejecting={reject.isPending}
      />
    </div>
  )
}
