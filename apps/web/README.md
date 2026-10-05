# Codexa Web — UI Redesign Package

Redesign-ready export of the Codexa frontend. Backend-agnostic: keep routes, data contracts, and `api/client.ts` behavior intact unless the API changes with you.

## Stack

React 18 + Vite 6 + Tailwind 3.4 + React Router 6 + Monaco + lucide-react. Ports: web `:3000` proxies `/api` → `:5000`.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run typecheck
```

## Routes (keep these paths)

`/ → /dashboard|/catalog`, `/dashboard`, `/catalog`, `/courses/:slug`, `/courses/:slug/lesson/:lessonId`, `/projects/:slug`, `/profile`, `/admin`, `/login`, `/register`. Cmd+K search + AI drawer are global in `App.tsx`.

## Structure

- `src/pages/` — 9 routes above
- `src/components/` — Navbar, AIMentorDrawer, GlobalSearchModal, VideoPlayer, MarkdownRenderer, TryItModal, InteractiveExerciseView, DebuggingChallengeView, ReferenceView, GoogleAuthButton, ThemeSelector
- `src/components/ui/` — CourseCard, CourseThumbnail, CourseVisual, ProjectCard, SkillCard, ContentRail, Skeletons, EmptyState, CompletionModal, CodexaLogo
- `src/context/` — AuthContext (`codexa_token` + Bearer), ThemeContext (`light|dark|system`)
- `src/api/client.ts` — single `apiFetch()` wrapper, do not fork
- `src/index.css` + `tailwind.config.js` — Craft tokens (`--bg-main`, `--bg-surface`, `--accent`, …), `craft-card`, `btn-pill`, `input-field`, `code-frame`
- `index.html` — dark default + FOUC guard, Inter + JetBrains Mono

## Redesign Constraints

1. Preserve all route paths and protected-route behavior.
2. Keep CSS var token names; you may change values, add tokens, not rename without updating `tailwind.config.js`.
3. Keep `ThemeContext` storage key `codexa_theme_preference` and `.dark` class strategy.
4. Keep `apiFetch` auth header logic.
5. Accessibility: preserve `:focus-visible` ring, `prefers-reduced-motion` block in `index.css`.
6. Do not add hardcoded course content — components must stay course-agnostic.

## Handoff

Return changed `src/` + `tailwind.config.js` + `index.html` diff. Full platform spec: see repo-root `README.md`.
