# NWFL Production Audit — What Actually Exists vs. What Notebook LLM Got Wrong

**Date:** 2026-06-16  
**Scope:** `the-nwfl` (public frontend), `nwfl-backend` (Django API), `nwfl-admin` (React admin dashboard)  
**Purpose:** Replace generic AI advice with a concrete inventory of the actual codebase, plus production-grade fixes tied to real files.

---

## 1. Executive Summary

You are not building from a spreadsheet-dependent prototype that needs "Node.js + WebSockets + Redis + AWS Textract + a mobile app" as Notebook LLM suggested. You already have:

- A **Django + DRF backend** deployed on EC2 with Postgres (Supabase), JWT auth, CI/CD, and systemd.
- A **Google Sheets → Django sync pipeline** with fuzzy team matching, goals parsing, season backfill, and auto standings recalculation.
- A **React 19 + TypeScript admin dashboard** with match editing, AI parsers, media library, invitations, and WhatsApp parsing.
- A **React 19 + Vite public frontend** with live standings, fixtures/results, team profiles, and analytics charts.

The real problems are not "add WebSockets and Redis." They are:

1. **Backend bugs that will break in production** (logout crash, missing endpoint, season-aware analytics broken).
2. **Admin gaps that block real operations** (no season selector on standings, no manual team creation, fake notifications).
3. **Frontend placeholder pages and mocked content** that make the public site look unfinished.
4. **Zero tests anywhere** — frontend, backend, and admin have no test coverage.

This document lists the actual state of each layer and the smallest production-grade fixes that will give you the biggest stability gains.

---

## 2. Backend — `nwfl-backend`

### 2.1 What Actually Exists

| App | Files | What it does |
|-----|-------|--------------|
| `teams` | `teams/models.py`, `teams/views.py`, `teams/serializers.py` | 16–22 NWFL clubs, group assignment, logos, CRUD API. |
| `matches` | `matches/models.py`, `matches/views.py`, `matches/serializers.py`, `matches/signals.py` | `Match` + `Goal` models, DRF viewset with season/status/matchday/group filters, `MatchListSerializer` for performance, auto standings recalc on save. |
| `standings` | `standings/models.py`, `standings/views.py`, `standings/management/commands/recalculate_standings.py` | Per-season standings, `unique_together=['team','season']`, command recomputes from completed matches. |
| `analytics` | `analytics/models.py`, `analytics/views.py`, `analytics/management/commands/compute_season_stats.py` | `TeamMatchStat` and `TeamSeasonStat` models + endpoints. |
| `media_library` | `media_library/models.py`, `media_library/views.py` | Image uploads with SHA-256 dedup and tags. |
| `invitations` | `invitations/models.py`, `invitations/views.py` | Email-based admin onboarding with 7-day tokens. |
| `etl` | `etl/services/ai_parser.py`, `etl/services/playwright_researcher.py` | OpenRouter/Anthropic parsers for matches, WhatsApp, teams, standings; Playwright team researcher. |

### 2.2 Real Data Flow

```
Google Sheets (results + fixtures tabs)
    ↓  gspread.service_account()
sync_from_sheet / import_from_sheet
    ↓
Match + Goal records
    ↓  post_save signal
Standing rows recalculated per season
    ↓
TeamSeasonStat recomputed on demand
```

The sync reads these columns:
- `Home Team`, `Away Team`, `Date`, `Game Week`, `Match Venue`, `Remarks`
- `FTHG`, `FTAG`, `HTHG`, `HTAG`
- `HomeTeam Goals`, `AwayTeam Goals`
- `Notes`, `Season`

### 2.3 Production Bugs That Will Hurt You

#### 🔴 CRITICAL: Logout will crash production

**Where:** `core/urls.py` → `auth_logout`
**What it does:** Calls `RefreshToken.blacklist()`.
**Why it breaks:** `rest_framework_simplejwt.token_blacklist` is **not** in `INSTALLED_APPS` and has no migration.
**Fix:**
```python
# core/settings.py
INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt.token_blacklist',
]
```
Then run `python manage.py migrate` on the next deploy.

