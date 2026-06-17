import axios from 'axios'
import type { OrderDetail, OrderStatus, OrderSummary, PageResponse } from '../types/order'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchOrders(
  status?: OrderStatus,
  page = 0,
  size = 20
): Promise<PageResponse<OrderSummary>> {
  const params: Record<string, unknown> = { page, size, sort: 'createdAt,desc' }
  if (status) params.status = status
  const { data } = await api.get('/orders', { params })
  return data
}

export async function fetchOrderDetail(id: string): Promise<OrderDetail> {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export async function approveOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.post(`/orders/${id}/approve`)
  return data
}

export async function rejectOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.post(`/orders/${id}/reject`)
  return data
}
