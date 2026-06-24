import { Inbox, CheckCircle2, MessageSquare } from 'lucide-react'

export function EmptyQueue() {
  return (
    <div className="px-3 py-12 text-center">
      <div className="mx-auto size-10 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
        <Inbox className="size-4" />
      </div>
      <p className="text-[12px] font-medium">Nada nesta visão</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        Mude o filtro para ver outros pedidos.
      </p>
    </div>
  )
}

export function EmptyDetail() {
  return (
    <div className="flex-1 grid place-items-center">
      <div className="text-center max-w-sm">
        <div className="mx-auto size-12 rounded-full bg-confidence-high-bg grid place-items-center text-confidence-high mb-4">
          <CheckCircle2 className="size-5" />
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight">Inbox zero.</h3>
        <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-relaxed">
          Selecione um pedido para revisar.
          <br />
          Use <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> para navegar.
        </p>
      </div>
    </div>
  )
}

export function NoIntentState({ onArchive }: { onArchive?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16">
      <div className="size-12 rounded-full bg-muted grid place-items-center text-muted-foreground">
        <MessageSquare className="size-5" />
      </div>
      <div className="text-center">
        <p className="text-[13.5px] font-semibold tracking-tight">
          Nenhuma intenção de compra estruturada detectada.
        </p>
        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
          A mensagem não contém itens reconhecíveis pelo catálogo.
        </p>
      </div>
      {onArchive && (
        <button
          onClick={onArchive}
          className="h-8 px-4 rounded-lg text-[12px] font-medium border border-hairline text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Arquivar Mensagem
        </button>
      )}
    </div>
  )
}

export function FailedState({ onArchive }: { onArchive?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16">
      <div className="size-12 rounded-full bg-destructive/10 grid place-items-center text-destructive">
        <MessageSquare className="size-5" />
      </div>
      <div className="text-center">
        <p className="text-[13.5px] font-semibold tracking-tight">
          Nenhuma intenção de compra estruturada detectada.
        </p>
        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
          A IA não conseguiu extrair um pedido válido desta mensagem.
        </p>
      </div>
      {onArchive && (
        <button
          onClick={onArchive}
          className="h-8 px-4 rounded-lg text-[12px] font-medium border border-hairline text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Arquivar Mensagem
        </button>
      )}
    </div>
  )
}