#### 🔴 CRITICAL: WhatsApp parser endpoint is missing

**Where:** Admin calls `POST /api/internal/parse-whatsapp/` in `nwfl-admin/src/lib/api.ts`.
**Backend reality:** `etl/services/ai_parser.py` has `parse_whatsapp()`, but `core/urls.py` does **not** register the endpoint.
**Fix:** Add the route:
```python
# core/urls.py
path('api/internal/parse-whatsapp/', parse_whatsapp_view, name='parse-whatsapp'),
```

#### 🔴 CRITICAL: Season-aware analytics are broken

**Where:**
- `analytics/management/commands/compute_season_stats.py` reads **all** completed matches regardless of season, then labels output with `--season`.
- `analytics/views.py::TeamSeasonStatViewSet` has no `?season=` filter.
- `import_from_sheet.py` recomputes season stats from all matches, not just the imported season.

**Fix:** Add a `season` filter to the queryset and command:
```python
# analytics/views.py
class TeamSeasonStatViewSet(viewsets.ModelViewSet):
    ...
    def get_queryset(self):
        qs = TeamSeasonStat.objects.select_related('team')
        season = self.request.query_params.get('season')
        if season:
            qs = qs.filter(season=season)
        return qs
```
And update `compute_season_stats` to only aggregate `Match.objects.filter(season=target_season, status='FT')`.

#### 🟡 HIGH: Hardcoded EC2 paths make sync non-portable

**Where:** `matches/views.py::sync_from_sheet`
```python
cmd = [
    '/home/ubuntu/nwfl-backend/venv/bin/python',
    'manage.py', 'sync_from_sheet',
    '--season', season,
]
...
cwd='/home/ubuntu/nwfl-backend'
log_path = '/home/ubuntu/nwfl-backend/sync.log'
```

**Fix:** Use the current Python interpreter and project root:
```python
import sys
python = sys.executable
manage_py = Path(__file__).resolve().parents[2] / 'manage.py'
log_path = Path(__file__).resolve().parents[2] / 'logs' / 'sync.log'
```

#### 🟡 HIGH: `TeamMatchStat` and `TeamSeasonStat` are schema-only

**What:** The models have fields for `possession`, `pass_accuracy`, `yellow_cards`, `red_cards`, etc.
**Reality:** No command, signal, or admin action populates them. The frontend Analytics page uses them, but the data is empty or stale.
**Fix:** Either (a) remove unused fields and compute only what you have (goals, cards), or (b) add a command + admin inline to ingest match events into these tables.

#### 🟡 MEDIUM: `update_scores` command is hardcoded and season-less

**Where:** `matches/management/commands/update_scores.py`
**Issue:** Has a fixed `RESULTS` list and creates matches without setting `season`.
**Fix:** Deprecate it or rewrite it to accept `--season` and read from a structured source.

#### 🟢 LOW: No tests

Every `tests.py` is empty. This is acceptable for a solo project, but before adding new features, write at least tests for:
- `recalculate_standings`
- `sync_from_sheet` team matching
- `Standing.form` property

### 2.4 Backend Architecture That Is Already Production-Grade

Do not let generic advice make you rebuild these:

| What Notebook LLM said | Reality |
|------------------------|---------|
| "Use Node.js backend" | You already have Django + DRF. It is correct for this. |
| "Add WebSockets/Socket.io" | Not needed. Match updates are admin-driven and polled. Live scores are not a requirement. |
| "Add Redis caching" | The 500s were caused by serializing 557 matches with nested goals, not DB slowness. Already fixed with `MatchListSerializer`. |
| "Use AWS Textract" | Overkill. Google Sheets + AI parsers already handle bulk input. |
| "Use AWS S3/CloudFront for media" | Reasonable eventually, but Django media + nginx is working now. |

---

## 3. Admin Dashboard — `nwfl-admin`

### 3.1 What Actually Exists

