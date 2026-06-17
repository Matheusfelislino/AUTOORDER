import { useState } from 'react'
import { OrderList } from './components/OrderList'
import { OrderDetailPanel } from './components/OrderDetail'
import { useApproveOrder, useOrderDetail, useOrders, useRejectOrder } from './hooks/useOrders'
import type { OrderStatus } from './types/order'
import { isAxiosError } from 'axios'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-orange-100 border border-orange-300 text-orange-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm max-w-sm">
      <span>{message}</span>
      <button onClick={onClose} className="text-orange-600 hover:text-orange-900 font-bold">✕</button>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | undefined>(undefined)
  const [toast, setToast] = useState<string | null>(null)

  const { data: ordersPage, isLoading } = useOrders(filter)
  const { data: orderDetail, isLoading: isLoadingDetail } = useOrderDetail(selectedId)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 6000)
  }

  const handleError = (error: unknown, queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>) => {
    if (isAxiosError(error) && error.response?.status === 409) {
      showToast('⚠️ Este pedido foi alterado por outro usuário. Os dados foram atualizados.')
      queryClient.invalidateQueries({ queryKey: ['order', selectedId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } else {
      showToast('Ocorreu um erro. Tente novamente.')
    }
  }

  const approve = useApproveOrder()
  const reject = useRejectOrder()

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Carregando pedidos...
          </div>
        ) : (
          <OrderList
            orders={ordersPage?.content ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        )}
      </aside>

      <main className="flex-1 bg-white border-l border-gray-100">
        {!selectedId && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Selecione um pedido para visualizar os detalhes
          </div>
        )}
        {selectedId && isLoadingDetail && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Carregando detalhes...
          </div>
        )}
        {selectedId && orderDetail && (
          <OrderDetailPanel
            order={orderDetail}
            onApprove={() => approve.mutate(orderDetail.id, {
              onError: (e) => handleError(e, approve.reset as never)
            })}
            onReject={() => reject.mutate(orderDetail.id, {
              onError: (e) => handleError(e, reject.reset as never)
            })}
            isApproving={approve.isPending}
            isRejecting={reject.isPending}
          />
        )}
      </main>
    </div>
  )
}
