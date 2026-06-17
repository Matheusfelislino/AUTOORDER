import type { OrderItem } from '../../types/order'
import { ConfidenceRow } from './ConfidenceRow'

export function ConfidenceTable({ items }: { items: OrderItem[] }) {
  const pending = items.filter(i => i.status === 'PENDING_REVIEW')
  const resolved = items.filter(i => i.status === 'RESOLVED')
  const sorted = [...pending, ...resolved]

  return (
    <div className="mx-6 mt-5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        Itens extraídos pela IA
      </span>
      <div className="mt-2 space-y-1">
        {sorted.map((item, i) => <ConfidenceRow key={i} item={item} />)}
      </div>
    </div>
  )
}
