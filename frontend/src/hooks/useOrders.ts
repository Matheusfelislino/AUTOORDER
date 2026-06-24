import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveOrder, fetchOrderDetail, fetchOrders, rejectOrder } from '../api/orders'
import type { OrderStatus } from '../types/order'

export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => fetchOrders(status),
    refetchInterval: 10_000, // Polling a cada 10s — novos pedidos aparecem automaticamente
  })
}

export function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderDetail(id!),
    enabled: !!id,
  })
}

export function useApproveOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.setQueryData(['order', data.id], data)
    },
  })
}

export function useRejectOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.setQueryData(['order', data.id], data)
    },
  })
}