| Route | File | Status |
|-------|------|--------|
| `/login` | `src/pages/Login/index.tsx` | ✅ JWT login |
| `/` | `src/pages/Dashboard/index.tsx` | ✅ Stats + season selector + recent matches |
| `/matches` | `src/pages/Matches/index.tsx` | ✅ List, filters, add/edit modal, AI import |
| `/teams` | `src/pages/Teams/index.tsx` | ✅ Grid, edit modal, AI import |
| `/standings` | `src/pages/Standings/index.tsx` | ⚠️ View + inline edit, but no season selector |
| `/whatsapp-parser` | `src/pages/WhatsAppParser/index.tsx` | ✅ Approve/skip parsed matches |
| `/sync` | `src/pages/Sync/index.tsx` | ✅ Google Sheet sync with live log |
| `/media-library` | `src/pages/MediaLibrary/index.tsx` | ✅ Upload, tags, search, preview |
| `/missing-logos` | `src/pages/MissingLogos/index.tsx` | ✅ Suggest + assign logos |
| `/invitations` | `src/pages/Invitations/index.tsx` | ✅ Superadmin invites |

### 3.2 Authentication Is Solid

- JWT access/refresh stored in `localStorage`.
- Silent refresh on 401 with deduplication.
- Route guard redirects to `/login`.
- Logout hits backend blacklist endpoint.

### 3.3 Production Gaps in Admin

#### 🔴 HIGH: Standings page has no season selector

**Where:** `src/pages/Standings/index.tsx:41`
**Issue:** Header hardcodes `"Season 2024/25"`. The API supports `?season=`, and `api.getSeasons()` exists, but the page does not use it.
**Fix:** Copy the season selector pattern from `src/pages/Matches/index.tsx` and call `api.getStandings()` with the selected season.

#### 🔴 HIGH: No manual "Create Team" button

**Where:** `src/pages/Teams/index.tsx`
**Issue:** Only AI import and edit are available. Adding Pelican Stars required a backend shell command.
**Fix:** Add a "Create Team" button that opens `TeamForm` without a team prop (make the form handle creation).

#### 🟡 MEDIUM: Notifications bell is fake

**Where:** `src/components/layout/TopBar.tsx`
**Issue:** Red dot is static. No notifications API or panel.
**Fix:** Either remove it or implement a real notification model + polling.

#### 🟡 MEDIUM: No user management beyond invitations

**Issue:** You cannot list active users, edit roles, or reset passwords from the admin.
**Fix:** Add a `/users` page backed by Django admin or a new `/api/users/` endpoint.

#### 🟡 MEDIUM: No error boundary or 404 page

**Where:** `src/App.tsx`
**Issue:** Wildcard route redirects to Dashboard. A bad URL silently takes you home.
**Fix:** Add a 404 route and a top-level error boundary.

#### 🟡 MEDIUM: Sync status polling is brittle

**Where:** `src/pages/Sync/index.tsx`
**Issue:** Polling stops when `status.log.includes('Done.')`.
**Fix:** Return a structured JSON flag like `finished: true` from `/api/internal/sync-status/`.

#### 🟢 LOW: No form validation library

Forms use controlled inputs with light validation. Before adding complex forms (tournaments, awards), consider Zod or Yup.

### 3.4 AI Parsers That Actually Work

| Parser | Component | Backend Endpoint | Input |
|--------|-----------|------------------|-------|
| Single match | `AIParserBox.tsx` | `/api/internal/parse-match/` | Text |
| WhatsApp chat | `WhatsAppParserPage.tsx` | `/api/internal/parse-whatsapp/` | Text |
| Bulk matches | `MatchesAIParser.tsx` | `/api/internal/parse-matches-bulk/` | Text + image |
| Team | `TeamAIParser.tsx` | `/api/internal/parse-team/` | Text + image |
| Standings | `StandingsAIParser.tsx` | `/api/internal/parse-standings/` | Text + image |

These are already the "human confirms AI draft" pattern Notebook LLM recommended. You do not need AWS Textract.

---

## 4. Public Frontend — `the-nwfl`

### 4.1 What Actually Exists

