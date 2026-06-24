import type { OrderSummary } from '../../types/order'
import { StatusBadge } from '../shared/StatusBadge'

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours} h`
  return `há ${Math.floor(hours / 24)} d`
}

const STATUS_DOT: Record<string, string> = {
  PENDING: 'bg-state-ready',
  PENDING_REVIEW: 'bg-state-attention',
  APPROVED: 'bg-state-ready',
  REJECTED: 'bg-state-failed',
}

interface Props {
  order: OrderSummary
  isSelected: boolean
  onClick: () => void
}

export function OrderCard({ order, isSelected, onClick }: Props) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left p-2.5 rounded-md border transition-colors ${
          isSelected
            ? 'bg-surface border-hairline shadow-card animate-slide-in'
            : 'border-transparent hover:bg-surface/60 hover:border-hairline/60'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`size-1.5 rounded-full ${STATUS_DOT[order.status] ?? 'bg-muted-foreground'} shrink-0`} />
          <span className="text-[12.5px] font-semibold tracking-tight truncate flex-1 text-left">
            {order.customerId}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            {timeAgo(order.createdAt)}
          </span>
        </div>
        <p className="text-[11.5px] text-muted-foreground line-clamp-1 pl-3.5 font-mono tracking-tight">
          {order.messageId}
        </p>
        <div className="flex items-center gap-2 mt-2 pl-3.5">
          <StatusBadge status={order.status} />
        </div>
      </button>
    </li>
  )
}
