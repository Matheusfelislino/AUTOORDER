import type { OrderStatus } from '../../types/order'

const STATUS_CONFIG: Record<
  OrderStatus,
  { dot: string; pillBg: string; pillText: string; pillBorder: string; label: string }
> = {
  PENDING: {
    dot: 'bg-state-ready',
    pillBg: 'bg-confidence-high-bg',
    pillText: 'text-confidence-high',
    pillBorder: 'border-confidence-high/30',
    label: 'Pronto',
  },
  PENDING_REVIEW: {
    dot: 'bg-state-attention',
    pillBg: 'bg-confidence-low-bg',
    pillText: 'text-confidence-low',
    pillBorder: 'border-confidence-low/30',
    label: 'Revisão',
  },
  APPROVED: {
    dot: 'bg-state-ready',
    pillBg: 'bg-confidence-high-bg',
    pillText: 'text-confidence-high',
    pillBorder: 'border-confidence-high/30',
    label: 'Aprovado',
  },
  REJECTED: {
    dot: 'bg-state-failed',
    pillBg: 'bg-destructive/10',
    pillText: 'text-destructive',
    pillBorder: 'border-destructive/30',
    label: 'Falha',
  },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1 h-4 px-1.5 rounded text-[9.5px] font-mono uppercase tracking-tight border ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