| Route | File | Status |
|-------|------|--------|
| `/` | `src/pages/Home/Home.jsx` | ✅ Hero, news, rising stars, league section |
| `/teams` | `src/pages/Teams/Teams.jsx` | ✅ Filterable team grid with side panel |
| `/teams/:slug` | `src/pages/Teams/TeamDetail.jsx` | ✅ Team profile |
| `/analytics` | `src/pages/Analytics/Analytics.jsx` | ✅ Charts page |
| `/stats` | `src/pages/Stats/Stats.jsx` | ❌ Placeholder |
| `/about`, `/news`, `/match-center`, `/players`, `/media` | `src/pages/ComingSoon/ComingSoon.jsx` | ❌ Placeholders |
| `*` | `src/pages/NotFound/NotFound.jsx` | ✅ 404 |

### 4.2 What Is Backend-Connected

- Matches / fixtures / results → `/api/matches/?season=...`
- Standings → `/api/standings/?season=...`
- Teams → `/api/teams/` + `/api/standings/` + `/api/matches/`
- Seasons list → `/api/matches/seasons/`
- Analytics → `/api/analytics/season/`

### 4.3 What Is Still Mocked

| Source | Used By | Reality |
|--------|---------|---------|
| `src/data/mockNews.js` | `NewsSection` | Static news articles. |
| `src/data/mockPlayers.js` | `RisingStars` | Static player cards with Unsplash images. |
| `src/data/mockTeams.js` | Nothing | Dead code. |
| `src/data/mockMatches.js` | Nothing | Dead code. |
| `src/data/mockStandings.js` | Nothing | Dead code. |

### 4.4 Production Gaps in Frontend

#### 🔴 HIGH: `/stats` and 5 other routes are placeholders

The public site has 6 placeholder pages. This is the biggest visible gap.

**Fix order:**
1. `/match-center` — Live/fixture results with filtering. Highest value, lowest effort (data already exists).
2. `/stats` — Player stats, top scorers, clean sheets. Needs backend model changes.
3. `/players` — Player directory. Needs new backend models.
4. `/news` — News list. Can be static at first, then CMS later.
5. `/media` — Photo gallery. Can pull from media library API.
6. `/about` — Static page.

#### 🔴 HIGH: `TeamDetail` and `Analytics` are not season-aware

**Where:**
- `src/pages/Teams/TeamDetail.jsx` calls `fetchTeams()` without a season.
- `src/pages/Analytics/Analytics.jsx` calls `fetchStandings()` without a season and hardcodes `"2024/25"`.

**Fix:** Use the `useSeason` hook everywhere season data matters.

#### 🟡 MEDIUM: Broken/internal links

- `NewsSection` links to `/news-log` → 404.
- `Hero` CTA links to `/stats` (placeholder).
- `RisingStars` CTA links to `/stats`.
- `FixturesPanel` CTA links to `/stats`.
- `Footer` nav links all use `href="#"`.
- Footer copyright says `© 2023`.

**Fix:** Replace with real routes or remove until those pages exist.

#### 🟡 MEDIUM: Hero copy is wrong

**Where:** `src/components/Hero/Hero.jsx`
**Issue:** Title says `"We are recruiting"` with CTA `"Apply Now"`. This does not match an NWFL league site.
**Fix:** Replace with season headline, e.g. `"2025/26 Season"` + CTA to `/match-center`.

#### 🟢 LOW: Unused components and dead code

- `GrowingNetwork/GrowingNetwork.jsx`
- `NewsLetter/NewsLetter.jsx`
- `src/pages/animations/animations.jsx`
- `mockTeams.js`, `mockMatches.js`, `mockStandings.js`

**Fix:** Delete them to reduce confusion.

#### 🟢 LOW: No tests

No Jest, Vitest, Playwright, or Cypress. No `*.test.*` files.

---

## 5. What Notebook LLM Got Wrong (And Why)

