import { Filter } from 'lucide-react'
import type { OrderStatus } from '../../types/order'

interface Props {
  active: OrderStatus | undefined
  onChange: (v: OrderStatus | undefined) => void
  counts: { total: number; attention: number; ready: number }
}

export function FilterTabs({ active, onChange, counts }: Props) {
  return (
    <div className="px-3 pb-2 flex items-center gap-1">
      <FilterPill active={active === undefined} onClick={() => onChange(undefined)}>
        Tudo <span className="text-muted-foreground/60 ml-1">{counts.total}</span>
      </FilterPill>
      <FilterPill active={active === 'PENDING_REVIEW'} tone="attention" onClick={() => onChange('PENDING_REVIEW')}>
        Revisão <span className="text-confidence-low/70 ml-1">{counts.attention}</span>
      </FilterPill>
      <FilterPill active={active === 'PENDING'} tone="ready" onClick={() => onChange('PENDING')}>
        Prontos <span className="text-confidence-high/70 ml-1">{counts.ready}</span>
      </FilterPill>
      <button className="ml-auto size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
        <Filter className="size-3.5" />
      </button>
    </div>
  )
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  tone?: 'attention' | 'ready'
  onClick: () => void
}) {
  const base = 'h-7 px-2.5 rounded-md text-[11.5px] font-medium transition-colors flex items-center'
  if (active) {
    return (
      <button onClick={onClick} className={`${base} bg-foreground text-background shadow-card`}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick} className={`${base} text-muted-foreground hover:text-foreground hover:bg-muted`}>
      {children}
    </button>
  )
}
