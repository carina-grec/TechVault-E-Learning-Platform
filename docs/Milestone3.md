# Milestone 3 – Architecture Investigation & Evaluation

This milestone compares three architectural styles for TechVault. Each section describes how the system would look, shows component/deployment diagrams (PlantUML), and analyzes pros/cons relative to our requirements.

---

## 1. Monolithic Architecture

### 1.1 Description
All features (auth, users, content, progress, grading, CDN) live inside one Spring Boot application. Controllers share a single codebase, domain layer, and data access layer. A single PostgreSQL database holds every table. Background grading runs via internal threads or Quartz jobs rather than a detached service.

### 1.2 Component Diagram
![techvaultmonolith.png](techvaultmonolith.png)

### 1.3 Deployment Diagram
```plantuml
@startuml
node "Client" as Client
node "Load Balancer" as LB
node "Monolith VM / Container" as Mono {
    component "TechVault.jar"
}
database "PostgreSQL" as PG
node "MinIO" as MINIO

Client --> LB
LB --> Mono
Mono --> PG
Mono --> MINIO
@enduml
```

### 1.4 Pros
- Simplest deployment (one artifact, one pipeline).
- No network hops between modules; easiest to debug locally.
- Consistent transactions across all modules (single DB transaction).

### 1.5 Cons
- Scaling is coarse: need to scale the whole app even if only grading is busy.
- Long build/test cycles; teams step on each other’s changes.
- Fault isolation is poor: a bug in grading can crash the entire platform.
- Harder to adopt new tech (e.g., Node-based Piston or future ML models) because the runtime is locked to Java.

---

## 2. Microservices Architecture (current choice)

### 2.1 Description
Independent Spring Boot services per bounded context: Auth, User, Content, Progress, Grading, CDN, plus infrastructure services (RabbitMQ, MinIO, Piston). Each service owns its REST API, repositories, and Docker image. The API Gateway centralizes routing/security. RabbitMQ decouples submissions from grading workloads.

### 2.2 Component Diagram
```plantuml
@startuml
left to right direction
package Gateway {
  [API Gateway]
}
package Services {
  [Auth Service]
  [User Service]
  [Content Service]
  [Progress Service]
  [CDN Service]
  [Grading Service]
}
package Infra {
  queue "RabbitMQ" as MQ
  database "PostgreSQL" as PG
  node "MinIO" as MINIO
  node "Piston" as Piston
}
[API Gateway] --> [Auth Service]
[API Gateway] --> [User Service]
[API Gateway] --> [Content Service]
[API Gateway] --> [Progress Service]
[API Gateway] --> [CDN Service]
[Progress Service] --> MQ : publish SubmissionGradingJob
MQ --> [Grading Service]
[Grading Service] --> Piston
[Auth Service] --> PG
[User Service] --> PG
[Content Service] --> PG
[Progress Service] --> PG
[Grading Service] --> PG
[CDN Service] --> MINIO
@enduml
```

### 2.3 Deployment Diagram
```plantuml
@startuml
node "Client" as Client
node "Docker Host / K8s" {
  node "API Gateway"
  node "Auth Service"
  node "User Service"
  node "Content Service"
  node "Progress Service"
  node "Grading Service"
  node "CDN Service"
  node "Piston Service"
  node "RabbitMQ"
  node "PostgreSQL"
  node "MinIO"
}
Client --> "API Gateway"
"Progress Service" --> "RabbitMQ"
"RabbitMQ" --> "Grading Service"
"Grading Service" --> "Piston Service"
@enduml
```

### 2.4 Pros
- Services scale independently (e.g., run multiple grading containers).
- Fault isolation: grading crash doesn’t kill auth.
- Technology freedom (Node for Piston, potential Go service later).
- Smaller, focused codebases; easier CI.
- Matches our domain boundaries (auth, content, progress, etc.).

### 2.5 Cons
- Operational overhead (service discovery, tracing, shared observability).
- Requires messaging infrastructure and disciplined interface contracts.
- Cross-service transactions require sagas/compensation.

---

## 3. Event-Driven Serverless Architecture (alternative distributed style)

### 3.1 Description
Instead of long-running services, core features become managed functions (AWS Lambda-style). API Gateway still fronts the system, but each endpoint triggers a function. State lives in managed databases/storage. Code submissions drop into an event bus (e.g., AWS EventBridge), and managed workers run grading jobs. CDN uploads go directly to S3 via signed URLs.

### 3.2 Component Diagram
```plantuml
@startuml
left to right direction
[API Gateway] --> (AuthFunction)
[API Gateway] --> (UserFunction)
[API Gateway] --> (ContentFunction)
[API Gateway] --> (SubmissionFunction)
(SubmissionFunction) --> (EventBridge) : emit SubmissionCreated
(EventBridge) --> (GradingLambda)
(GradingLambda) --> (StepFunction Runner) : invoke code sandbox
(CDN Upload Function) --> (S3 Bucket)
(AuthFunction) --> (Serverless Postgres/Aurora)
(UserFunction) --> (Serverless Postgres/Aurora)
(ContentFunction) --> (Serverless Postgres/Aurora)
(SubmissionFunction) --> (Serverless Postgres/Aurora)
(GradingLambda) --> (Serverless Postgres/Aurora)
@enduml
```

### 3.3 Deployment Diagram
```plantuml
@startuml
node "Client" as Client

node "Cloud Provider" {
  node "API Gateway (managed)" as APIGW
  node "Lambda Functions" as Lambda
  node "Aurora Serverless" as Aurora
  node "EventBridge Bus" as EventBridge
  node "S3 Bucket" as S3
  node "Fargate Task (Piston)" as Fargate
}

Lambda --> Aurora
Lambda --> EventBridge
EventBridge --> Fargate : start grading task
Lambda --> S3

Client --> APIGW
APIGW --> Lambda
@enduml

```

### 3.4 Pros
- Virtually zero ops: auto-scaling, pay-per-use, built-in monitoring.
- Natural fit for bursty workloads (grading spikes, guardianship emails).
- Event-driven backbone simplifies fan-out (notifications, analytics, ML later).

### 3.5 Cons
- Cold starts impact latency (problematic for synchronous endpoints).
- Harder local development (need emulators/mocks).
- Vendor lock-in; migrating away from a cloud provider becomes costly.
- Long-running grading jobs may exceed Lambda time limits (require separate containers anyway).

---

## 4. Comparison & Final Choice

| Style | Fit for TechVault | Key Pain |
| --- | --- | --- |
| Monolith | Easy start, but fails to isolate grading/CDN workloads; deployment risk. | Scaling + team autonomy. |
| Microservices | Aligns with domain boundaries, isolates heavy workloads, supports real DevOps practices. | Requires infra automation and good observability. |
| Event-driven Serverless | Great elasticity and decoupling. | High vendor lock-in and local dev complexity; grading runtimes need special handling. |

**Decision:** We continue with the **microservices architecture**. It balances autonomy, technology choice, and operational complexity. Monolith would constrain scaling and testing; serverless would explode cost/lock-in and complicate our custom Piston runner. Microservices keep each context clean, let us reuse commodity infrastructure (Docker, RabbitMQ, MinIO), and are realistic for both production and teaching environments. With clear contracts and the docs above, we can onboard new contributors quickly while still evolving features independently.
