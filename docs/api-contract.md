# TechVault API Contract (v1)

All public endpoints are exposed via the API Gateway at `http://gateway:8081`. Every path listed here is automatically prefixed with `/api`. Services are registered with Eureka under the names shown below. All responses use JSON unless otherwise stated. Authentication-protected routes expect an `Authorization: Bearer <JWT>` header; the gateway validates the token and forwards the downstream request with `X-User-Id` and `X-User-Role` headers.

## 1. Auth & Session — `AUTH-SERVICE`

| Method | Path | Description | Request | Response |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Registers a new user and auto-logs them in. | `{ "email": "", "password": "", "displayName": "", "role": "LEARNER\|GUARDIAN\|ADMIN" }` | `{ "token": "", "user": { "id": "", "role": "", "displayName": "", "email": "" } }` |
| POST | `/auth/login` | Logs in existing user. | `{ "email": "", "password": "" }` | `{ "token": "", "user": { ...same as above } }` |
| GET | `/auth/me` | Returns the authenticated user’s profile. | – | `{ "id": "", "role": "", "email": "", "displayName": "", "linkedLearners": [], "linkedGuardians": [] }` |

## 2. Users & Profiles — `USER-SERVICE`

| Method | Path | Description | Notes |
| --- | --- | --- | --- |
| GET | `/users/me` | Fetch current user profile/details. | Scope determined by `X-User-Id`. |
| PATCH | `/users/me` | Update profile preferences. | Accepts partial updates for `displayName`, `avatar`, `preferredMascot`, `settings`. |
| PATCH | `/users/me/password` | Change password. | `{ "oldPassword": "", "newPassword": "" }` — validated in auth-service. |
| GET | `/admin/users` | Paginated user management (ADMIN). | Query params: `page`, `size`, `role`. |
| PATCH | `/admin/users/{userId}` | Update role/lock status (ADMIN). | Body: `{ "role": "", "locked": true\|false }`. |
| GET | `/guardians/me/learners` | Learners linked to guardian. | Returns array of minimal learner profiles + XP summary. |
| POST | `/guardians/me/learners` *(optional)* | Link guardian to learner. | `{ "codeOrEmail": "" }`. |

## 3. Content — `CONTENT-SERVICE`

### Public/Learner

| Method | Path | Description | Notes |
| --- | --- | --- | --- |
| GET | `/vaults` | List vaults with filters. | Query: `difficulty`, `worldTheme`, `featured`, `search`, paging. |
| GET | `/vaults/{vaultId}` | Vault detail + quest metadata. | Includes quest list with status fields. |
| GET | `/quests/{questId}` | Quest detail view. | For `CODE_CHALLENGE` includes `starterCode`, `gradingStrategy`, etc. |

### Admin Content Management

| Method | Path | Description |
| --- | --- | --- |
| POST | `/admin/vaults` | Create new vault. |
| PUT | `/admin/vaults/{vaultId}` | Update vault. |
| DELETE | `/admin/vaults/{vaultId}` | Archive/delete vault. |
| GET | `/admin/quests` | List quests (filters: `vaultId`, `type`, `difficulty`, paging). |
| POST | `/admin/quests` | Create quest (factory drives entity type). |
| PUT | `/admin/quests/{questId}` | Update quest. |
| DELETE | `/admin/quests/{questId}` | Archive/remove. |

## 4. Progress & Submissions — `PROGRESS-SERVICE`

| Method | Path | Description |
| --- | --- |
| POST | `/submissions` | Learner submits quest attempt. |
| GET | `/submissions` | List submissions for learner (`questId`, `status`, paging filters). |
| GET | `/submissions/{submissionId}` | Submission detail + grading feedback. |
| GET | `/submissions/recent` *(optional)* | Recent submissions summary (dashboard). |
| GET | `/learner/progress/summary` | XP/level/streak summary for learner. |
| GET | `/learner/progress/vaults` | Vault progress list. |
| GET | `/learner/progress/vaults/{vaultId}` | Vault-level progress detail. |
| GET | `/badges/catalog` | Full badge catalog (public/Learner). |
| GET | `/learner/badges` | Badges unlocked by learner. |

## 5. Admin Metrics — `PROGRESS-SERVICE` + composites

| Method | Path | Description |
| --- | --- |
| GET | `/admin/metrics/overview` | Aggregated stats for admin dashboard. |
| GET | `/admin/metrics/activity` *(optional)* | Activity feed/time-series data. |

## 6. Guardian Oversight — `USER-SERVICE` + `PROGRESS-SERVICE`

| Method | Path | Description |
| --- | --- |
| GET | `/guardian/learners` | Guardian’s linked learners with summary. |
| GET | `/guardian/learners/{learnerId}/progress` | Per-learner progress summary. |
| GET | `/guardian/learners/{learnerId}/submissions` | Submissions detail for learner (filters). |
| GET | `/guardian/learners/{learnerId}/vaults` *(optional)* | Vault breakdown for guardian view. |

## 7. CDN & Assets — `CDN-SERVICE`

| Method | Path | Description |
| --- | --- | --- |
| POST | `/cdn/upload` | Uploads an asset to MinIO and returns the object key + CDN URL. |
| GET | `/cdn/files` | Lists stored objects (key + URL). |

## Gateway Routing Blueprint

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/api/auth/**
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**, /api/admin/users/**, /api/guardians/**, /api/guardian/**
        - id: content-service
          uri: lb://CONTENT-SERVICE
          predicates:
            - Path=/api/vaults/**, /api/quests/**, /api/admin/vaults/**, /api/admin/quests/**
        - id: progress-service
          uri: lb://PROGRESS-SERVICE
          predicates:
            - Path=/api/submissions/**, /api/learner/**, /api/badges/**, /api/admin/metrics/**, /api/guardian/learners/**
        - id: cdn-service
          uri: lb://CDN-SERVICE
          predicates:
            - Path=/api/cdn/**
```

The JWT filter (already present in the gateway) validates tokens, rejects unauthorized calls, and forwards the downstream request with the validated identity headers. Individual services only trust the `X-User-*` headers provided by the gateway and enforce role-based access at the controller/service layer.
