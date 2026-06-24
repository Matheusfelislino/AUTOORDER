import type { OrderStatus } from "./types";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; dot: string; pillBg: string; pillText: string; pillBorder: string }
> = {
  received: {
    label: "Recebido",
    dot: "bg-state-received",
    pillBg: "bg-muted",
    pillText: "text-muted-foreground",
    pillBorder: "border-hairline",
  },
  processing: {
    label: "Processando IA",
    dot: "bg-state-processing",
    pillBg: "bg-confidence-mid-bg",
    pillText: "text-confidence-mid",
    pillBorder: "border-confidence-mid/30",
  },
  ready: {
    label: "Pronto",
    dot: "bg-state-ready",
    pillBg: "bg-confidence-high-bg",
    pillText: "text-confidence-high",
    pillBorder: "border-confidence-high/30",
  },
  attention: {
    label: "Revisão",
    dot: "bg-state-attention",
    pillBg: "bg-confidence-low-bg",
    pillText: "text-confidence-low",
    pillBorder: "border-confidence-low/30",
  },
  failed: {
    label: "Falha",
    dot: "bg-state-failed",
    pillBg: "bg-destructive/10",
    pillText: "text-destructive",
    pillBorder: "border-destructive/30",
  },
};

export const BRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
