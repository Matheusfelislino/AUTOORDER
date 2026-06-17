import type { OrderStatus } from '../../types/order'

const styles: Record<OrderStatus, string> = {
  PENDING:        'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PENDING_REVIEW: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  APPROVED:       'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  REJECTED:       'bg-red-50 text-red-600 ring-1 ring-red-200',
}

const labels: Record<OrderStatus, string> = {
  PENDING:        'Aguardando',
  PENDING_REVIEW: 'Revisão',
  APPROVED:       'Aprovado',
  REJECTED:       'Rejeitado',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tabular-nums ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
