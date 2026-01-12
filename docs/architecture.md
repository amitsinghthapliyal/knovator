# Architecture Overview

## High-Level Overview

This system is a **multi-feed job ingestion pipeline** designed to periodically fetch jobs from external RSS feeds, normalize and validate them, process them asynchronously using a queue, and persist them in a MongoDB database with full import history tracking.

The architecture follows a **cron → fetch → normalize → queue → worker → database** flow and is intentionally designed to be **idempotent, scalable, and fault-tolerant**.

---

## System Components

### 1. Cron Scheduler

- A single `node-cron` job runs on a fixed schedule (hourly in production).
- The cron iterates over a **config-driven list of feed URLs**.
- Each feed is processed independently so a failure in one feed does not affect others.

**Why this design?**

- Easy to add/remove feeds without changing business logic
- Single cron avoids duplicated scheduling logic
- Sequential feed processing keeps external API usage predictable

---

### 2. Feed Fetching Layer

- Each feed URL is fetched using a generic `fetchJobs(feedUrl)` service.
- RSS/XML responses are parsed into JSON.
- No feed-specific logic is hardcoded at this layer.

**Key Principle:**

> Feeds are treated as data, not logic.

---

### 3. Normalization & Validation

- Raw feed items are normalized into a common `JobDTO` structure.
- Feed-specific normalizers (e.g., Jobicy) handle structural differences.
- Zod validation ensures malformed or incomplete jobs are rejected safely.

Invalid jobs:

- Are skipped
- Do not break the import process
- Are tracked in import logs if needed

---

### 4. Queue-Based Processing (BullMQ + Redis)

- Valid jobs are enqueued into a Redis-backed BullMQ queue.
- Each import run creates an **ImportLog** document before enqueueing.
- The import log ID is attached to each queued job.

**Why a queue?**

- Prevents blocking the cron job
- Allows controlled concurrency
- Enables horizontal scaling via multiple workers

---

### 5. Worker Layer

- Dedicated workers consume jobs from the queue.
- Each job performs an **idempotent upsert** into MongoDB using a unique `externalId`.

Job outcomes:

- If `externalId` does not exist → **New job**
- If `externalId` exists → **Updated job**

This guarantees:

- No duplicates
- Safe re-processing of the same feeds
- Overlapping feeds do not create duplicate records

---

### 6. Import History Tracking

Each cron execution per feed creates an ImportLog containing:

- Feed URL (`fileName`)
- Total jobs fetched
- Total jobs imported
- Count of new jobs
- Count of updated jobs
- Failed jobs (if any)
- Timestamp

This enables:

- Operational visibility
- Debugging and auditability
- Frontend reporting

---

### 7. Import History API

`GET /api/import-logs`

- Server-side pagination using `page` and `limit`
- Sorted by most recent imports
- Returns metadata (`total`, `totalPages`) for UI pagination

The backend fully owns pagination and counting to ensure consistency.

---

### 8. Frontend Admin UI (Next.js + Tailwind)

- Displays import history in a tabular admin dashboard
- Uses server-driven pagination
- Auto-refreshes every 30 seconds to reflect background cron activity
- Clearly displays:
  - Feed URL
  - Run timestamp
  - Total / New / Updated / Failed counts

The UI intentionally avoids complex visualizations and focuses on operational clarity.

---

## Data Flow Summary

1. Cron triggers job import
2. Feed URLs are fetched sequentially
3. Jobs are normalized and validated
4. Valid jobs are enqueued
5. Workers process jobs asynchronously
6. MongoDB stores jobs using idempotent upserts
7. Import logs are recorded per feed
8. Frontend consumes import history API

---

## Key Design Decisions

### Idempotency

- Jobs are uniquely identified by `externalId`
- Multiple feeds or repeated runs do not create duplicates

### Scalability

- Queue-based architecture allows adding more workers
- Feed list is config-driven

### Fault Tolerance

- Feed failures are isolated
- Invalid jobs do not break imports

### Observability

- Import logs provide full visibility into each run

---

## Future Improvements (Optional)

- Parallel feed processing
- WebSocket-based real-time UI updates
- Retry & dead-letter queues
- Feed health monitoring

---

## Conclusion

This architecture demonstrates a **production-ready ingestion pipeline** with clear separation of concerns, safe data handling, and extensibility. The system is designed to scale with additional feeds and higher job volumes while remaining easy to reason about and maintain.
