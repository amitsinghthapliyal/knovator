# Job Feed Importer – Artha Job Board Task

A production-ready **job ingestion system** that periodically imports jobs from multiple external RSS feeds, processes them asynchronously, and exposes import history via an admin UI.

This project demonstrates **scalable backend design**, **idempotent data ingestion**, and a **clean operational frontend**.

---

## ✨ Features

- ⏳ **Scheduled Imports** using cron
- 🌐 **Multi-feed RSS ingestion** (Jobicy + HigherEdJobs)
- 🔄 **Idempotent job processing** (no duplicates)
- 🧵 **Asynchronous processing** with Redis + BullMQ
- 📊 **Import history tracking** (new / updated / failed jobs)
- 🖥️ **Admin UI** with pagination & auto-refresh
- 🧪 **Validation & normalization** using Zod
- 📦 **MongoDB persistence**

---

## 🧠 High-Level Architecture

```
Cron Job
   ↓
Fetch RSS Feeds
   ↓
Normalize & Validate Jobs
   ↓
Queue (BullMQ + Redis)
   ↓
Worker
   ↓
MongoDB (Jobs + Import Logs)
   ↓
Admin UI (Next.js)
```

📄 See **architecture.md** for a detailed breakdown.

---

## 🌐 Supported Feeds

### Jobicy

- All jobs
- SMM (Full-time)
- Seller (France, Full-time)
- Design & Multimedia
- Data Science
- Copywriting
- Business
- Management

### HigherEdJobs

- Article feed (handled gracefully if empty)

All feeds are **config-driven** and processed uniformly.

---

## 🛠 Tech Stack

### Backend

- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- BullMQ + Redis
- node-cron
- Zod

### Frontend

- Next.js (App Router)
- Tailwind CSS
- Fetch API

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB
- Redis (≥ 6.2 recommended)

---

### Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/job_importer
REDIS_URL=redis://localhost:6379
```

Start backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 📡 API Reference

### Get Import History

```
GET /api/import-logs?page=1&limit=20
```

#### Response

```json
{
  "data": [
    {
      "fileName": "https://jobicy.com/?feed=job_feed",
      "totalFetched": 50,
      "totalImported": 50,
      "newJobs": 0,
      "updatedJobs": 50,
      "failedJobs": [],
      "timestamp": "2026-01-12T04:45:01.177Z"
    }
  ],
  "meta": {
    "total": 36,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

## 📊 Admin UI

- Paginated import history table
- Auto-refresh every 30 seconds
- Displays:
  - Feed URL
  - Run timestamp
  - Total fetched jobs
  - New / Updated / Failed counts

> **Note:**  
> “New” jobs are those **never seen before globally**.  
> Jobs appearing in multiple feeds are **deduplicated** using `externalId`.

---

## 🔑 Key Design Decisions

### Idempotency

- Jobs are uniquely identified by `externalId`
- Prevents duplicates across feeds and runs

### Queue-based Processing

- Cron never blocks on DB writes
- Scales easily with multiple workers

### Config-driven Feeds

- New feeds can be added without changing business logic

### Fault Tolerance

- Feed failures don’t break the pipeline
- Empty feeds handled gracefully

---

## 🧪 Validation

- All incoming jobs are validated using **Zod**
- Invalid jobs are skipped safely
- System remains stable even with malformed data

---

## 📈 Future Improvements

- Parallel feed processing
- Dead-letter queue
- Real-time UI updates (WebSockets)
- Feed health monitoring

---

## 👨‍💻 Author Notes

This project focuses on **correctness, scalability, and clarity** rather than over-engineering.  
The architecture mirrors real-world ingestion pipelines used in production systems.

---

## ✅ Assignment Checklist

- [x] Multi-feed ingestion
- [x] Cron-based scheduling
- [x] Queue + worker architecture
- [x] Import history tracking
- [x] Paginated API
- [x] Admin UI with auto-refresh
- [x] Clean architecture documentation
