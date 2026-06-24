import { useEffect, useMemo, useState } from "react";
import {
  Command,
  Search,
  Filter,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
  Mic,
  Play,
  CornerDownLeft,
  Delete,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  ArrowUpRight,
  Pencil,
  Hash,
  Building2,
  Plug,
} from "lucide-react";

import { ORDERS } from "./data";
import type { Order, OrderItem } from "./types";
import { BRL, STATUS_META } from "./status";

const STATUS_ICON = {
  received: Inbox,
  processing: Loader2,
  ready: CheckCircle2,
  attention: AlertTriangle,
  failed: XCircle,
} as const;

export function AutoOrderConsole() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [activeId, setActiveId] = useState<string>(orders[0]?.id ?? "");
  const [filter, setFilter] = useState<"all" | "attention" | "ready">("all");
  const [collapsed, setCollapsed] = useState(false);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "attention")
      return orders.filter((o) => o.status === "attention" || o.status === "failed");
    return orders.filter((o) => o.status === "ready");
  }, [orders, filter]);

  useEffect(() => {
    if (!visible.find((o) => o.id === activeId) && visible[0]) {
      setActiveId(visible[0].id);
    }
  }, [visible, activeId]);

  const active = orders.find((o) => o.id === activeId);

  function move(delta: number) {
    const idx = visible.findIndex((o) => o.id === activeId);
    const next = visible[Math.max(0, Math.min(visible.length - 1, idx + delta))];
    if (next) setActiveId(next.id);
  }

  function approve() {
    if (!active) return;
    setOrders((prev) => prev.filter((o) => o.id !== active.id));
  }
  function reject() {
    if (!active) return;
    setOrders((prev) => prev.filter((o) => o.id !== active.id));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        approve();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Backspace") {
        e.preventDefault();
        reject();
      } else if (e.key === "[") {
        setCollapsed((c) => !c);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const counts = useMemo(
    () => ({
      total: orders.length,
      attention: orders.filter((o) => o.status === "attention" || o.status === "failed").length,
      ready: orders.filter((o) => o.status === "ready").length,
      processing: orders.filter((o) => o.status === "processing" || o.status === "received").length,
    }),
    [orders],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-0 -ml-px" : "w-[340px]"
        } shrink-0 border-r border-hairline bg-surface-2/40 flex flex-col transition-[width] duration-200`}
        style={{ overflow: "hidden" }}
      >
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="relative size-6 rounded-md bg-foreground text-background grid place-items-center">
              <Sparkles className="size-3.5" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold tracking-tight">AutoOrder</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground mt-0.5">
                AI Operations
              </span>
            </div>
          </div>
          <button
            className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
            title="Recolher  ["
            onClick={() => setCollapsed(true)}
          >
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <label className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-surface border border-hairline text-[12px] text-muted-foreground focus-within:ring-2 focus-within:ring-foreground/10">
            <Search className="size-3.5" />
            <input
              className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground/70 text-foreground"
              placeholder="Buscar cliente, SKU, mensagem…"
            />
            <span className="kbd">⌘K</span>
          </label>
        </div>

        {/* Filter tabs */}
        <div className="px-3 pb-2 flex items-center gap-1">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
            Tudo <span className="text-muted-foreground/60 ml-1">{counts.total}</span>
          </FilterPill>
          <FilterPill
            active={filter === "attention"}
            tone="attention"
            onClick={() => setFilter("attention")}
          >
            Revisão <span className="text-confidence-low/70 ml-1">{counts.attention}</span>
          </FilterPill>
          <FilterPill active={filter === "ready"} tone="ready" onClick={() => setFilter("ready")}>
            Prontos <span className="text-confidence-high/70 ml-1">{counts.ready}</span>
          </FilterPill>
          <button className="ml-auto size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
            <Filter className="size-3.5" />
          </button>
        </div>

        {/* Queue */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3 pt-1">
          {visible.length === 0 ? (
            <EmptyInbox />
          ) : (
            <ul className="space-y-px">
              {visible.map((o) => (
                <QueueItem
                  key={o.id}
                  order={o}
                  active={o.id === activeId}
                  onClick={() => setActiveId(o.id)}
                />
              ))}
            </ul>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-hairline px-3 py-2.5 flex items-center gap-2.5">
          <div className="size-7 rounded-full bg-foreground/90 text-background grid place-items-center text-[10px] font-semibold">
            RM
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-[12px] font-medium">Ricardo Moura</p>
            <p className="text-[10px] text-muted-foreground">Faturista · Distribuidora SP</p>
          </div>
          <button className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
            <Bell className="size-3.5" />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        {/* Top context bar */}
        <header className="h-14 shrink-0 border-b border-hairline bg-background/80 backdrop-blur flex items-center px-5 gap-5">
          {collapsed && (
            <button
              className="size-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground"
              onClick={() => setCollapsed(false)}
            >
              <PanelLeftOpen className="size-3.5" />
            </button>
          )}
          {active ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="size-3.5 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight truncate">
                    {active.customer}
                  </p>
                  <p className="text-[10.5px] font-mono text-muted-foreground tracking-tight truncate">
                    {active.customerDetail}
                  </p>
                </div>
              </div>
              <div className="h-7 w-px bg-hairline" />
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <Hash className="size-3" />
                {active.number}
                <span className="opacity-50 mx-1">·</span>
                <span>{active.receivedAt}</span>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
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
            <div className="text-[12px] text-muted-foreground">Inbox zero</div>
          )}
        </header>

        {/* Split */}
        {active ? (
          <div className="flex-1 min-h-0 flex">
            <SourcePanel order={active} />
            <AuditPanel order={active} />
          </div>
        ) : (
          <ZeroState />
        )}

        {/* Action bar */}
        {active && <ActionBar order={active} onApprove={approve} onReject={reject} />}
      </main>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FilterPill({
  children,
  active,
  tone,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  tone?: "attention" | "ready";
  onClick: () => void;
}) {
  const base =
    "h-7 px-2.5 rounded-md text-[11.5px] font-medium transition-colors flex items-center";
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`${base} bg-foreground text-background shadow-card`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} text-muted-foreground hover:text-foreground hover:bg-muted`}
    >
      {children}
    </button>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "ready" | "attention";
}) {
  const cls =
    tone === "ready"
      ? "border-confidence-high/25 bg-confidence-high-bg text-confidence-high"
      : tone === "attention"
      ? "border-confidence-low/25 bg-confidence-low-bg text-confidence-low"
      : "border-hairline bg-surface text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md border ${cls} text-[10.5px] font-mono uppercase tracking-tight`}
    >
      {children}
    </span>
  );
}

