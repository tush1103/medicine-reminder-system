# Medicine Reminder System

An event-driven microservices system that reminds pharmacy customers to take their medicine on time and to reorder before their supply runs out.

## What it does

1. A user places an order for a medicine (name, dosage frequency, days of supply, preferred dose times).
2. The system schedules reminders for every dose across the supply window.
3. When a dose is due, the user receives a reminder via **email (SendGrid)** and **SMS (Twilio)**.
4. When supply is nearly finished, the user gets a **refill alert**.

## Architecture

Three NestJS services communicating asynchronously through **Apache Kafka**, backed by **MySQL 8** for persistence. Everything runs locally via **Docker Compose** (Kafka, Zookeeper, MySQL).

```
                  ┌────────────────┐  order.placed   ┌────────────────────┐
   POST /orders → │  order-service │ ───────────────▶│  reminder-service  │
                  └────────┬───────┘                  └─────────┬──────────┘
                           │ writes                              │ writes
                           ▼                                     ▼
                        ┌───────────────── MySQL ─────────────────┐
                                                                  │
                                                       reminder.due │
                                                       refill.alert │
                                                                  ▼
                                                    ┌──────────────────────┐
                                                    │ notification-service │
                                                    │  SendGrid + Twilio   │
                                                    └──────────────────────┘
```

## Services

| Service                | Port | Responsibility                                                        |
| ---------------------- | ---- | --------------------------------------------------------------------- |
| `order-service`        | 3001 | Accept orders, persist them, emit `order.placed`                      |
| `reminder-service`     | 3002 | Consume `order.placed`, build dose schedule, emit due + refill events |
| `notification-service` | 3003 | Consume events, deliver via email (SendGrid) + SMS (Twilio)           |

## Tech Stack

- **NestJS** (TypeScript) for each service
- **Kafka** (via kafkajs) for inter-service events
- **MySQL 8** (via mysql2) for orders and reminder state
- **SendGrid** for email delivery
- **Twilio** for SMS delivery
- **Docker Compose** for local infra

## Getting Started

```bash
# 1. Bring up infra
docker-compose up -d

# 2. Configure env
cp .env.example .env
# fill in SendGrid + Twilio credentials

# 3. Run a service
cd services/order-service
npm install
npm run dev
```

## Data Model

- **`orders`** — user identity, medicine, dosage frequency (1–4/day), supply days, preferred dose times.
- **`reminders`** — per-order schedule with `next_reminder_at`, `supply_end_date`, `refill_alert_sent`, `is_active`.

## Status

- ✅ Infrastructure (docker-compose, MySQL schema)
- ✅ `order-service` — accepts orders and emits `order.placed`
- 🚧 `reminder-service` — scaffolded, implementation in progress
- 🚧 `notification-service` — scaffolded, implementation in progress
