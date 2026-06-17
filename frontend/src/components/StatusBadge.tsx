import type { OrderStatus } from '../types/order'

const styles: Record<OrderStatus, string> = {
  PENDING:        'bg-yellow-100 text-yellow-800',
  PENDING_REVIEW: 'bg-orange-100 text-orange-800',
  APPROVED:       'bg-green-100 text-green-800',
  REJECTED:       'bg-red-100 text-red-800',
}

const labels: Record<OrderStatus, string> = {
  PENDING:        'Aguardando aprovação',
  PENDING_REVIEW: 'Revisão necessária',
  APPROVED:       'Aprovado',
  REJECTED:       'Rejeitado',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
