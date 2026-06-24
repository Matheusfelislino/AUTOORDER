export type OrderStatus =
  | "received"
  | "processing"
  | "ready"
  | "attention"
  | "failed";

export type Confidence = "high" | "mid" | "low";

export type OrderItem = {
  id: string;
  rawMention: string;
  productName: string;
  sku: string;
  unit: string;
  qty: number;
  unitPrice: number;
  confidence: Confidence;
  reason?: string;
  alternatives?: { sku: string; name: string }[];
};

export type Order = {
  id: string;
  number: string;
  customer: string;
  customerDetail: string;
  channel: "whatsapp";
  status: OrderStatus;
  receivedAt: string;
  aiConfidence: number; // 0-100
  message: string;
  audioSeconds?: number;
  transcript?: string;
  items: OrderItem[];
};
