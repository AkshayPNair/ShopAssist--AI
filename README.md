# ShopAssist AI – Support Chatbot 

This project is a simple but production-minded AI support chatbot for a fictional e-commerce store.

It demonstrates:
- A clean, end-to-end chat experience
- Robust backend architecture in TypeScript
- Safe, scoped LLM usage
- Thoughtful handling of edge cases and failures

This repository focuses on correctness, robustness, and code quality.

---

## ✨ Features

### Chat UI (Frontend)
- Scrollable chat interface
- Clear distinction between user and support (AI) messages
- Input box + send button
- Enter key sends message
- Auto-scrolls to latest message
- Disabled send button while request is in flight
- Character limit with counter
- Graceful display of AI/service errors

---

### Backend API
- Built with **TypeScript + Express**
- Clean Architecture (use-cases, domain, infrastructure, interfaces)
- REST endpoints:
  - `POST /api/chat/message`
  - `GET /api/chat/history/:sessionId`
- Messages persisted to PostgreSQL
- Conversations grouped via `sessionId`

---

### LLM Integration

The application supports both **local** and **hosted** inference modes.

#### Local Development
- Uses **Ollama (local LLM)** with the `mistral` model
- No external API dependency
- Fully reproducible offline
- Ideal for local testing and iteration

#### Hosted Deployment
- Uses **OpenRouter** with the `mistral-small-3.1-24b-instruct (free)` model
- Same prompt logic and behavior as the local version
- Keeps deployment lightweight and portable
- LLM access is fully abstracted behind `ILLMService`

> Note: When using the OpenRouter free tier, rate limiting (HTTP 429) may occur under repeated requests. This is a service-side constraint and does not affect the application’s core logic, validation, or architecture.

---

### FAQ / Domain Knowledge
The AI is seeded with store knowledge:
- Shipping policy
- Return & refund policy
- Support hours

The AI only answers store-related questions and politely declines unrelated queries.

---

### Robustness & Safety
- Empty messages rejected
- Very long messages rejected with clear validation errors
- Backend never crashes on bad input
- LLM failures surface as friendly messages in the UI
- No secrets committed to the repo
- Redis used for caching conversation history

---

## 🏗️ Architecture Overview

### Backend – Clean Architecture

```text
src/
├── application/
│   ├── use-cases/
│   ├── error/
│   └── constants/
├── domain/
│   ├── entities/
│   ├── interfaces/
│   └── dtos/
├── infrastructure/
│   ├── database/
│   │   ├── repositories/
│   │   └── postgres.ts
│   ├── external/
│   │   ├── services/ (Ollama, Redis)
│   │   └── cache/
├── interfaces/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
├── config/
├── utils/
└── server.ts
```

**Key ideas:**
- Business logic lives in use-cases
- Repositories and external services are injected via interfaces
- LLM integration is fully encapsulated
- Easy to extend (e.g. WhatsApp, order lookup, human handoff)

---

### Frontend 

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── types/
└── public/
```

### Frontend
- Built with **React + TypeScript**
- API calls isolated in services
- Chat state handled via a custom hook (`useChat`)
- UI components remain dumb and predictable

---

## 🧠 Design Decisions (Important)

### 1. Scoped AI (Not a General Chatbot)
The AI is intentionally limited to store support.

If the user asks:
- Random input → AI asks for clarification
- Unrelated questions → AI politely explains its scope
- Store questions → AI answers using FAQ + context

This avoids hallucination and mirrors real production support bots.

---

### 2. FAQ + AI (Not “Just FAQ”)
The FAQ provides knowledge, while the AI provides:
- Natural language understanding
- Context across messages
- Polite redirection and clarification
- Graceful handling of weird input

The AI acts as a conversational interface to business rules, not a general assistant.

---

### 3. Error Handling Philosophy
- Graceful failure > silent failure
- Users always get feedback
- LLM/API errors never crash the backend
- UI reflects service state clearly

---

## 🔧 How to Run Locally

### Prerequisites
- Node.js ≥ 18
- Docker
- PostgreSQL
- Redis
- Ollama

---

## 🐘 Database Setup (PostgreSQL)

### Run PostgreSQL via Docker
```bash
docker run -d \
  --name postgres17 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=spur_ai \
  -p 5432:5432 \
  postgres:17
