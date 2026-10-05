# Codexa — AI-Powered Technical Learning Platform

Codexa is a course-agnostic technical learning platform: learn, practice, assess, build projects, get contextual AI guidance, and earn measurable skill mastery.

MERN / Web Development is the first vertical slice. The seed now ships 20+ courses across 5 engineering domains. Content and engine stay strictly separate — no hardcoded course pages or domain models in core logic.

## Features

- Course catalog + deep syllabus tree (Course → Module → Lesson → Activity)
- Activity state machine: `NOT_STARTED → IN_PROGRESS → COMPLETED`
- Quizzes with answer shielding (correct answers never sent to client)
- Coding challenges with isolated sandbox execution and hidden tests
- Monaco-based Lesson and Project workspaces, snippet runner, submission history
- Evidence-based skills (EMA over quizzes, challenges, milestones — video watched ≠ mastery)
- Explainable next-activity recommendations, weak-skill detection
- AI mentor drawer with RAG over approved course notes + Response Guard anti-cheat
- Capstone multi-file projects, verified external resources (docs + YouTube)
- Auth (JWT + Google Identity Services), per-student isolation, rate limiting, analytics events
- Light / dark / system theme, Cmd+K global search, responsive Tailwind UI

## Architecture

```text
React SPA (Vite + Tailwind + Monaco) → Express API (modular monolith)
                                              │
        ┌───────────────────────┬─────────────┼──────────────┐
        ▼                       ▼             ▼              ▼
  Learning / Progress      AI Gateway     Assessment      Execution
  Skills / Recommend       RAG + Guard    Attempts        BullMQ queue
        │                       │                           │
        ▼                       ▼                           ▼
  UserSkill EMA           Nvidia / Local            Executor worker
  Next activity           fallback                  bwrap sandbox
```

Core rules enforced in code:

1. Course-agnostic core.
2. Student code never runs on the API server. `bwrap --unshare-all --unshare-net`, 128 MB, 5000 ms, 64 KB output cap.
3. Mastery only from graded evidence.
4. AI context = approved notes only; Guard strips injections and blocks direct assessment answers.
5. Auth + ownership checks on sensitive routes.
6. Deterministic pedagogical fallback if LLM / queue is unreachable.

## Tech Stack

| Layer | Stack |
|---|---|
| Web | React 18, Vite 6, Tailwind 3.4, React Router 6, Monaco `@monaco-editor/react`, `lucide-react`, `clsx` |
| API | Express 4, TypeScript 5.7, Mongoose 8, BullMQ 5, ioredis, jsonwebtoken, bcryptjs, zod, dotenv |
| Worker | BullMQ `code-execution-queue`, concurrency 3, Mongoose |
| Data | MongoDB `mongodb://127.0.0.1:27017`, Redis `127.0.0.1:6379` |
| AI | NVIDIA NIM (`integrate.api.nvidia.com/v1`, `nemotron-3-ultra-550b-a55b`) with local deterministic provider fallback |
| Tests | Jest 29 + supertest + ts-jest, `tsx` runner, `concurrently` dev orchestration |

## Repository Structure

```text
codexa/
├── apps/api/src/
│   ├── app.ts / index.ts / config/env.ts
│   ├── database/models/ (17 models: User, Course, Module, Lesson, Activity,
│   │   Assessment, AssessmentAttempt, Challenge, Submission, Skill, UserSkill,
│   │   Progress, Project, Resource, AIConversation, AnalyticsEvent)
│   ├── database/seeds/courses/ (web-development, programming-languages,
│   │   databases, ai-ml, devops-systems) + skills, resources, projects
│   ├── database/seed.ts + connection.ts
│   ├── middleware/rate-limiter.ts
│   ├── modules/ (auth, courses, learning, assessments, challenges, execution,
│   │   skills, recommendations, ai, projects, resources, analytics)
│   └── __tests__/ (vertical-slice, security-and-integrity, lesson-content-system)
├── apps/web/src/
│   ├── pages/ (Dashboard, Catalog, CourseDetail, LessonWorkspace,
│   │   ProjectWorkspace, Profile, Admin, Login, Register)
│   ├── components/ (Navbar, AIMentorDrawer, GlobalSearchModal, VideoPlayer,
│   │   MarkdownRenderer, TryItModal, InteractiveExerciseView,
│   │   DebuggingChallengeView, ReferenceView, GoogleAuthButton, ThemeSelector)
│   ├── components/ui/ (CourseCard, CourseThumbnail, CourseVisual, ProjectCard,
│   │   SkillCard, ContentRail, Skeletons, EmptyState, CompletionModal, CodexaLogo)
│   ├── context/ (AuthContext, ThemeContext), hooks/, api/client.ts
│   ├── App.tsx, main.tsx, index.css (Craft design tokens)
├── workers/executor/src/index.ts (BullMQ worker)
├── scripts/ (verify-learning-loop.ts, verify-ai-connection.ts, audit-curriculum.ts)
├── package.json (npm workspaces: apps/*, workers/*)
```

