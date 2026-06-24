import { useState, useEffect, useMemo } from 'react'
import { Building2, Hash, Plug, PanelLeftOpen } from 'lucide-react'
import type { OrderDetail } from '../../types/order'
import { RawMessage } from '../review/RawMessage'
import { ConfidenceTable } from '../review/ConfidenceTable'
import { ActionBar } from '../review/ActionBar'
import { ContextBarSkeleton, ProcessingState } from '../shared/Skeleton'
import { EmptyDetail, NoIntentState, FailedState } from '../shared/EmptyState'

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours} h`
  return `há ${Math.floor(hours / 24)} d`
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: 'ready' }) {
  const cls =
    tone === 'ready'
      ? 'border-confidence-high/25 bg-confidence-high-bg text-confidence-high'
      : 'border-hairline bg-surface text-muted-foreground'
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md border ${cls} text-[10.5px] font-mono uppercase tracking-tight`}
    >
      {children}
    </span>
  )
}

interface Props {
  order: OrderDetail | undefined
  isLoading: boolean
  onApprove: () => void
  onReject: () => void
  isApproving: boolean
  isRejecting: boolean
  isSidebarCollapsed: boolean
  onExpandSidebar: () => void
}

export function DetailPanel({
  order,
  isLoading,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  isSidebarCollapsed,
  onExpandSidebar,
}: Props) {
  const [resolvedItems, setResolvedItems] = useState<Set<number>>(new Set())
  const [manualPrices, setManualPrices] = useState<Map<number, number>>(new Map())
  const [flashKey, setFlashKey] = useState(0)

  // Regra 2: reset optimistic state when order changes
  useEffect(() => {
    setResolvedItems(new Set())
    setManualPrices(new Map())
  }, [order?.id])

  const handleResolveItem = (idx: number, _sku?: string, _name?: string, price?: number) => {
    setResolvedItems(prev => new Set([...prev, idx]))
    if (price != null) {
      setManualPrices(prev => new Map([...prev, [idx, price]]))
    }
    setFlashKey(k => k + 1) // Regra 2: trigger totals flash
  }

  const { canApprove, pendingCount, displayTotal, isActionable } = useMemo(() => {
    if (!order) return { canApprove: false, pendingCount: 0, displayTotal: 0, isActionable: false }

    const pendingIndices = order.items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.status === 'PENDING_REVIEW')
      .map(({ idx }) => idx)

    const stillPending = pendingIndices.filter(idx => !resolvedItems.has(idx))

    const resolvedTotal = order.items.reduce((acc, item, idx) => {
      const isResolved = item.status === 'RESOLVED' || resolvedItems.has(idx)
      if (!isResolved) return acc
      const manualPrice = manualPrices.get(idx)
      const itemTotal = manualPrice != null
        ? manualPrice * item.quantity
        : (item.subtotal ?? (item.unitPrice != null ? item.unitPrice * item.quantity : 0))
      return acc + itemTotal
    }, 0)

    const isActionable = order.status === 'PENDING' || order.status === 'PENDING_REVIEW'
    const allPendingResolved = stillPending.length === 0
    const canApprove = isActionable && allPendingResolved

    return {
      canApprove,
      pendingCount: stillPending.length,
      displayTotal: resolvedTotal * 1.04,
      isActionable,
    }
  }, [order, resolvedItems, manualPrices])

  // Regra 1: determinar o estado de renderização do painel de itens
  const hasItems = (order?.items.length ?? 0) > 0
  const isProcessing = !hasItems && order?.status === 'PENDING' && !isLoading
  const isFailed = order?.status === 'REJECTED'
  const isNoIntent = !hasItems && !isFailed && !isLoading && !!order

  // Regra 1: ActionBar só renderiza se houver itens E o pedido for acionável
  const showActionBar = isActionable && hasItems

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">
      {/* Context bar */}
      <header className="h-14 shrink-0 border-b border-hairline bg-background/80 backdrop-blur flex items-center px-5 gap-5">
        {isSidebarCollapsed && (
          <button
            className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground shrink-0"
            onClick={onExpandSidebar}
          >
            <PanelLeftOpen className="size-3.5" />
          </button>
        )}

        {isLoading ? (
          <ContextBarSkeleton />
        ) : order ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight truncate">{order.customerId}</p>
                <p className="text-[10.5px] font-mono text-muted-foreground tracking-tight truncate">
                  {order.messageId}
                </p>
              </div>
            </div>
            <div className="h-7 w-px bg-hairline shrink-0" />
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <Hash className="size-3" />
              {order.messageId}
              <span className="opacity-50 mx-1">·</span>
              <span>{timeAgo(order.createdAt)}</span>
            </div>
            <div className="ml-auto flex items-center gap-2.5 shrink-0">
              <Pill tone="ready">
                <span className="size-1.5 rounded-full bg-confidence-high" />
                ERP Totvs · conectado
              </Pill>
              <Pill>
                <Plug className="size-3" />
                v12.1
              </Pill>
            </div>
          </>
        ) : (
          <div className="text-[12px] text-muted-foreground">Nenhum pedido selecionado</div>
        )}
      </header>

      {/* Main content */}
      {!order && !isLoading ? (
        <EmptyDetail />
      ) : isLoading ? (
        <div className="flex-1 flex">
          <div className="flex-1 border-r border-hairline" />
          <div className="w-[520px] shrink-0" />
        </div>
      ) : isFailed ? (
        /* Regra 1: estado FAILED — oculta tabela e rodapé */
        <FailedState />
      ) : isNoIntent || isProcessing ? (
        /* Regra 1: sem intenção de compra / processando — oculta tabela e rodapé */
        isProcessing ? <ProcessingState /> : <NoIntentState />
      ) : (
        /* Estado normal: SourcePanel + AuditPanel */
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <RawMessage
            content={order!.rawContent}
            customerId={order!.customerId}
            createdAt={order!.createdAt}
          />
          <ConfidenceTable
            items={order!.items}
            resolvedItems={resolvedItems}
            onResolveItem={handleResolveItem}
            flashKey={flashKey}
          />
        </div>
      )}

      {/* Regra 3: rodapé só renderiza no DOM se houver itens e status acionável */}
      {showActionBar && order && (
        <ActionBar
          total={displayTotal}
          canApprove={canApprove}
          pendingCount={pendingCount}
          flashKey={flashKey}
          onApprove={onApprove}
          onReject={onReject}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}
    </main>
  )
}
