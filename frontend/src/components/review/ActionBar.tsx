import { ArrowUpRight, AlertTriangle, Command, CornerDownLeft, Delete } from 'lucide-react'

const BRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

interface Props {
  total: number
  canApprove: boolean
  pendingCount: number
  flashKey: number
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
}

export function ActionBar({
  total,
  canApprove,
  pendingCount,
  flashKey,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: Props) {
  return (
    <footer className="h-[72px] shrink-0 border-t border-hairline bg-background flex items-center px-6 gap-5">
      {/* Total — Regra 4: tabular-nums obrigatório */}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
          Total do pedido
        </span>
        <span
          key={flashKey}
          className="text-[22px] font-semibold tracking-tight font-mono tabular-nums mt-1.5 animate-flash"
        >
          {pendingCount > 0 && total === 0 ? 'R$ --,--' : BRL(total)}
        </span>
      </div>

      {/* Keyboard shortcut hints */}
      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground ml-2">
        <Command className="size-3" />
        <span>Atalhos:</span>
        <span className="kbd">↑</span>
        <span className="kbd">↓</span>
        <span>navegar</span>
      </div>

      {/* Regra 3: aviso inline quando botão está bloqueado */}
      {!canApprove && pendingCount > 0 && (
        <div className="ml-auto mr-2 flex items-center gap-2 text-[11.5px] text-confidence-low">
          <AlertTriangle className="size-3.5 shrink-0" />
          <span>
            {pendingCount} {pendingCount === 1 ? 'item precisa' : 'itens precisam'} de revisão antes de aprovar
          </span>
        </div>
      )}

      <div className={`flex items-center gap-2.5 ${canApprove || pendingCount === 0 ? 'ml-auto' : ''}`}>
        <button
          onClick={onReject}
          disabled={isRejecting || isApproving}
          className="h-10 px-3.5 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-2 border border-transparent hover:border-destructive/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Rejeitar
          <span className="flex items-center gap-1">
            <span className="kbd">⌘</span>
            <span className="kbd"><Delete className="size-3 inline" /></span>
          </span>
        </button>

        {/* Regra 3: fundo cinza médio + cursor-not-allowed + tooltip quando bloqueado */}
        <div className="relative group">
          <button
            onClick={onApprove}
            disabled={!canApprove || isApproving || isRejecting}
            title={!canApprove ? 'Resolva as pendências acima para aprovar' : undefined}
            className="h-10 pl-4 pr-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.98] flex items-center gap-3
              enabled:bg-foreground enabled:text-background enabled:hover:bg-foreground/90 enabled:shadow-[0_4px_14px_-4px_oklch(0.2_0.01_260_/_0.4)]
              disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
            {isApproving ? 'Aprovando...' : 'Aprovar e enviar ao ERP'}
            <span className="flex items-center gap-1 pl-2 ml-1 border-l border-current/20">
              <span className="kbd !bg-current/10 !text-current/70 !border-current/20">⌘</span>
              <span className="kbd !bg-current/10 !text-current/70 !border-current/20">
                <CornerDownLeft className="size-3 inline" />
              </span>
            </span>
          </button>
          {/* Tooltip (Regra 3) */}
          {!canApprove && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-foreground text-background text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-card">
                Resolva as pendências acima para aprovar
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