function QueueItem({
  order,
  active,
  onClick,
}: {
  order: Order;
  active: boolean;
  onClick: () => void;
}) {
  const meta = STATUS_META[order.status];
  const Icon = STATUS_ICON[order.status];
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left p-2.5 rounded-md border transition-colors group ${
          active
            ? "bg-surface border-hairline shadow-card animate-slide-in"
            : "border-transparent hover:bg-surface/60 hover:border-hairline/60"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`size-1.5 rounded-full ${meta.dot}`} />
          <span className="text-[12.5px] font-semibold tracking-tight truncate">
            {order.customer}
          </span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground shrink-0">
            {order.receivedAt}
          </span>
        </div>
        <p className="text-[11.5px] text-muted-foreground line-clamp-1 italic pl-3.5">
          "{order.message}"
        </p>
        <div className="flex items-center gap-2 mt-2 pl-3.5">
          <span
            className={`inline-flex items-center gap-1 h-4 px-1.5 rounded text-[9.5px] font-mono uppercase tracking-tight border ${meta.pillBg} ${meta.pillText} ${meta.pillBorder}`}
          >
            <Icon
              className={`size-2.5 ${order.status === "processing" ? "animate-spin" : ""}`}
              strokeWidth={2.4}
            />
            {meta.label}
          </span>
          {order.aiConfidence > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground">
              IA {order.aiConfidence}%
            </span>
          )}
        </div>
      </button>
    </li>
  );
}

