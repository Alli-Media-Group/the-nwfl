# NWFL Frontend — Agent Working Instructions

## Project Overview

This is the **frontend web application** for the **Nigeria Women Football League (NWFL)**. It is a React-based single-page application that consumes data from a separate Django backend.

**Scope lock:** This platform is exclusively for the NWFL. Do not design, reference, or accommodate any other sport, league, or competition.

**Live Pages**
- Home (`/`)
- Teams (`/teams`) — card grid with filterable team list
- Team Detail (`/teams/:slug`) — individual team profile
- Stats (`/stats`) — currently a placeholder
- Analytics (`/analytics`) — season charts and team performance insights
- 404 (`*`)

**Placeholder Routes** (render `ComingSoon`)
- `/about`, `/news`, `/match-center`, `/players`, `/media`

**Backend:** `c:\work\nwfl-backend` — Django + Django REST Framework + SQLite, served at `http://localhost:8000`.

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.2.5 |
| Router | React Router DOM | 7.14.2 |
| Build Tool | Vite | 8.0.10 |
| Styling | Sass (SCSS) | 1.99.0 |
| Charts | Recharts | 3.8.1 |
| Carousel | Embla Carousel (React + Autoplay) | 8.6.0 |
| Icons | React Icons | 5.6.0 |
| Linting | ESLint | 10.2.1 |

**Fonts:**
- **Primary headings:** `Placard Next Condensed` (loaded from `/fonts/PlacCond_0.ttf`), weight `700`. Montserrat is the fallback.
- **Secondary headings / body:** `Poppins`, weights `400`–`600`.
- Both are loaded via Google Fonts in `index.html` (Poppins + Montserrat). The custom `Placard Next Condensed` font-face is declared in `src/styles/_variables.scss`.

---

## Build and Run Commands

All commands are run from the project root (`c:\work\the-nwfl`).

```bash
# Install dependencies
npm install

# Start development server (Vite dev server on default port 5173)
# Proxies /api requests to http://localhost:8000
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Lint JavaScript / JSX files
npm run lint
```

**Dev Server Proxy:**
Vite is configured to proxy `/api` to `http://localhost:8000`. Frontend API calls use relative paths (e.g., `/api/standings/`) so they resolve correctly in both dev and production (where the backend is expected to serve `/api` from the same origin).

---

## Code Organization

```
src/
├── components/           # Reusable UI pieces
│   └── ComponentName/
│       ├── ComponentName.jsx
│       └── ComponentName.scss
├── pages/                # Route-level pages
│   └── PageName/
│       ├── PageName.jsx
│       └── PageName.scss   (page-level layout only)
├── layouts/
│   └── RootLayout.jsx    # Navbar + <main> wrapper, handles hero transparency
├── styles/
│   ├── _variables.scss   # CSS custom properties (colors, spacing, fonts, z-index)
│   ├── _mixins.scss      # SCSS mixins (breakpoints, container, glass, glow-border, etc.)
│   ├── _reset.scss       # CSS reset / normalize
│   └── main.scss         # Global utilities, buttons, cards, badges
├── lib/
│   └── api.js            # Single source of truth for all backend API calls
├── hooks/
│   └── useImageLoader.js # Tracks image load state for shimmer UX
├── data/
│   ├── mock*.js          # Legacy mock data (standings, teams, matches, news, players)
│   └── images/           # Static image assets used by components
├── App.jsx               # Router definition
└── main.jsx              # React root entry point
```

**Static assets** (logos, favicons, team logos) live in `public/` and are served from the root path.

---

## Design System & Styling Conventions

### Must-Read Files Before Any UI Work
1. `docs/design-guidelines.md` — single source of truth for colors, typography, spacing, component patterns, and chart styling.
2. `docs/league-colour-system.md` — how standings row colours work (qualify vs relegation thresholds for Group A and Group B).

### SCSS Architecture Rules
- **All CSS custom properties** live in `src/styles/_variables.scss`. Never invent new tokens without adding them there.
- **Reusable mixins** live in `src/styles/_mixins.scss`.
- **Global utility classes** (`.container`, `.section`, `.btn`, `.card`, `.badge`, `.section-title`) live in `src/styles/main.scss`.
- **Component styles:** `ComponentName/ComponentName.scss`, imported with `@use '../../styles/mixins' as m;`.
- **Never hardcode a color hex** in a component SCSS file. Always use a CSS variable.
- **Never hardcode a px spacing value.** Always use a `--sp-*` variable or a mixin.
- **Mobile-first.** Breakpoints are `sm: 480px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
- **No inline styles.** No CSS-in-JS.

### Colour Palette (Key Tokens)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-primary` | `#4B1FA3` | Primary purple |
| `--color-accent` | `#6A2BD9` | Hover / mid-tone |
| `--color-highlight` | `#8A3DFF` | CTA / glow |
| `--color-success` | `#22c55e` | Qualified / positive |
| `--color-danger` | `#ef4444` | Relegated / negative |

### Z-Index Hierarchy
Use tokens from `_variables.scss` — never raw numbers:
- `--z-base: 0`, `--z-raised: 10`, `--z-sticky: 20`, `--z-dropdown: 50`, `--z-modal: 80`, `--z-navbar: 100`, `--z-toast: 200`

### Component Patterns
- **Cards:** `.card` class → gradient background, `12px` radius, glow border, hover lift.
- **Buttons:** `.btn` + `.btn--primary` (gradient fill), `.btn--outline`, `.btn--ghost`. Always uppercase, `Poppins 600`, `letter-spacing: 0.04em`.
- **Glass surfaces:** `@include m.glass` → `backdrop-filter: blur(12px)` + border.

