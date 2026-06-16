<div align="center">

# ⚡ AutoOrder

**Motor autônomo B2B de ingestão, tradução e orquestração de pedidos**

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-orange?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)](https://redis.io/)

> 🚧 **Em desenvolvimento ativo.** Este documento descreve a arquitetura e as decisões técnicas do projeto.

</div>

---

## O Problema

Distribuidoras e atacadistas B2B recebem pedidos em formatos caóticos áudios no WhatsApp, mensagens com abreviações, fotos de listas manuscritas. Um faturista gasta até **20 minutos** para decifrar e digitar manualmente um único pedido no ERP, gerando erros, horas extras e um teto duro de escalabilidade.

## A Proposta

O AutoOrder é um middleware inteligente que absorve mensagens desestruturadas, traduz a intenção do cliente via LLM e entrega um pedido validado e pronto para aprovação em menos de **30 segundos** sem forçar o cliente a mudar seu comportamento.

---

## Decisões de Arquitetura

### Monólito Modular Event-Driven

Optamos por um Monólito Modular em vez de microsserviços. Microsserviços resolvem problemas de escala organizacional (times de 50+ pessoas) e introduzem complexidade operacional que não se justifica aqui. O Monólito Modular oferece o mesmo isolamento de domínios com zero fricção de deploy complexidade onde ela importa (no domínio), não na infraestrutura.

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

| Tecnologia | Versão | Papel |
|---|---|---|
| Java | 21 | Runtime com Virtual Threads |
| Spring Boot | 3.5.0 | Framework principal |
| PostgreSQL | 16 | Persistência relacional (ACID) |
| RabbitMQ | 3.13 | Mensageria assíncrona |
| Redis | 7 | Idempotência na borda |
| Resilience4j | — | Retry + Circuit Breaker nas chamadas LLM |
| Groq API | — | Provedor LLM |

---

## Status

| Etapa | Status |
|---|---|
| Setup do projeto e infra local | ✅ Concluído |
| Schemas do banco e migrations | ✅ Concluído |
| Ingestion API idempotente | ✅ Concluído |
| Publicação de eventos no RabbitMQ | ✅ Concluído |
| Translation Context com LLM | ✅ Concluído |
| Catalog Context | ✅ Concluído |
| Order Context | ⏳ Pendente |
| Dashboard do faturista | ⏳ Pendente |
| Observabilidade e DLQs | ⏳ Pendente |

---

<div align="center">
  <sub>Construído por <a href="https://github.com/Matheusfelislino">Matheus Felis</a></sub>
</div>