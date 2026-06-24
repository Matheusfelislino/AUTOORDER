<div align="center">

# ⚡ AutoOrder

**Motor autônomo B2B de ingestão, tradução e orquestração de pedidos**

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-orange?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> ✅ **V1 selada e pronta para produção.**

</div>

---

## O Problema

Distribuidoras e atacadistas B2B recebem pedidos em formatos caóticos — áudios no WhatsApp, mensagens com abreviações, fotos de listas manuscritas. Um faturista gasta até **20 minutos** para decifrar e digitar manualmente um único pedido no ERP, gerando erros, horas extras e um teto duro de escalabilidade.

## A Proposta

O AutoOrder é um middleware inteligente que absorve mensagens desestruturadas, traduz a intenção do cliente via LLM e entrega um pedido validado e pronto para aprovação em menos de **30 segundos** — sem forçar o cliente a mudar seu comportamento.

---

## Fluxo de ponta a ponta

```
Cliente envia "Manda 3 cx de água com gás e 1 latão"
  → POST /api/v1/webhooks → 202 Accepted (< 100ms)
  → Redis garante idempotência na borda
  → PostgreSQL persiste a mensagem bruta
  → RabbitMQ recebe RawMessageReceivedEvent
  → Groq LLM traduz em < 800ms
  → RabbitMQ recebe OrderTranslatedEvent
  → Aliases resolvidos: "água com gás" → AGU-GAS-CX, "latão" → CRV-350-LTA
  → Order criado: status=PENDING, total=R$ 101,70
  → Dashboard exibe pedido em tempo real
  → Faturista pressiona Cmd+Enter → APPROVED
```

---

## Decisões de Arquitetura

### Monólito Modular Event-Driven

Optamos por um Monólito Modular em vez de microsserviços. Microsserviços resolvem problemas de escala organizacional (times de 50+ pessoas) e introduzem complexidade operacional que não se justifica aqui. O Monólito Modular oferece o mesmo isolamento de domínios com zero fricção de deploy — complexidade onde ela importa (no domínio), não na infraestrutura.

### Java 21 com Virtual Threads

As chamadas à API do LLM bloqueiam a thread por vários segundos. Virtual Threads permitem que isso aconteça sem esgotar o thread pool do servidor, garantindo concorrência massiva de forma nativa sem código reativo complexo.

### RabbitMQ para desacoplamento

A ingestão de webhooks precisa ser instantânea (`202 Accepted`). O processamento pela IA é lento e pode falhar. O RabbitMQ desacopla essas duas velocidades e garante que nenhuma mensagem seja perdida se o serviço de IA estiver indisponível.

### Redis para idempotência na borda

Webhooks podem ser entregues mais de uma vez. O Redis verifica em O(1) se uma mensagem já foi processada antes de qualquer operação no banco, evitando pedidos duplicados sem custo de latência.

---

## Bounded Contexts

O código é dividido em 4 módulos independentes que se comunicam exclusivamente via eventos no RabbitMQ. Nenhum módulo instancia classes de outro.

| Contexto | Responsabilidade | Limite |
|---|---|---|
| **Ingestion** | Recebe webhooks, garante idempotência, publica eventos | Não conhece pedidos ou SKUs |
| **Translation** | Consome eventos, chama o LLM, retorna JSON estruturado | Não acessa banco de dados |
| **Catalog** | Mantém produtos, SKUs, preços e estoque | Focado em leitura veloz |
| **Order** | Cria e gerencia o ciclo de vida do pedido | Único que pode aprovar e reservar estoque |

---

## Stack

### Backend

| Tecnologia | Versão | Papel |
|---|---|---|
| Java | 21 | Runtime com Virtual Threads |
| Spring Boot | 3.5.0 | Framework principal |
| PostgreSQL | 16 | Persistência relacional (ACID) — 3 schemas isolados |
| RabbitMQ | 3.13 | Mensageria assíncrona com DLQ |
| Redis | 7 | Idempotência na borda (O(1)) |
| Flyway | 11.7.2 | Migrations versionadas (V1–V12) |
| Resilience4j | — | Retry + Circuit Breaker nas chamadas LLM |
| Groq API | — | Provedor LLM (llama-3.3-70b-versatile) |

### Frontend

| Tecnologia | Versão | Papel |
|---|---|---|
| React + TypeScript | 18 / 5 | UI do dashboard do faturista |
| Vite | 8 | Build e dev server |
| Tailwind CSS | — | Design system com tokens OKLCH |
| TanStack Query | — | Cache, polling e mutations |
| Axios | — | Cliente HTTP com propagação de Trace ID |

---

## Como rodar localmente

### Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 22+
- Docker + Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/Matheusfelislino/AUTOORDER.git
cd AUTOORDER
```

### 2. Configure a chave do Groq

```bash
export GROQ_API_KEY="sua_chave_aqui"
```

### 3. Suba a infra

```bash
docker compose up -d
```

| Serviço | Porta local |
|---|---|
| PostgreSQL | 5433 |
| RabbitMQ AMQP | 5673 |
| RabbitMQ UI | 15673 |
| Redis | 6380 |

### 4. Suba o backend

```bash
mvn spring-boot:run
```

### 5. Suba o frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Acesse

- **Dashboard:** `http://localhost:3000`
- **API:** `http://localhost:8080/api/v1`
- **Health:** `http://localhost:8080/actuator/health`
- **RabbitMQ UI:** `http://localhost:15673` (`autoorder / autoorder`)

---

## Observabilidade

Cada requisição HTTP recebe um `X-Trace-Id` único que flui por todo o sistema:

```
TraceIdFilter (HTTP)
  → MDC do SLF4J
  → Headers AMQP do RabbitMQ
  → Workers de Translation e Order
```

Para rastrear uma requisição completa:

```bash
grep 'trace_id=abc-123' logs/autoorder.log
```

---

## Migrations

| Versão | Descrição |
|---|---|
| V1 | schema_ingestion |
| V2 | raw_messages |
| V3 | sender_id em raw_messages |
| V4 | sent_at em raw_messages |
| V5 | schema_catalog |
| V6 | products e clients |
| V7 | seed de produtos |
| V8 | product_aliases |
| V9 | schema_order |
| V10 | orders e order_items |
| V11 | expansão de aliases |
| V12 | version em orders (Optimistic Locking) |

---

## Status da V1

| Épico | Status |
|---|---|
| Setup do projeto e infra local | ✅ Concluído |
| Schemas do banco e migrations (V1–V12) | ✅ Concluído |
| Ingestion API idempotente | ✅ Concluído |
| Publicação de eventos no RabbitMQ | ✅ Concluído |
| Translation Context com LLM | ✅ Concluído |
| Catalog Context com aliases semânticos | ✅ Concluído |
| Order Context com resolução híbrida | ✅ Concluído |
| API REST do Dashboard | ✅ Concluído |
| Dashboard do Faturista (Frontend) | ✅ Concluído |
| Observabilidade — TraceIdFilter | ✅ Concluído |

---

<div align="center">
  <sub>Construído por <a href="https://github.com/Matheusfelislino">Matheus Felis</a></sub>
</div>