| Notebook LLM Suggestion | Why It Does Not Fit |
|-------------------------|---------------------|
| "Build a Node.js backend" | You already have Django + DRF. Rewriting would waste months. |
| "Use WebSockets/Socket.io for real-time scores" | No live-score requirement exists. Admin-driven updates + polling are sufficient. |
| "Add Redis caching" | The only perf issue was serializing nested goals; fixed with `MatchListSerializer`. |
| "Use AWS Textract for OCR" | Your Google Sheets pipeline + AI parsers already handle bulk input cheaper and faster. |
| "Build a mobile app with Flutter/React Native" | Out of scope. The public frontend is responsive web. |
| "Offline-first SQLite on mobile" | No mobile app exists. |
| "AWS S3 + CloudFront for media" | Reasonable future step, but Django media is working today. |

What you actually need is **not more architecture**. You need:

1. Fix the backend bugs that break production.
2. Close the admin gaps that block daily operations.
3. Ship the public pages that are still placeholders.
4. Add tests before the next big feature.

---

## 6. Prioritized Action Plan

### Week 1 — Backend Stability

1. Add `rest_framework_simplejwt.token_blacklist` to `INSTALLED_APPS` and migrate.
2. Register `/api/internal/parse-whatsapp/` in `core/urls.py`.
3. Fix season-aware analytics: add `?season=` filter to `TeamSeasonStatViewSet` and update `compute_season_stats`.
4. Remove hardcoded EC2 paths from `matches/views.py::sync_from_sheet`.
5. Remove or fix `update_scores.py`.

### Week 2 — Admin Operations

1. Add season selector to `/standings` and fetch `?season=`.
2. Add manual "Create Team" button to `/teams`.
3. Remove or implement the notifications bell.
4. Add a 404 page and error boundary.

### Week 3 — Public Frontend

1. Build `/match-center` using existing match data.
2. Make `TeamDetail` and `Analytics` season-aware.
3. Fix broken links and footer content.
4. Replace Hero copy with season-appropriate content.

### Week 4 — Cleanup + Tests

1. Delete unused components and mock files.
2. Write backend tests for `recalculate_standings` and team matching.
3. Write at least one frontend smoke test with Playwright or Vitest.
4. Document the admin workflows in `AGENTS.md` or a runbook.

---

## 7. File Map for Quick Reference

### Backend files that matter now
- `core/settings.py` — JWT, installed apps, database.
- `core/urls.py` — route registration.
- `matches/models.py`, `matches/views.py`, `matches/serializers.py`, `matches/signals.py` — match/goal logic.
- `standings/models.py`, `standings/management/commands/recalculate_standings.py` — standings.
- `analytics/views.py`, `analytics/management/commands/compute_season_stats.py` — analytics.
- `matches/management/commands/sync_from_sheet.py`, `import_from_sheet.py` — Google Sheets.
- `.github/workflows/deploy.yml`, `nwfl-api.service`, `nginx/nwfl-api.conf` — deployment.

### Admin files that matter now
- `src/lib/api.ts` — all API calls.
- `src/pages/Standings/index.tsx` — needs season selector.
- `src/pages/Teams/index.tsx` — needs create team.
- `src/components/layout/TopBar.tsx` — fake notifications.
- `src/App.tsx` — routing + guards.

### Frontend files that matter now
- `src/App.jsx` — routing.
- `src/lib/api.js` — API layer.
- `src/hooks/useSeason.js` — season hook.
- `src/pages/Stats/Stats.jsx` — placeholder.
- `src/pages/Teams/TeamDetail.jsx`, `src/pages/Analytics/Analytics.jsx` — not season-aware.
- `src/components/Hero/Hero.jsx`, `src/components/Footer/Footer.jsx`, `src/components/NewsSection/NewsSection.jsx` — content/links.

---

## 8. Conclusion

The NWFL platform is already a real production system with Django, JWT auth, CI/CD, Google Sheets sync, AI parsers, a working admin dashboard, and a styled public frontend. The next phase is not to add more infrastructure. It is to:

- **Stop production-breaking bugs** (logout, missing endpoint, analytics season bug).
- **Finish the admin tools** so you can operate without shell commands.
- **Ship the public pages** that fans and stakeholders actually see.
- **Add tests** so you stop chasing ghost bugs.

Use this audit as the checklist. Do not let generic AI advice distract you into rebuilding what already works.