```

### Tables

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender TEXT CHECK (sender IN ('user', 'ai')),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
## 🔴 Redis Setup (Local)

Redis is used locally for caching conversation history to reduce repeated database reads.

```bash
# Arch / Manjaro
sudo pacman -S redis
# Ubuntu / Debian
sudo apt install redis-server
```
### Start Redis locally
``` bash
sudo systemctl start redis
sudo systemctl enable redis
```
### Verify Redis is running
```bash
redis-cli ping
# Expected output: PONG
```

## 🤖 LLM Setup (Ollama)

### Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
### Pull Model
```bash
ollama pull mistral
```

## 🔐 Environment Variables

### Backend(src/config/.env)
```bash
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=spur_ai

REDIS_URL=redis://localhost:6379
OLLAMA_BASE_URL=http://localhost:11434
```
No secrets are hard-coded.

### Frontend(.env)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## ▶️ Run Backend
```bash
cd backend
npm install
npm run dev
```
## ▶️ Run Frontend
```bash
cd frontend
npm install
npm run dev
```
## 📡 API Overview

### Send Message

`POST /api/chat/message`

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional"
}
```
### Response
```bash
{
  "reply": "...",
  "sessionId": "uuid"
}
```

### Fetch History
`GET /api/chat/history/:sessionId`

---

## ☁️ Hosted Deployment (EC2)

This project is deployed on an AWS EC2 instance with the following setup:

### Frontend
- Built using **React + TypeScript**
- Served via **Nginx**
- Static build served from `/var/www`
- HTTPS enabled using **Let’s Encrypt**

### Backend
- Built with **Node.js + TypeScript**
- Runs via **PM2** for process management
- Exposed behind **Nginx reverse proxy**
- HTTPS enabled using **Let’s Encrypt**

### Infrastructure
- **PostgreSQL** running in Docker
- **Redis** running locally on the EC2 instance
- Environment variables managed via `.env`
- No secrets committed to the repository

### Process Management
- Backend automatically restarts on failure via PM2
- Docker containers persist independently of SSH sessions

---

### Hosted Environment (EC2)

```bash
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=spur_ai

REDIS_URL=redis://localhost:6379

# Hosted inference
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your_key_here
```

## 🧪 Edge Cases Handled

- **Empty input** → validation error
- **Over-long input** → validation error
- **LLM unavailable** → friendly fallback message
- **Page reload** → conversation restored via `sessionId`
- **Random / unclear input** → polite clarification request
- **Unrelated questions** → polite scope explanation

## ⚖️ Trade-offs & “If I Had More Time”

### Trade-offs
- **FAQ is hardcoded** (simple, explicit, safe)
- **No auth** (out of scope per task)
- **Local LLM for development, hosted LLM for deployment** (balances reproducibility and portability)
- **Redis used locally** for simplicity

### If I had more time
- Store FAQs in DB
- Add order-specific lookups
- Stream responses
- Human handoff
- Observability (logs/metrics)
- Pagination for very long histories


## 🔍 Notes & Minor Improvements

The following are intentional simplifications made to keep the scope focused for this machine task:

- **Database migrations**  
  Manual SQL is used instead of a migrations tool (e.g. Prisma/TypeORM migrations) for simplicity and clarity.

- **Redis caching**  
  Conversation history is cached in Redis with a TTL of **10 minutes (600 seconds)** to reduce repeated database reads while keeping data reasonably fresh.

- **Environment configuration**  
  Environment variables are documented directly in this README and loaded via `.env` files locally.  
  No secrets are committed to the repository.

These choices do **not** affect correctness or robustness and were made to keep the project minimal, readable, and aligned with the task requirements.


## 🚀 Deployment Note

The hosted version preserves the exact same logic and architecture as the local version.  
The only change is the LLM provider (Ollama → OpenRouter), which is fully abstracted behind an interface.

All validation, error handling, caching, and conversation persistence behave identically in both environments.


## ✅ Summary

This project focuses on:
- Correctness over over-engineering
- Realistic product behavior
- Clean separation of concerns
- Safe and scoped AI usage

It is intentionally small, robust, and extensible — exactly what you would expect from a production-ready foundation.
