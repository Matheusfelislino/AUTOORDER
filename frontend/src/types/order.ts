export type OrderStatus = 'PENDING' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
export type OrderItemStatus = 'RESOLVED' | 'PENDING_REVIEW'

export interface OrderSummary {
  id: string
  messageId: string
  customerId: string
  status: OrderStatus
  createdAt: string
}

export interface OrderItem {
  rawDescription: string
  sku: string | null
  quantity: number
  unit: string
  unitPrice: number | null
  subtotal: number | null
  status: OrderItemStatus
}

export interface OrderDetail {
  id: string
  messageId: string
  customerId: string
  status: OrderStatus
  confirmedTotal: number
  pendingItemsCount: number
  createdAt: string
  approvedAt: string | null
  version: number
  rawContent: string | null
  items: OrderItem[]
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
