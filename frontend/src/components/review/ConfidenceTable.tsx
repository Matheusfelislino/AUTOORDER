import { Sparkles } from 'lucide-react'
import type { OrderItem } from '../../types/order'
import { ResolvedRow, PendingRow } from './ConfidenceRow'

const BRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

interface Props {
  items: OrderItem[]
  resolvedItems: Set<number>
  onResolveItem: (idx: number, sku?: string, name?: string, price?: number) => void
  flashKey: number
}

export function ConfidenceTable({ items, resolvedItems, onResolveItem, flashKey }: Props) {
  const pending = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item, idx }) => item.status === 'PENDING_REVIEW' && !resolvedItems.has(idx))

  const resolved = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item, idx }) => item.status === 'RESOLVED' || resolvedItems.has(idx))

  const subtotal = resolved.reduce((acc, { item }) => {
    return acc + (item.subtotal ?? (item.unitPrice != null ? item.unitPrice * item.quantity : 0))
  }, 0)
  const tax = subtotal * 0.04
  const total = subtotal + tax

  const pendingCount = pending.length
  const resolvedCount = resolved.length

  return (
    <section className="w-[520px] shrink-0 overflow-y-auto bg-background">
      <div className="px-7 py-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="size-3.5 text-foreground" />
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-foreground">
            Auditoria da IA
          </h2>
          <div className="flex-1 h-px bg-hairline" />
          <div className="flex items-center gap-1.5">
            {pendingCount > 0 && (
              <ConfidenceTag tone="low">{pendingCount} revisão</ConfidenceTag>
            )}
            {resolvedCount > 0 && (
              <ConfidenceTag tone="high">{resolvedCount} alta</ConfidenceTag>
            )}
          </div>
        </div>

        {/* Pending items first (surface friction) */}
        <div className="space-y-2">
          {pending.map(({ item, idx }) => (
            <PendingRow key={idx} item={item} onResolve={(sku, name, price) => onResolveItem(idx, sku, name, price)} />
          ))}
          {resolved.map(({ item, idx }) => (
            <ResolvedRow key={idx} item={item} />
          ))}
        </div>

        {/* Totals — Regra 4: tabular-nums em tudo */}
        <div className="mt-6 pt-4 border-t border-hairline space-y-1.5 text-[12px]">
          <TotalRow
            label="Subtotal"
            value={BRL(subtotal)}
            flashKey={flashKey}
            muted
          />
          <TotalRow
            label="Impostos (estimativa)"
            value={BRL(tax)}
            flashKey={flashKey}
            muted
          />
          <TotalRow
            label="Total"
            value={BRL(total)}
            flashKey={flashKey}
            bold
          />
        </div>
      </div>
    </section>
  )
}

function TotalRow({
  label,
  value,
  muted,
  bold,
  flashKey,
}: {
  label: string
  value: string
  muted?: boolean
  bold?: boolean
  flashKey: number
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-muted-foreground' : ''}>{label}</span>
      <span
        key={flashKey}
        className={`font-mono tabular-nums animate-flash ${
          bold ? 'text-foreground font-semibold text-[14px]' : ''
        } ${muted ? 'text-muted-foreground' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function ConfidenceTag({
  tone,
  children,
}: {
  tone: 'high' | 'low'
  children: React.ReactNode
}) {
  const cls =
    tone === 'high'
      ? 'bg-confidence-high-bg text-confidence-high border-confidence-high/20'
      : 'bg-confidence-low-bg text-confidence-low border-confidence-low/20'
  return (
    <span className={`text-[9.5px] font-mono uppercase tracking-tight px-1.5 py-0.5 rounded border ${cls}`}>
      {children}
    </span>
  )
}
