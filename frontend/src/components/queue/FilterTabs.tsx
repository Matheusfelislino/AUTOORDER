import type { OrderStatus } from '../../types/order'

const filters: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Pendentes', value: 'PENDING' },
  { label: 'Revisão', value: 'PENDING_REVIEW' },
  { label: 'Aprovados', value: 'APPROVED' },
]

interface Props {
  active: OrderStatus | undefined
  onChange: (v: OrderStatus | undefined) => void
  counts?: Partial<Record<OrderStatus | 'all', number>>
}

export function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 p-3 border-b border-gray-200 flex-wrap">
      {filters.map(f => (
        <button
          key={String(f.value)}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            active === f.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
