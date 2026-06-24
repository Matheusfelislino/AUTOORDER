import { CheckCircle2, AlertTriangle, Pencil, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { OrderItem } from '../../types/order'

const BRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

function getMockSuggestions(description: string): { sku: string; name: string; price: number }[] {
  const d = description.toLowerCase()
  if (d.includes('água com gás') || d.includes('agua com gas') || d.includes('agua gás'))
    return [
      { sku: 'AGU-GAS-CX', name: 'Água com Gás Caixa 12un', price: 18.90 },
      { sku: 'AGU-SEM-CX', name: 'Água sem Gás Caixa 12un', price: 16.50 },
    ]
  if (d.includes('latão') || d.includes('latao') || d.includes('cerveja lata') || d.includes('latinha'))
    return [{ sku: 'CRV-350-LTA', name: 'Cerveja Latão 350ml Caixa 12un', price: 45.00 }]
  if (d.includes('refri') || d.includes('refrigerante'))
    return [{ sku: 'REF-LT-FD', name: 'Refrigerante Lata Fardo 12un', price: 32.00 }]
  if (d.includes('suco') || d.includes('laranja'))
    return [{ sku: 'SUC-LRJ-CX', name: 'Suco Laranja Caixa 12un', price: 28.00 }]
  return []
}

interface ResolvedRowProps {
  item: OrderItem
}

export function ResolvedRow({ item }: ResolvedRowProps) {
  const total = item.subtotal ?? (item.unitPrice != null ? item.unitPrice * item.quantity : null)

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-hairline bg-surface hover:border-foreground/15 transition-colors animate-slide-in">
      <CheckCircle2 className="size-3.5 text-confidence-high shrink-0" strokeWidth={2.5} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium tracking-tight truncate">{item.rawDescription}</p>
        {item.sku && (
          <p className="text-[10.5px] font-mono text-muted-foreground tracking-tight">
            SKU {item.sku}
            {item.unitPrice != null && ` · ${BRL(item.unitPrice)} / ${item.unit.toLowerCase()}`}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-[13px] font-mono font-medium tabular-nums">
          {item.quantity} <span className="text-muted-foreground text-[11px]">{item.unit}</span>
        </p>
        {total != null && (
          <p className="text-[10.5px] font-mono text-muted-foreground tabular-nums">
            {BRL(total)}
          </p>
        )}
      </div>
      <button className="opacity-0 group-hover:opacity-100 size-6 grid place-items-center rounded text-muted-foreground hover:bg-muted transition-opacity">
        <Pencil className="size-3" />
      </button>
    </div>
  )
}

interface PendingRowProps {
  item: OrderItem
  onResolve: (sku?: string, name?: string, price?: number) => void
}

export function PendingRow({ item, onResolve }: PendingRowProps) {
  const [resolved, setResolved] = useState(false)
  const [resolvedName, setResolvedName] = useState<string | null>(null)
  const suggestions = getMockSuggestions(item.rawDescription)

  const handleSuggestion = (sku: string, name: string, price: number) => {
    setResolved(true)
    setResolvedName(name)
    onResolve(sku, name, price)
  }

  const handleConfirmAnyway = () => {
    setResolved(true)
    setResolvedName(item.rawDescription)
    onResolve()
  }

  if (resolved) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-confidence-high/30 bg-confidence-high-bg/40 animate-slide-in">
        <CheckCircle2 className="size-3.5 text-confidence-high shrink-0" strokeWidth={2.5} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium tracking-tight">{resolvedName}</p>
          <p className="text-[10.5px] text-confidence-high font-mono">Confirmado manualmente</p>
        </div>
        <p className="text-[13px] font-mono font-medium tabular-nums text-right shrink-0">
          {item.quantity} <span className="text-muted-foreground text-[11px]">{item.unit}</span>
        </p>
      </div>
    )
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Tab' && suggestions.length > 0) {
          e.preventDefault()
          const first = suggestions[0]
          handleSuggestion(first.sku, first.name, first.price)
        }
      }}
      className="flex flex-col gap-3 px-3.5 py-3 rounded-lg border border-confidence-low/30 bg-confidence-low-bg/60 ring-1 ring-confidence-low/10 shadow-attention animate-slide-in"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 size-1.5 rounded-full bg-confidence-low animate-pulse-soft shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <AlertTriangle className="size-3 text-confidence-low" strokeWidth={2.4} />
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-confidence-low">
              Atenção necessária
            </p>
          </div>
          <p className="text-[13px] font-semibold tracking-tight text-foreground">
            "{item.rawDescription}"
          </p>
          <p className="text-[11.5px] text-muted-foreground mt-0.5">
            SKU não identificado — confirme manualmente para prosseguir.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="inline-flex items-center bg-surface border border-hairline rounded overflow-hidden">
            <span className="w-10 h-6 text-right px-1.5 text-[12px] font-mono tabular-nums bg-transparent flex items-center justify-end text-foreground">
              {item.quantity}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground pr-1.5">
              {item.unit}
            </span>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="size-3 text-confidence-low/70" />
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-confidence-low/80">
              Sugestões da IA
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button
                key={s.sku}
                onClick={() => handleSuggestion(s.sku, s.name, s.price)}
                className="text-[11px] h-7 px-2.5 rounded-md border border-confidence-low/30 bg-surface text-foreground hover:border-confidence-low hover:bg-confidence-low-bg transition-colors flex items-center gap-1.5 active:scale-[0.97]"
              >
                <Sparkles className="size-2.5 text-confidence-low" />
                {s.name}
                <span className="font-mono text-muted-foreground ml-1">{BRL(s.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-confidence-low/80 mb-1.5">
          Ação necessária
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={handleConfirmAnyway}
            className="text-[11px] h-7 px-2.5 rounded-md border transition-colors flex items-center gap-1.5 bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.97]"
          >
            <CheckCircle2 className="size-3" strokeWidth={2.5} />
            Confirmar assim mesmo
          </button>
        </div>
      </div>
    </div>
  )
}
