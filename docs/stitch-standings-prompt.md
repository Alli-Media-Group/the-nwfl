# Stitch Prompt — NWFL Fixtures & Standings Section

## Prompt to paste into Stitch

---

Design a **Fixtures & Standings** section for a dark, modern football league website.

**Context:**
This is for the Nigeria Women Football League (NWFL) — a women's football league with two groups (Group A and Group B). The section sits on the landing page between the News section and the Footer.

---

**Design System:**
- Background: pure black `#000000`
- Primary purple: `#4B1FA3`
- Accent purple: `#6A2BD9`
- Highlight / glow purple: `#8A3DFF`
- Card/surface background: dark purple tinted `rgba(75, 31, 163, 0.15)`
- Gradient for headers and accents: `linear-gradient(135deg, #4B1FA3 0%, #8A3DFF 100%)`
- Text: white `#ffffff` primary, `#a78fbf` muted
- Success (qualify): `#22c55e` green
- Danger (relegated): `#ef4444` red
- Heading font: bold condensed (like Barlow Condensed or Placard Next Condensed), uppercase
- Body font: Poppins
- Border radius: 6px on cards, 12px on containers
- Border: `1px solid rgba(138, 61, 255, 0.25)`

---

**Layout:**
Two-column layout on desktop, stacked on mobile:
- **Left column (40%)** — Fixtures list (recent results + upcoming matches)
- **Right column (60%)** — League Standings table

---

**Fixtures Panel (left):**
- Section label: "FIXTURES & RESULTS" in gradient uppercase heading
- List of match cards, each showing:
  - Home team logo (circular) + name
  - Score in the center (bold, large) with match status below (FT / LIVE / vs)
  - Away team logo (circular) + name
  - Matchday label (e.g. MD 15)
- Dark card background with subtle purple border
- A "View All Fixtures" link/button at the bottom using the purple gradient

---

**Standings Table (right):**
- Section label: "LEAGUE STANDINGS" in gradient uppercase heading
- Two tabs: **Group A** | **Group B** — active tab has purple gradient underline
- Table columns: `#` · `Team` · `MP` · `W` · `D` · `L` · `GD` · `PTS`
- Team row includes: small circular team logo + team name
- Position number `#` column has a coloured left border or badge:
  - **Green** `#22c55e` — Top 3 rows (Playoff qualifiers)
  - **No colour** — Mid-table (safe)
  - **Red** `#ef4444` — Bottom 3 rows in Group A / Bottom 4 rows in Group B (Relegated)
- Table header row: purple gradient background, white bold uppercase text
- Alternating row bg: very subtle, one shade darker than the other
- A legend below the table:
  - 🟢 Qualifies for Playoffs
  - 🔴 Relegated

---

**Overall feel:**
Premium, dark, modern sports UI. Think Sofascore or FotMob dark mode — clean rows, strong typography, coloured indicators, team logos. NOT basic or flat. The purple gradient should feel like energy and prestige. Subtle glows on borders. The whole section should feel like a serious sports platform.

---

## Implementation Notes (for after Stitch)

- Standings data comes from `src/data/mockStandings.js`
- Fixtures data comes from `src/data/mockMatches.js` (already exists)
- Group A relegation: bottom **3** teams
- Group A relegation: bottom **4** teams in Group B
- Top **3** in both groups qualify for Playoffs
- Components to create:
  - `FixturesPanel/FixturesPanel.jsx`
  - `StandingsTable/StandingsTable.jsx`
  - Combined wrapper: `LeagueSection/LeagueSection.jsx`
- Replace `GrowingNetwork` in `Home.jsx` with `LeagueSection`
- Team logos stored in `src/data/images/teams/`