Note: `packages/shared` is referenced by `@codexa/shared` alias in `apps/web/vite.config.ts` but is not present in this checkout. API imports its types from it in `sandbox.runner.ts`. If `npm install` fails on workspace resolution, check git history or re-add the shared contracts package.

## Prerequisites

- Node.js >= 20 (tested 22.23.3), npm >= 10
- MongoDB on `127.0.0.1:27017`
- Redis on `127.0.0.1:6379`
- Linux with `bwrap` (bubblewrap), `node`, `python3` available to sandbox
- Optional: `NVIDIA_API_KEY` for full AI quality; without it local fallback is used
- Optional: Google OAuth client ID for Google Sign-In button

## Quickstart

```bash
# 1. Install (from repo root)
npm install

# 2. Configure
cp apps/api/.env.example apps/api/.env
# edit PORT, MONGODB_URI, REDIS_HOST/PORT, JWT_SECRET,
# AI_PROVIDER, NVIDIA_API_KEY/BASE_URL/MODEL

# 3. Seed (20+ courses, skills, resources, projects, demo users)
npm run seed

# 4. Run all (api :5000, web :3000, worker)
npm run dev

# or individually
npm run dev:api
npm run dev:web
npm run dev:worker
```

Open:

- Web: `http://localhost:3000` (Vite proxies `/api` → `http://localhost:5000`)
- API health: `http://localhost:5000/api/health`

Seeded credentials:

| Role | Email | Password |
|---|---|---|
| Student | `alex@codexa.dev` | `StudentPass123!` |
| Admin | `admin@codexa.dev` | `AdminPass123!` |

## Environment Variables