---

## API & Data Strategy

`src/lib/api.js` is the **only** place for backend calls.

**Exported functions:**
- `fetchStandings()` → returns `{ groupA: [], groupB: [] }` sorted by points then GD.
- `fetchMatches()` → returns array of adapted match objects.
- `fetchTeams()` → returns array of team objects enriched with standing + next-match info.
- `fetchAnalyticsSeason()` → returns raw season stats array.
- `logoUrl(slug)` → returns path to team logo PNG.

**Adapters:** `api.js` contains adapter functions (`adaptStanding`, `adaptMatch`, `adaptTeam`) that map the Django REST Framework API shape into the exact shape expected by components.

**Data Policy:**
- Do **not** mock data that the backend already serves. Mock files in `src/data/` are legacy.
- If an endpoint is missing, add it to the backend rather than creating new mocks.
- Backend data refresh workflow (run in backend directory):
  ```bash
  uv run python manage.py import_from_sheet <path.html> --wipe-existing
  ```
  This re-imports matches and recalculates standings + season stats.

---

## Component Rules

- Build every UI piece as a **reusable component** — no one-off markup inside page files.
- **Props over hardcoded content.** Cards, tables, and stat blocks must accept data via props.
- Keep components focused: **one concern per file**.
- SVG icons are usually defined as small helper components inside the same file (see `Navbar.jsx`, `Hero.jsx` for examples).
- Images should use the `useImageLoader` hook to enable shimmer loading states.

---

## Testing

**There is currently no test framework configured.**
- No Jest, Vitest, Playwright, or Cypress setup exists.
- No `*.test.*` or `*.spec.*` files are present.
- If you add tests, create a `tests/` or `__tests__/` directory and update `package.json` scripts accordingly.

---

## Linting & Code Quality

- ESLint is configured in `eslint.config.js` (flat config).
- Extends: `@eslint/js/recommended`, `eslint-plugin-react-hooks/recommended`, `eslint-plugin-react-refresh/vite`.
- Lints all `**/*.{js,jsx}` files except `dist/`.
- Run `npm run lint` before committing.

---

## Deployment

- The app is a **static Vite build**. `npm run build` outputs to `dist/`.
- The backend is expected to serve the built frontend or the frontend is deployed to a static host (e.g., Vercel, Netlify, Nginx) with `/api` routed to the Django backend.
- No CI/CD configuration files (e.g., `.github/workflows/`) exist in the repo.
- `dist/` is gitignored.

---

## Security Considerations

- No authentication or authorization is implemented on the frontend.
- All API calls use `fetch` over HTTP (`http://localhost:8000` in dev).
- `dangerouslySetInnerHTML` is used in `Hero.jsx` for the title HTML string — ensure any dynamic content passed to it is sanitized if it ever comes from user input (currently it is hardcoded props).
- No environment variable files (`.env`) are present. API base URL is handled via Vite proxy in dev and same-origin in production.

---

## What Is Out of Scope

- No CMS, news system, gallery, or podcasts.
- No live / real-time match tracking.
- No multi-sport complexity.
- No pages beyond Home, Teams, Stats, Analytics (for now).
- The `/stats` page is currently a placeholder (`<div>Stats Page — coming soon</div>`).

---

## Quick Reference — Files to Read Before Starting Work

| Task | Read First |
|------|------------|
| New UI section / component | `docs/design-guidelines.md` |
| Standings table colours | `docs/league-colour-system.md` |
| Styling / SCSS changes | `src/styles/_variables.scss`, `src/styles/_mixins.scss`, `src/styles/main.scss` |
| API integration | `src/lib/api.js` |
| Routing changes | `src/App.jsx` |
| Layout changes | `src/layouts/RootLayout.jsx` |


---

## UI & Prototyping Rules — Permanent Reference

These rules exist because the player-registry work repeatedly drifted into high-contrast one-offs and polished-but-wrong details. Read this section before any UI task.

### 1. No high-contrast or neon accents
- Do not use bright purple glows, neon-on-black treatments, or harsh drop-shadows unless the design spec explicitly calls for them.
- Prefer the existing subtle surface system: `.surface`, `.surface--interactive`, `.surface--elevated`, `var(--color-surface-subtle)`, `var(--color-border-subtle)`, `var(--color-muted)`.
- Highlights should feel recessed, not glowing.

### 2. Prototype first, polish later
- Build layout, data flow, empty states, loading states, and error states before refining visuals.
- Use skeletons, placeholders, and generic fallback components first.
- Do not spend time on micro-animations, hover lifts, or glows until the core UX works end-to-end.

### 3. Generic fallback states are required
- **Player avatars:** use `/no-profile.png` (the NWFL lady silhouette) for any missing or broken player photo. Apply `mix-blend-mode: screen` and a subtle `drop-shadow` so the white silhouette blends into the dark surface.
- Do **not** fall back to initials-in-a-circle for people.
- Add `onError` handling to every dynamic image so a broken URL degrades to the generic fallback.
- Empty lists, errors, and "no data" states must use the shared `Modal` component or the project's placeholder styles — never native `alert()`.

### 4. Use the shared Modal for feedback
- All user-facing errors, confirmations, and success messages go through `src/components/ui/Modal/Modal.jsx`.
- No `window.alert`, no browser-native `confirm`.

### 5. Stick to the token system
- New tokens belong in `src/styles/_variables.scss`.
- No hardcoded hex colors or raw spacing values in component SCSS.
- Re-read `docs/design-guidelines.md` and `src/styles/_variables.scss` before changing any color or spacing.

### 6. Scope lock
- NWFL only. No fake stats and no placeholder content that references other leagues or sports.
