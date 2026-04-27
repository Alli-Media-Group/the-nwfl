# NWFL Frontend Build Plan (Personal Dev Document)

## Project Understanding

This is not a full-featured sports platform.

The scope has been reduced to a **focused frontend application** with three main areas:

1. Landing page
2. Stats layer (non-live data)
3. Analytics page (team performance insights)

Only specific parts of the UI will be implemented and connected to backend data.

---

## Core Pages

### 1. Landing Page (/)

Purpose:

- First impression of the platform
- Highlight key information

Content:

- Hero section
- Quick summary (e.g. league overview)
- Possibly featured stats or highlights

---

### 2. Stats Layer (/stats or similar)

Purpose:

- Display structured sports data (non-live)

Content:

- Fixtures
- Standings (league table)
- Match results (if included)

Notes:

- No real-time updates required
- Data will come from backend APIs

---

### 3. Analytics Page (/analytics)

Purpose:

- Show team performance insights

Content:

- Team performance metrics
- Trends (wins/losses, points, etc.)
- Comparative stats between teams

This is more visual and data-heavy than the stats page.

---

## Navigation Structure

Keep it simple and clean:

- Home
- Stats
- Analytics

Optional (if needed later):

- About / Info

---

## What is NOT Included

- No full CMS (news, gallery, podcasts)
- No real-time/live match tracking (for now)
- No unnecessary pages from Figma
- No multi-sport complexity (unless required later)

---

## Development Strategy

### Step 1: Foundation

- Setup React project
- Setup folder structure
- Implement global styles
- Build Navbar and basic layout

---

### Step 2: Landing Page

- Build hero section
- Add static content
- Ensure responsiveness

---

### Step 3: Stats UI (Mock Data First)

- Build:
  - Fixtures UI
  - Standings table

- Use mock JSON data
- Focus on reusable components

---

### Step 4: Analytics UI

- Build charts / performance views
- Structure components for flexibility
- Use mock data initially

---

### Step 5: Backend Integration

- Connect APIs
- Replace mock data
- Handle loading + error states

---

### Step 6: Polish

- Responsiveness
- Performance improvements
- UI refinements

---

## Key Components to Build

- Navbar
- Layout wrapper
- Table (for standings)
- Match/Fixture card
- Team performance card
- Chart/graph components (for analytics)

---

## Data Expectations

From backend, expect:

- Teams
- Matches / Fixtures
- Standings
- Performance stats

Important:
Keep frontend flexible — do not hardcode assumptions about data structure.

---

## Timeline (Realistic Solo Dev)

- Foundation + Layout → 2–3 days
- Landing Page → 3–5 days
- Stats UI → 1–2 weeks
- Analytics Page → 1 week
- Integration → 1 week
- Polish → 3–5 days

### Total: ~3–5 weeks

---

## Personal Notes

- Build with mock data first → always
- Focus on reusable components
- Avoid over-engineering
- Keep everything modular for easy API integration later
- Don’t touch anything outside defined scope

---

## Final Mindset

This is a **clean, focused build**, not a massive system.

Goal:

- Deliver fast
- Keep it maintainable
- Make integration smooth

If done right, this becomes a solid production-ready frontend without unnecessary complexity.