| Var | Default | Used by |
|---|---|---|
| `PORT` | `5000` | API |
| `NODE_ENV` | `development` | API (`test` switches to `TEST_MONGODB_URI`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/codexa` | API + worker + seed |
| `TEST_MONGODB_URI` | `mongodb://127.0.0.1:27017/codexa_test` | Jest |
| `REDIS_HOST` / `REDIS_PORT` | `127.0.0.1` / `6379` | API queue + worker |
| `JWT_SECRET` | dev fallback (set a 32+ char secret in prod) | Auth |
| `AI_PROVIDER` | `nvidia` | AI factory |
| `NVIDIA_API_KEY` / `NVIDIA_BASE_URL` / `NVIDIA_MODEL` | — / `https://integrate.api.nvidia.com/v1` / `nvidia/nemotron-3-ultra-550b-a55b` | AI provider |

## API Reference

Base: `/api`. Auth: `Authorization: Bearer <JWT>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | no | liveness check |
| POST | `/auth/register`, `/auth/login`, `/auth/google` | no (rate-limited) | create session |
| GET / PUT | `/auth/me`, `/auth/preferences` | user | profile + learning preferences |
| GET | `/courses`, `/courses/:slug`, `/courses/lessons/:lessonId` | no | catalog + syllabus tree |
| POST / PUT / DELETE | `/courses`, `/courses/:courseId/modules`, `/courses/modules/:moduleId/lessons`, `/courses/lessons/:lessonId*`, `/courses/activities/:activityId*` | admin | curriculum CRUD |
| GET / POST | `/progress/course/:courseId`, `/progress/start`, `/progress/complete`, `/progress/my-courses` | user | enrollment + state machine |
| GET / POST | `/assessments/:id`, `/assessments/:id/attempt`, `/assessments/:id/history` | user (rate-limited) | shielded quiz + grading |
| GET / POST | `/challenges/:id`, `/challenges/:id/submit`, `/challenges/:id/run`, `/challenges/run-snippet`, `/challenges/:id/submissions`, `/challenges/submissions/:submissionId` | user (rate-limited) | sandboxed execution |
| GET | `/skills`, `/skills/my-skills`, `/skills/weak-skills` | mixed | taxonomy + EMA mastery |
| GET | `/recommendations/next` | user | explainable next activity |
| POST | `/ai/ask` | user (rate-limited) | RAG mentor, Guard-filtered |
| GET | `/projects`, `/projects/:slug` | no/user | capstone projects |
| GET/POST/PUT/DELETE | `/resources`, `/resources/:id`, `/resources/admin` | mixed (writes: admin) | verified links |
| POST / GET | `/analytics/track`, `/analytics/admin/summary` | user / admin | events + admin rollup |

Error shape: `{ error: string }` via global handler in `apps/api/src/app.ts:39-45`.

## Execution Sandbox

`apps/api/src/modules/execution/sandbox.runner.ts` + `workers/executor/src/index.ts`.

- Queue: `code-execution-queue` (BullMQ + Redis), worker concurrency 3.
- Isolation: `bwrap --unshare-all --unshare-net --ro-bind /usr --proc /proc --dev /dev`, per-job tmpdir, sanitized env (`PATH` + `NODE_ENV=sandbox` only).
- Languages: JavaScript/TypeScript (`node --max-old-space-size=128`) and Python 3 (`RLIMIT_AS/DATA`).
- Limits: 5000 ms timeout → `TIMEOUT`, 128 MB, 64 KB stdout/stderr cap, 1 MB kill threshold, infinite-loop safe (process-group SIGKILL).
- Result: `results.json` preferred, stdout markers fallback; `{ PASSED | FAILED | TIMEOUT | ERROR }` + per-test items.
- If `bwrap` missing: returns `ERROR` — unsandboxed execution is prohibited, never falls through.

## AI Gateway

`apps/api/src/modules/ai/`:

- `provider.factory.ts` → `nvidia.provider.ts` / `local.provider.ts` (`AI_PROVIDER` switch)
- `context.builder.ts` + `rag.engine.ts` — approved lesson notes only
- `response.guard.ts` — prompt-injection redaction, assessment answer interception, hint-mode code withholding
- `ai.service.ts` / `ai.controller.ts` — `POST /api/ai` orchestration

Verify with: `npx tsx scripts/verify-ai-connection.ts`

## Web App

Routes in `apps/web/src/App.tsx`:

`/ → /dashboard|/catalog`, `/dashboard` (protected), `/catalog`, `/courses/:slug`, `/courses/:slug/lesson/:lessonId` (protected), `/projects/:slug` (protected), `/profile` (protected), `/admin` (protected), `/login`, `/register`.

- `api/client.ts` — `apiFetch()` with `localStorage:codexa_token` → `Authorization: Bearer`.
- `ThemeContext` — `light | dark | system`, `localStorage:codexa_theme_preference`, `.dark` class + FOUC guard in `index.html`.
- `index.css` + `tailwind.config.js` — Craft tokens via CSS vars (`--bg-main`, `--bg-surface`, `--accent`, …), `craft-card`, `btn-pill`, `input-field`, `code-frame`, mono kickers.
- Fonts: Inter + JetBrains Mono via Google Fonts. Default `<html class="dark">`.

## Tests & Verification Scripts

```bash
# from repo root or apps/api
npm test
# targeted
npm --prefix apps/api test -- vertical-slice
npm --prefix apps/api test -- security-and-integrity
npm --prefix apps/api test -- lesson-content-system

npx tsx scripts/verify-learning-loop.ts
npx tsx scripts/verify-ai-connection.ts
npx tsx scripts/audit-curriculum.ts
```

`verify-learning-loop.ts` exercises the full student loop standalone. `audit-curriculum.ts` checks seed integrity.

## Build

```bash
npm run build
npm --prefix apps/api start
npm --prefix apps/web run preview
npm --prefix workers/executor start
```

Typecheck: `npm run typecheck`.

## Troubleshooting

- `Sandbox unavailable` → install `bubblewrap` (`bwrap` must be on PATH). No fallback to unsandboxed run by design.
- `MongoNetworkError` → start `mongod`, check `MONGODB_URI`.
- `BullMQ connection` → start `redis-server`, check `REDIS_HOST/PORT`.
- Vite `Failed to resolve @codexa/shared` → shared workspace package missing in this checkout; restore it or stub the alias.
- `JWT malformed` → re-login to refresh `codexa_token`; confirm `JWT_SECRET` is stable across api/worker.
- AI empty / fallback only → set `NVIDIA_API_KEY`; otherwise local provider is expected.
