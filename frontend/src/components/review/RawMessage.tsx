import { Sparkles } from 'lucide-react'

interface Props {
  content: string | null
  customerId: string
  createdAt: string
}

export function RawMessage({ content, customerId, createdAt }: Props) {
  const time = new Date(createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const initials = customerId
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <section className="flex-1 min-w-0 border-r border-hairline bg-surface-2/40 overflow-y-auto">
      <div className="px-8 py-6 max-w-[560px]">
        <SectionLabel
          icon={
            <span className="size-4 rounded bg-whatsapp grid place-items-center text-background text-[8px] font-bold">
              W
            </span>
          }
          label="Fonte da Verdade"
          right={
            <span className="text-[10px] font-mono text-muted-foreground">WhatsApp</span>
          }
        />

        {/* Bubble */}
        <div className="relative">
          <div className="absolute -left-3 top-4 size-3 rotate-45 bg-surface border-l border-b border-hairline" />
          <div className="bg-surface rounded-2xl border border-hairline shadow-card p-4 text-pretty">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-5 rounded-full bg-whatsapp/15 text-confidence-high grid place-items-center text-[10px] font-bold shrink-0">
                {initials.charAt(0)}
              </div>
              <span className="text-[11px] font-medium truncate">{customerId}</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto shrink-0">{time}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-foreground/90">
              {content ?? <span className="italic text-muted-foreground">Sem conteúdo de texto</span>}
            </p>
          </div>
        </div>

        {/* AI interpretation placeholder */}
        <div className="mt-6 pl-4 border-l-2 border-hairline">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Sparkles className="size-3" />
            Interpretação da IA
          </p>
          <p className="text-[13px] italic text-muted-foreground leading-relaxed">
            Pedido processado automaticamente pelo AutoOrder AI.
          </p>
        </div>
      </div>
    </section>
  )
}

function SectionLabel({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode
  label: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon}
      <h2 className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-foreground">
        {label}
      </h2>
      <div className="flex-1 h-px bg-hairline" />
      {right}
    </div>
  )
}
