# TechVault Architecture

## 1. Cast of Characters (Microservices)

| Service | What it does | Cool tricks |
| --- | --- | --- |
| **API Gateway** | The front door. It checks tickets, forwards visitors to the right ride, and keeps everyone safe. | Centralized routing, rate limiting, CORS rules. |
| **Auth Service** | Handles logins/registrations and issues JWT “bracelets” so other rides know who you are. | Talks to User Service, signs tokens, enforces passwords. |
| **User Service** | Stores learner/guardian/admin profiles, XP, streaks, guardianship links. | Rich CRUD API backed by Postgres. |
| **Content Service** | Manages vaults, quests, tests, and stories. Admins craft new lessons here. | Quest factory pattern, test-case storage, MinIO CDN links. |
| **Progress Service** | Learners submit code, earn badges, and track quest progress. | Publishes grading jobs to RabbitMQ and reads grading results. |
| **Grading Service** | Listens for jobs, runs the code, calculates scores, and writes back to the progress database. | Uses Piston sandbox, aggregates multi-test scores. |
| **CDN Service** | Accepts real image/file uploads and stores them in MinIO so quests can show artwork. | Multipart uploads, signed URLs, MinIO bucket management. |
| **Piston Runner** | Lightweight clone of the open-source Piston executor. It compiles/executes code in Docker. | Java & Python runtimes installed locally, isolate sandbox (no cgroup). |

All services are Spring Boot apps except Piston (Node) and MinIO/RabbitMQ/Postgres (off-the-shelf containers).

## 2. How They Talk (Protocols & Patterns)

### REST over HTTP
- Clients hit `http://localhost:8081` (API Gateway).
- Gateway forwards `/api/auth/**`, `/api/users/**`, `/api/quests/**`, `/api/submissions/**`, etc. to the right downstream service using service discovery (Eureka).
- JWTs carry identity; Gateway only forwards requests with valid tokens.

### Messaging with RabbitMQ
- When a learner submits code, Progress Service stores the submission and **publishes** a `SubmissionGradingJob` to `grading-jobs-queue`.
- Grading Service **subscribes** to that queue. This decouples the “submit” HTTP request from the heavy CPU work, so the learner never waits on grading.
- After execution, Grading Service updates the same submissions table in Postgres; learners poll `/api/submissions/{id}` to fetch the result.

### File Storage via HTTP
- CDN Service exposes `/cdn/upload` (multipart + auth), forwards the binary to MinIO, then returns the public URL.
- Content Service stores that URL, so the frontend can render real images for vaults and quests.

### Code Execution (Internal HTTP)
- Grading Service calls `http://piston-service:2000/api/v2/execute` with the learner’s code + test cases.
- Piston runs the job inside isolate, collects stdout/stderr, and returns structured JSON.

## 3. Database & Data Ownership

| Schema | Owner | Why |
| --- | --- | --- |
| `techvault_db.users`, `guardians`, `learners` | User Service | Single source of truth for people & roles. |
| `vaults`, `quests`, `test_cases` | Content Service | Admin creatives live here. |
| `submissions`, `quest_completions`, `badges` | Progress Service (and read by Grading Service) | Progress-centric data. |

Microservices **don’t share repositories**; each service has its own Spring Data repository pointed at shared Postgres tables. Grading Service only reads/writes the submissions table.

## 4. Design Patterns & Why They Matter

1. **API Gateway Pattern** – One entry point makes authentication, throttling, and metrics easier.
2. **Database per Service (logical)** – Even though Postgres is shared physically, each service owns its schemas/tables, avoiding tangled migration scripts.
3. **Event-driven (RabbitMQ)** – Submissions become messages, allowing the grading engine to scale independently and fail without blocking the learner.
4. **Factory Pattern in Content Service** – `QuestFactory` picks the right subclass (CodeChallenge, Quiz, VideoLesson) based on admin input.
5. **Strategy Pattern (planned)** – `UnitTestStrategy` vs. future `OutputOnlyStrategy` makes it easy to plug in new grading styles.
6. **Decorator-like Download Links** – CDN service decorates MinIO URLs with auth headers so the rest of the system sees simple HTTPS links.

## 5. Data & Control Flow (Story Mode)

1. **Login** – Client → Gateway → Auth Service. Auth returns JWT.
2. **Fetch Content** – Client → Gateway → Content Service → Postgres, returns quests with CDN URLs.
3. **Submit Code** – Client → Gateway → Progress Service. Service stores submission, publishes message, returns `202 Accepted`.
4. **Grade** – Grading Service pulls message, runs code via Piston, stores stdout/stderr/results JSON + score, marks `COMPLETED` or `ERROR`.
5. **Read Result** – Client keeps calling `/api/submissions/{id}`; once status becomes `COMPLETED`, UI shows score and per-test outcomes.

## 6. Deployment Snapshot

All components are defined in `docker-compose.yml`:

```
Clients -> API Gateway -> {auth,user,content,progress,cdn} -> Postgres
Progress -> RabbitMQ -> Grading -> Piston -> MinIO
```

Every service has its own Dockerfile (Spring Boot fat jar + JDK 21). Piston is built from the cloned GitHub repo because GHCR pulls were blocked.

## 7. Why This Architecture Works

- **Resilience** – If grading crashes, submissions still save; learners just see status “ERROR” and can retry.
- **Scalability** – Each service can scale horizontally in Docker/K8s as needed. The heaviest CPU usage (grading) is isolated and can scale separately from the API layer.
- **Developer Velocity** – Teams can focus on individual services without stepping on each other’s migrations.
- **Realistic Dev/Test** – CDN and Piston are “real” (no mocks), so Postman suites exercise the entire chain end-to-end.

For a diagram view, open [`docs/techvault-microservices.puml`](techvault-microservices.puml) in any PlantUML renderer.

---