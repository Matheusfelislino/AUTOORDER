import { createFileRoute } from "@tanstack/react-router";
import { AutoOrderConsole } from "@/components/autoorder/AutoOrderConsole";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoOrder — Central de Operações de IA" },
      {
        name: "description",
        content:
          "Transforme mensagens caóticas do WhatsApp em pedidos estruturados. A IA trabalha. Você audita.",
      },
      { property: "og:title", content: "AutoOrder — Central de Operações de IA" },
      {
        property: "og:description",
        content: "SaaS B2B com IA para distribuidoras, atacadistas e indústrias.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <AutoOrderConsole />;
}
