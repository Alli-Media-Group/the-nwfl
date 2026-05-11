# NWFL — Claude Working Instructions

## Project Overview

Sports league platform exclusively for the **Nigeria Women Football League (NWFL)**.
Pages: Landing (`/`), Teams (`/teams`), Stats (`/stats`), Analytics (`/analytics`), 404.
Stack: React 19, Vite 6, SCSS (sass), React Router v6, Recharts.

**Backend:** `c:\work\nwfl-backend` — Django 6 + DRF + SQLite + uv. Live API at `http://localhost:8000`. All pages consume real API data via `src/lib/api.js`.

**Scope lock:** This is NWFL only. Do not design, reference, or accommodate any other sport, league, or competition.

## Must-Read Before Any Design Work

**Always read [`docs/design-guidelines.md`](docs/design-guidelines.md) before building or modifying any UI section.**

The design guidelines document is the single source of truth for:
- Color palette and gradient usage
- Typography rules (which font, which weight, when)
- Spacing and layout conventions
- Component patterns (cards, buttons, badges, tables)
- Section-by-section design fidelity rules

## Core Rules

### Design Fidelity
- Every section must be as close as possible to the Figma reference.
- **Never guess a design decision.** If the Figma doesn't cover the next section, base it on the established app style (colors, gradients, card patterns) — not generic web conventions.
- Do not invent layouts, colors, or component styles that aren't derived from either the Figma or the existing design system.

### Fonts
- **Headings:** `Montserrat`, weight `700` (Bold) — always. No exceptions.
- **Body / UI text:** `Poppins`, weight `400`–`600` depending on context.
- Never use any other font family. Both are loaded via Google Fonts in `index.html`.

### SCSS Architecture
- All CSS custom properties live in `src/styles/_variables.scss`.
- Reusable mixins live in `src/styles/_mixins.scss`.
- Global utilities, button, card, badge classes live in `src/styles/main.scss`.
- Component-scoped styles: `ComponentName/ComponentName.scss` using `@use '../../styles/mixins' as m`.
- **Never hardcode a color hex in a component SCSS file.** Always use a CSS variable.
- **Never hardcode a px spacing value.** Always use a `--sp-*` variable or a mixin.

### Folder Structure
```
src/
├── components/      # Reusable UI pieces (Navbar, cards, tables…)
│   └── ComponentName/
│       ├── ComponentName.jsx
│       └── ComponentName.scss
├── pages/           # Route-level pages
│   └── PageName/
│       ├── PageName.jsx
│       └── PageName.scss (page-level layout only)
├── layouts/         # RootLayout (navbar + main wrapper)
├── styles/          # Global SCSS: _variables, _reset, _mixins, main
├── data/            # Mock JSON data files
└── hooks/           # Custom React hooks
```

### Component Rules
- Build every UI piece as a reusable component — no one-off markup inside page files.
- Props over hardcoded content — cards, tables, stat blocks must accept data as props.
- No inline styles. No CSS-in-JS.
- Keep components focused: one concern per file.

### Data Strategy
- Use mock data first (in `src/data/`). Shape mock data to match the expected API shape.
- Never hardcode content strings directly in JSX if the data will eventually come from an API.

### API & Data

`src/lib/api.js` is the single place for all backend calls. Base URL is `http://localhost:8000`.
Functions: `fetchStandings()`, `fetchMatches()`, `fetchTeams()`, `fetchAnalyticsSeason()`.

**Never mock data that's already served by the backend.** Mock data files in `src/data/` are legacy — prefer the real API. If an endpoint is missing, add it to the backend rather than mocking.

**Data refresh:** When new match results arrive, DataMill exports `nwfl-regular.html` from Google Sheets. Run on backend:
```
uv run python manage.py import_from_sheet <path.html> --wipe-existing
```
This re-imports all matches and recalculates standings + season stats automatically.

### What Is Out of Scope
- No CMS, news system, gallery, podcasts.
- No live/real-time match tracking.
- No multi-sport complexity.
- No pages beyond Home, Teams, Stats, Analytics (for now).