function SourcePanel({ order }: { order: Order }) {
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
            <span className="text-[10px] font-mono text-muted-foreground">
              WhatsApp · 5511 98421-0090
            </span>
          }
        />

        {/* Bubble */}
        <div className="relative">
          <div className="absolute -left-3 top-4 size-3 rotate-45 bg-surface border-l border-b border-hairline" />
          <div className="bg-surface rounded-2xl border border-hairline shadow-card p-4 text-pretty">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-5 rounded-full bg-whatsapp/15 text-confidence-high grid place-items-center text-[10px] font-bold">
                J
              </div>
              <span className="text-[11px] font-medium">João — Silva Compras</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">10:42</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-foreground/90">{order.message}</p>

            {order.audioSeconds && (
              <div className="mt-3 flex items-center gap-3 p-2.5 rounded-lg bg-muted/60">
                <button className="size-7 rounded-full bg-foreground text-background grid place-items-center shrink-0">
                  <Play className="size-3 translate-x-px" fill="currentColor" />
                </button>
                <div className="flex-1 h-6 flex items-center gap-[2px]">
                  {Array.from({ length: 38 }).map((_, i) => {
                    const h = [3, 5, 4, 7, 9, 6, 11, 8, 4, 6, 12, 10, 7, 5, 3, 4, 8, 11, 9, 6][
                      i % 20
                    ];
                    const filled = i < 13;
                    return (
                      <span
                        key={i}
                        className={`w-[2px] rounded-full ${
                          filled ? "bg-foreground" : "bg-muted-foreground/30"
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                  0:0{order.audioSeconds % 10 === order.audioSeconds ? "0" : ""}
                  {order.audioSeconds}
                </span>
                <Mic className="size-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Transcription */}
        {order.transcript && (
          <div className="mt-6 pl-4 border-l-2 border-hairline">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Sparkles className="size-3" />
              Interpretação da IA
            </p>
            <p className="text-[13px] italic text-muted-foreground leading-relaxed">
              "{order.transcript}"
            </p>
          </div>
        )}

        {/* Historical context */}
        <div className="mt-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-2">
            Contexto do cliente
          </p>
          <ul className="space-y-1.5 text-[12px] text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/40" />
              Compra média:{" "}
              <span className="text-foreground font-mono">{BRL(1840.5)}</span> / semana
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/40" />
              Última compra: <span className="text-foreground">há 7 dias</span> · Skol Latão 350ml
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/40" />
              Limite de crédito:{" "}
              <span className="text-foreground font-mono">{BRL(8000)}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function AuditPanel({ order }: { order: Order }) {
  const high = order.items.filter((i) => i.confidence === "high");
  const mid = order.items.filter((i) => i.confidence === "mid");
  const low = order.items.filter((i) => i.confidence === "low");

  return (
    <section className="w-[520px] shrink-0 overflow-y-auto bg-background">
      <div className="px-7 py-6">
        <SectionLabel
          icon={<Sparkles className="size-3.5 text-foreground" />}
          label="Auditoria da IA"
          right={
            <div className="flex items-center gap-1.5">
              {low.length > 0 && (
                <ConfidenceTag tone="low">{low.length} revisão</ConfidenceTag>
              )}
              {mid.length > 0 && (
                <ConfidenceTag tone="mid">{mid.length} média</ConfidenceTag>
              )}
              {high.length > 0 && (
                <ConfidenceTag tone="high">{high.length} alta</ConfidenceTag>
              )}
            </div>
          }
        />

        {/* Items: low first (surface friction), then high */}
        <div className="space-y-2">
          {low.map((i) => (
            <LowConfidenceItem key={i.id} item={i} />
          ))}
          {mid.map((i) => (
            <MidConfidenceItem key={i.id} item={i} />
          ))}
          {high.map((i) => (
            <HighConfidenceItem key={i.id} item={i} />
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-hairline space-y-1.5 text-[12px]">
          <Row label="Subtotal" value={BRL(sum(order.items))} muted />
          <Row label="Impostos (estimativa)" value={BRL(sum(order.items) * 0.04)} muted />
          <Row
            label="Total"
            value={BRL(sum(order.items) * 1.04)}
            bold
          />
        </div>
      </div>
    </section>
  );
}

function sum(items: OrderItem[]) {
  return items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span
        className={`font-mono tabular-nums ${
          bold ? "text-foreground font-semibold text-[14px]" : ""
        } ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function ConfidenceTag({
  tone,
  children,
}: {
  tone: "high" | "mid" | "low";
  children: React.ReactNode;
}) {
  const cls =
    tone === "high"
      ? "bg-confidence-high-bg text-confidence-high border-confidence-high/20"
      : tone === "mid"
      ? "bg-confidence-mid-bg text-confidence-mid border-confidence-mid/20"
      : "bg-confidence-low-bg text-confidence-low border-confidence-low/20";
  return (
    <span
      className={`text-[9.5px] font-mono uppercase tracking-tight px-1.5 py-0.5 rounded border ${cls}`}
    >
      {children}
    </span>
  );
}

function HighConfidenceItem({ item }: { item: OrderItem }) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-hairline bg-surface hover:border-foreground/15 transition-colors">
      <span className="size-1.5 rounded-full bg-confidence-high shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium tracking-tight truncate">{item.productName}</p>
        <p className="text-[10.5px] font-mono text-muted-foreground tracking-tight">
          SKU {item.sku} · {BRL(item.unitPrice)} / {item.unit.toLowerCase()}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[13px] font-mono font-medium tabular-nums">
          {item.qty} <span className="text-muted-foreground">{item.unit}</span>
        </p>
        <p className="text-[10.5px] font-mono text-muted-foreground tabular-nums">
          {BRL(item.qty * item.unitPrice)}
        </p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 size-6 grid place-items-center rounded text-muted-foreground hover:bg-muted">
        <Pencil className="size-3" />
      </button>
    </div>
  );
}

function MidConfidenceItem({ item }: { item: OrderItem }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2.5 rounded-lg border border-confidence-mid/20 bg-confidence-mid-bg/40">
      <div className="flex items-center gap-3">
        <span className="size-1.5 rounded-full bg-confidence-mid shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium tracking-tight">{item.productName}</p>
          <p className="text-[10.5px] font-mono text-confidence-mid/90 tracking-tight">
            {item.reason}
          </p>
        </div>
        <p className="text-[13px] font-mono font-medium tabular-nums shrink-0">
          {item.qty} <span className="text-muted-foreground">{item.unit}</span>
        </p>
      </div>
    </div>
  );
}

function LowConfidenceItem({ item }: { item: OrderItem }) {
  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 rounded-lg border border-confidence-low/30 bg-confidence-low-bg/60 ring-1 ring-confidence-low/10 shadow-[0_8px_24px_-16px_oklch(0.68_0.16_70_/_0.4)] animate-slide-in">
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
            "{item.rawMention}"
          </p>
          <p className="text-[11.5px] text-muted-foreground mt-0.5">{item.reason}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="inline-flex items-center bg-surface border border-hairline rounded overflow-hidden">
            <input
              defaultValue={item.qty}
              className="w-10 h-6 text-right px-1.5 text-[12px] font-mono tabular-nums bg-transparent outline-none"
            />
            <span className="text-[10px] font-mono text-muted-foreground pr-1.5">
              {item.unit}
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-confidence-low/80 mb-1.5">
          Sugestões da IA
        </p>
        <div className="flex flex-wrap gap-1.5">
          {item.alternatives?.map((alt, idx) => (
            <button
              key={alt.sku}
              className={`text-[11px] h-7 px-2.5 rounded-md border transition-colors flex items-center gap-1.5 ${
                idx === 0
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface border-hairline hover:border-foreground/30 text-foreground"
              }`}
            >
              {idx === 0 && <CheckCircle2 className="size-3" strokeWidth={2.5} />}
              {alt.name}
              <span
                className={`font-mono text-[9.5px] ${
                  idx === 0 ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                #{alt.sku}
              </span>
            </button>
          ))}
          <button className="text-[11px] h-7 px-2 rounded-md border border-dashed border-hairline text-muted-foreground hover:text-foreground hover:border-foreground/30 flex items-center gap-1">
            <Search className="size-3" />
            Buscar outro
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
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
  );
}

function ActionBar({
  order,
  onApprove,
  onReject,
}: {
  order: Order;
  onApprove: () => void;
  onReject: () => void;
}) {
  const total = sum(order.items) * 1.04;
  const lowCount = order.items.filter((i) => i.confidence === "low").length;
  const canApprove = lowCount === 0;
  return (
    <footer className="h-[72px] shrink-0 border-t border-hairline bg-background flex items-center px-6 gap-5">
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
          Total do pedido
        </span>
        <span className="text-[22px] font-semibold tracking-tight font-mono tabular-nums mt-1.5">
          {BRL(total)}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground ml-2">
        <Command className="size-3" />
        <span>Atalhos:</span>
        <span className="kbd">↑</span>
        <span className="kbd">↓</span>
        <span>navegar</span>
      </div>

      {!canApprove && (
        <div className="ml-auto mr-2 flex items-center gap-2 text-[11.5px] text-confidence-low">
          <AlertTriangle className="size-3.5" />
          {lowCount} {lowCount === 1 ? "item precisa" : "itens precisam"} de revisão antes de
          aprovar
        </div>
      )}

      <div className={`flex items-center gap-2.5 ${canApprove ? "ml-auto" : ""}`}>
        <button
          onClick={onReject}
          className="h-10 px-3.5 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-2 border border-transparent hover:border-destructive/20"
        >
          Rejeitar
          <span className="flex items-center gap-1">
            <span className="kbd">⌘</span>
            <span className="kbd">
              <Delete className="size-3 inline" />
            </span>
          </span>
        </button>
        <button
          onClick={onApprove}
          disabled={!canApprove}
          className="h-10 pl-4 pr-2 rounded-lg text-[13px] font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 shadow-[0_4px_14px_-4px_oklch(0.2_0.01_260_/_0.4)]"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
          Aprovar e enviar ao ERP
          <span className="flex items-center gap-1 pl-2 ml-1 border-l border-background/20">
            <span className="kbd !bg-background/10 !text-background/80 !border-background/20">
              ⌘
            </span>
            <span className="kbd !bg-background/10 !text-background/80 !border-background/20">
              <CornerDownLeft className="size-3 inline" />
            </span>
          </span>
        </button>
      </div>
    </footer>
  );
}

function EmptyInbox() {
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
  );
}

function ZeroState() {
  return (
    <div className="flex-1 grid place-items-center bg-background">
      <div className="text-center max-w-sm">
        <div className="mx-auto size-12 rounded-full bg-confidence-high-bg grid place-items-center text-confidence-high mb-4">
          <CheckCircle2 className="size-5" />
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight">Inbox zero.</h3>
        <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-relaxed">
          Todos os pedidos foram revisados e enviados ao ERP.
          <br />
          Bom trabalho.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-5 text-[12px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ChevronDown className="size-3" />
          Recarregar fila
        </button>
      </div>
    </div>
  );
}
